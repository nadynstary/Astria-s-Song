# -*- coding: utf-8 -*-
"""Image sonification: a radial scan turns an image into a bell melody,
then image brightness/contrast shape the echo and reverb.

Works in Colab (upload dialog) or locally:  python sonification.py my_image.jpg
"""

import sys
import numpy as np
from PIL import Image, ImageOps
from scipy.io import wavfile
from scipy.ndimage import uniform_filter1d
from scipy.signal import butter, sosfilt, fftconvolve, find_peaks

SR = 22050
# Major pentatonic + the 7th (6 notes per octave). Renamed from "PENTATONIC",
# which was misleading since it has 6 notes.
SCALE = (0, 2, 4, 7, 9, 11)


# --------------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------------
def normalize(x, peak=0.9):
    return x / (np.max(np.abs(x)) + 1e-9) * peak


def _filt(x, kind, fc, order=4):
    sos = butter(order, fc, kind, fs=SR, output="sos")
    return sosfilt(sos, x, axis=0)


def _rms(x):
    return np.sqrt(np.mean(x ** 2)) + 1e-9


def load_gray(img, max_size=500):
    """PIL image -> float grayscale array in [0, 1], downsized for speed.
    Fixes EXIF rotation and puts transparent images on black."""
    img = ImageOps.exif_transpose(img)
    if img.mode in ("RGBA", "LA", "P"):
        rgba = img.convert("RGBA")
        bg = Image.new("RGBA", rgba.size, (0, 0, 0, 255))
        img = Image.alpha_composite(bg, rgba)
    g = img.convert("L")
    g.thumbnail((max_size, max_size))
    return np.asarray(g, dtype=float) / 255.0


def image_features(a):
    """Brightness and contrast that drive the reverb/echo settings."""
    return {"brightness": float(a.mean()), "contrast": float(a.std())}


# --------------------------------------------------------------------------
# Stage 1: radial scan -> melody
# --------------------------------------------------------------------------
def bell_note(freq, dur=1.5):
    """Unit-velocity bell tone (scaled by velocity at mix time)."""
    t = np.arange(int(dur * SR)) / SR
    tone = (np.sin(2 * np.pi * freq * t)
            + 0.2 * np.sin(2 * np.pi * 2 * freq * t) * np.exp(-t * 6)
            + 0.05 * np.sin(2 * np.pi * 3 * freq * t) * np.exp(-t * 9))
    env = np.minimum(1, t / 0.002) * np.exp(-t * 2.8)
    return tone * env


def sonify_radial(a, duration=10, n_steps=60, threshold=0.25,
                  low_note=48, high_note=84, center=(0.5, 0.5),
                  outside_in=True, invert=False, tail=2.0, n_angles=360,
                  auto_contrast=True):
    """a: grayscale float array in [0, 1] (see load_gray). Returns stereo audio.

    auto_contrast stretches the 2nd-98th percentile range to 0-1, so dark
    images (ocean, aurora, night sky) still produce notes at the same threshold.
    """
    a = a.copy()
    if auto_contrast:
        lo, hi = np.percentile(a, [2, 98])
        if hi - lo > 1e-6:
            a = np.clip((a - lo) / (hi - lo), 0, 1)
    if invert:
        a = 1.0 - a

    H, W = a.shape
    cx, cy = center[0] * (W - 1), center[1] * (H - 1)
    r_max = 0.75 * max(np.hypot(cx, cy), np.hypot(W - 1 - cx, cy),
                       np.hypot(cx, H - 1 - cy), np.hypot(W - 1 - cx, H - 1 - cy))

    midis = [m for m in range(low_note, high_note + 1) if m % 12 in SCALE]
    freqs = [440 * 2 ** ((m - 69) / 12) for m in midis]
    angles = np.linspace(0, 2 * np.pi, n_angles, endpoint=False)

    # ---- vectorized: sample every ring at once ----
    prog = np.arange(n_steps) / n_steps
    radii = np.maximum(r_max * (1 - prog) if outside_in else r_max * prog, 2)
    xs = np.round(cx + radii[:, None] * np.cos(angles)).astype(int)
    ys = np.round(cy + radii[:, None] * np.sin(angles)).astype(int)
    ok = (xs >= 0) & (xs < W) & (ys >= 0) & (ys < H)
    rings = np.zeros((n_steps, n_angles))
    rings[ok] = a[ys[ok], xs[ok]]
    rings = uniform_filter1d(rings, 3, axis=1, mode="wrap")  # 3-pt wrap smoothing

    peaks = ((rings > np.roll(rings, 1, axis=1))
             & (rings >= np.roll(rings, -1, axis=1))
             & (rings > threshold))

    step_t = duration / n_steps
    out = np.zeros((int((duration + tail) * SR), 2))
    bell_cache = {}  # each pitch is synthesized only once

    for j in range(n_steps):
        if not peaks[j].any():
            continue
        # only the single strongest peak per ring -> one clean melody line
        best = int(np.argmax(np.where(peaks[j], rings[j], -1.0)))

        frac = radii[j] / r_max
        closeness = 1 - frac if outside_in else frac
        gain = 0.2 + 0.8 * closeness

        th = (np.cos(angles[best]) + 1) * np.pi / 4   # pan from angle
        n_idx = int(best / n_angles * (len(freqs) - 1))  # pitch from angle
        if n_idx not in bell_cache:
            bell_cache[n_idx] = bell_note(freqs[n_idx])
        note = bell_cache[n_idx] * rings[j, best] * gain

        s = int(j * step_t * SR)
        e = min(s + len(note), len(out))
        out[s:e, 0] += note[:e - s] * np.cos(th)
        out[s:e, 1] += note[:e - s] * np.sin(th)

    if not np.any(out):
        print("WARNING: no notes were generated. Lower `threshold` or try invert=True.")
    return normalize(out)


# --------------------------------------------------------------------------
# Stage 2: sparkle, echo, reverb (shaped by image features)
# --------------------------------------------------------------------------
def _glint_bell(freq, dur=1.6):
    """Inharmonic bell used for the random glints."""
    t = np.arange(int(dur * SR)) / SR
    y = np.zeros_like(t)
    for ratio, amp, decay in [(1, 1.0, 3.0), (2.76, 0.5, 5.0), (5.4, 0.3, 8.0), (8.93, 0.15, 12.0)]:
        if freq * ratio < SR / 2 * 0.9:
            y += amp * np.sin(2 * np.pi * freq * ratio * t) * np.exp(-t * decay)
    return y * np.minimum(t / 0.002, 1)


def _taps(x, delay, fb, n_taps=9):
    out = np.zeros_like(x)
    d = int(delay * SR)
    for k in range(1, n_taps + 1):
        s = k * d
        if s >= len(x):
            break
        out[s:] += (fb ** k) * x[:-s]
    return out


def sparkle_and_echo(audio, sparkle=0.15, echo=0.2, reverb=0.15, tail=5.0,
                     seed=1, features=None):
    """Adds twinkle, glints, stereo echo and reverb. Echo speed/feedback follow
    image contrast; reverb length follows image brightness."""
    rng = np.random.default_rng(seed)
    dry = np.asarray(audio, float)
    if dry.ndim == 1:
        dry = np.stack([dry, dry], axis=1)
    n_in = len(dry)
    n = n_in + int(tail * SR)
    dry = np.pad(dry, ((0, n - n_in), (0, 0)))   # keeps the stereo panning
    mono = dry.mean(axis=1)
    ref = _rms(mono[:n_in])

    f = features or {"brightness": 0.5, "contrast": 0.25}
    reverb_decay = 0.5 + 4.5 * f["brightness"]
    delay_L = 0.15 + 0.35 * f["contrast"]
    delay_R = 0.22 + 0.45 * f["contrast"]
    feedback = 0.3 + 0.4 * f["contrast"]

    # 1) Twinkle: high frequencies gated by slow random flicker
    hi = _filt(dry, "highpass", 2500)
    flick = _filt(rng.normal(size=n), "lowpass", 18, 2)
    flick = np.clip(flick / (np.max(np.abs(flick)) + 1e-9), 0, None) ** 2
    flick /= flick.max() + 1e-9
    twinkle = hi * flick[:, None]
    twinkle *= min(ref / _rms(twinkle.mean(axis=1)), 20) * 0.5 * sparkle

    # 2) Glints: random bells triggered at the loudest moments.
    #    (Original bug: the envelope was a 6 Hz lowpass of the raw signed audio,
    #    which is ~0. It must be taken on abs(audio) to be a real envelope.)
    env = _filt(np.abs(mono), "lowpass", 6, 2)
    gL, gR = np.zeros(n), np.zeros(n)
    if env.max() > 0:
        peaks, props = find_peaks(env, height=0.35 * env.max(), distance=int(0.15 * SR))
        for p, h in zip(peaks, props["peak_heights"]):
            fr = 1568 * 2 ** (SCALE[rng.integers(len(SCALE))] / 12) * rng.choice([1, 1.5, 2])
            b = _glint_bell(fr) * (h / env.max()) * 0.35 * sparkle * ref * 4
            pan = rng.uniform(-0.9, 0.9)
            e = min(n, p + len(b))
            gL[p:e] += b[:e - p] * np.cos((pan + 1) * np.pi / 4)
            gR[p:e] += b[:e - p] * np.sin((pan + 1) * np.pi / 4)

    dL = dry[:, 0] + twinkle[:, 0] + gL
    dR = dry[:, 1] + twinkle[:, 1] + gR

    # 3) Echo: stereo delay, speed mapped to image contrast
    src = _filt(dL + dR, "lowpass", 5000, 2) * 0.5
    eL = _taps(src, delay_L, feedback)
    eR = _taps(src, delay_R, feedback)

    # 4) Reverb: noise-burst impulse response, decay mapped to brightness
    def ir(seed_):
        r = np.random.default_rng(seed_)
        m = int(4.0 * SR)
        t = np.arange(m) / SR
        h = r.normal(size=m) * np.exp(-t * reverb_decay)
        h[:int(0.02 * SR)] *= np.linspace(0, 1, int(0.02 * SR))
        return h

    wet_in = dL + dR + echo * (eL + eR)
    rL = fftconvolve(wet_in, ir(11))[:n]
    rR = fftconvolve(wet_in, ir(12))[:n]
    rL *= ref / _rms(rL) * 0.8 * reverb
    rR *= ref / _rms(rR) * 0.8 * reverb

    L = dL + echo * eL + rL
    R = dR + echo * eR + rR
    fade = np.minimum(np.arange(n)[::-1] / (SR * 1.5), 1)
    return normalize(np.stack([L * fade, R * fade], axis=1))


# --------------------------------------------------------------------------
# Pipeline, diagnostics, I/O
# --------------------------------------------------------------------------
def image_to_sound(img, out_path="scan.wav", duration=8, n_steps=60,
                   threshold=0.25, sparkle=0.15, echo=0.2, reverb=0.15,
                   **radial_kwargs):
    a = load_gray(img)
    feats = image_features(a)   # measured BEFORE contrast stretching, so dark images stay "dark"
    audio = sonify_radial(a, duration=duration, n_steps=n_steps,
                          threshold=threshold, **radial_kwargs)
    audio = sparkle_and_echo(audio, sparkle=sparkle, echo=echo,
                             reverb=reverb, features=feats)
    save_wav(out_path, audio)
    return audio


def save_wav(path, audio):
    wavfile.write(path, SR, (np.clip(audio, -1, 1) * 32767).astype(np.int16))


def diagnose(img, threshold=0.25, n_angles=360):
    """Prints image stats and how many peaks each ring would produce.
    Takes the image directly (the original version silently reused whatever
    `img` was last assigned, and used hardcoded /content paths)."""
    a = load_gray(img)
    print(f"size {a.shape} | min {a.min():.3f} max {a.max():.3f} "
          f"mean {a.mean():.3f} std {a.std():.3f}")
    H, W = a.shape
    cx, cy = (W - 1) / 2, (H - 1) / 2
    r_max = 0.75 * np.hypot(cx, cy)
    angles = np.linspace(0, 2 * np.pi, n_angles, endpoint=False)
    for frac in (0.25, 0.5, 0.75):
        r = max(r_max * frac, 2)
        xs = np.round(cx + r * np.cos(angles)).astype(int)
        ys = np.round(cy + r * np.sin(angles)).astype(int)
        ok = (xs >= 0) & (xs < W) & (ys >= 0) & (ys < H)
        b = np.zeros(n_angles)
        b[ok] = a[ys[ok], xs[ok]]
        b = uniform_filter1d(b, 3, mode="wrap")
        pk = (b > np.roll(b, 1)) & (b >= np.roll(b, -1)) & (b > threshold)
        print(f"  radius {frac:.2f}: {pk.sum()} peaks > {threshold}")


def get_image_path():
    try:
        from google.colab import files
        uploaded = files.upload()
        return list(uploaded.keys())[0]
    except ImportError:
        if len(sys.argv) > 1:
            return sys.argv[1]
        raise SystemExit("Usage: python sonification.py <image>")


if __name__ == "__main__":
    path = get_image_path()
    img = Image.open(path)
    print("image size:", img.size)
    diagnose(img)

    audio = image_to_sound(img, "scan.wav", duration=8, n_steps=60, threshold=0.25)
    print(f"audio samples: {len(audio)} | max: {np.max(np.abs(audio)):.3f}")

    try:
        from IPython.display import Audio, display
        display(Audio("scan.wav"))
    except ImportError:
        print("Saved scan.wav")