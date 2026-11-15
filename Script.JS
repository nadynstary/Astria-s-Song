/* ==========================================================
   Asteria's Song · Earth Jukebox
   1. Data       – the six events
   2. Icons      – tiny pixel-art grids rendered as SVG
   3. Audio      – Tone.js sound profiles (one per event)
   4. UI         – build markers, hover/focus logic, start button
   ========================================================== */

/* ----------------------------------------------------------
   1. DATA
   position: top/left in % of the map container (tweak freely).
   nasaLink: placeholder – replace "#" with the official NASA page.
   icon:     key into PIXEL_ICONS below. To use your own PNG instead,
             add  iconSrc: "assets/ocean.png"  to an event.
   sound:    key into the profiles built in section 3.
   ---------------------------------------------------------- */
const EVENTS = [
  {
    id: "ocean-currents",
    name: "Ocean Currents",
    position: { top: 40, left: 34 },
    iconSrc: "assets/waves.png",
    description:
      "Satellites measure sea surface height, temperature and salinity to show how currents carry heat around the planet.",
    nasaLink: "https://svs.gsfc.nasa.gov/3912/#media_group_349713",
    icon: "ocean",
    sound: "ocean",
    audioSrc: "assets/sound/ocean_new.mp3",
    soundLabel: "Flowing water: a rolling arpeggio over a soft wave wash",
    descriptionAudio: "assets/audio/Ocean-Currents-des.wav",
  },
  {
    id: "forest-fires",
    name: "Forest Fires",
    position: { top: 72, left: 84 },
    iconSrc:"assets/wildfire.png",
    description:
      "Instruments on NASA satellites detect active fires and map burned areas, even through remote forest.",
    nasaLink: "https://firms2.modaps.eosdis.nasa.gov/usfs/map2/#d:24hrs;v:kiosk;@-100.0,40.0,4.0z",
    icon: "fire",
    sound: "fire",
    soundLabel: "Warm pulsing synth with random crackles",
    descriptionAudio: "assets/audio/Forest-Fires-des.wav",
  },
  {
    id: "air-quality",
    name: "Air Quality",
    position: { top: 40, left: 74 },
    iconSrc: "assets/air_quality.png",
    description:
      "From orbit, NASA tracks pollutants such as nitrogen dioxide and ozone that affect the air people breathe.",
    nasaLink: "https://worldview.earthdata.nasa.gov/?v=-62.406639215349486,-49.09650631635001,164.87263044408857,59.7833532325431&df=true&kiosk=true&eic=si&scenario=12&l=Coastlines_15m,AIRS_L3_Carbon_Monoxide_500hPa_Volume_Mixing_Ratio_Daily_Night,AIRS_L3_Carbon_Monoxide_500hPa_Volume_Mixing_Ratio_Daily_Day&lg=false&t=2026-11-08-T00%3A00%3A00Z",
    icon: "air",
    sound: "air",
    soundLabel: "Airy wind with a few drifting high notes",
    descriptionAudio: "assets/audio/Air_Quality-des.wav",
  },
  {
    id: "aerosols",
    name: "Aerosols",
    position: { top: 52, left: 48 },
    iconSrc:"assets/aerosols.png",
    description:
      "Dust, smoke and sea salt hang in the air as tiny particles. Satellites follow where they travel and how thick they are.",
    nasaLink: "https://svs.gsfc.nasa.gov/5669/#media_group_380698",
    icon: "aerosols",
    sound: "aerosols",
    soundLabel: "Scattered chimes that appear at random, like drifting particles",
    descriptionAudio: "assets/audio/Aerosols-des.wav",
  },
  {
    id: "night-lights",
    name: "Night Lights",
    position: { top: 27, left: 54 },
    iconSrc: "assets/city_lights.png",
    description:
      "Images of Earth at night reveal cities, roads and power outages, a map of human activity glowing in the dark.",
    nasaLink: "https://svs.gsfc.nasa.gov/5313/#media_group_374656",
    icon: "night",
    sound: "night",
    soundLabel: "Sparkling high notes that climb and fall",
    descriptionAudio: "assets/audio/Night-Lights-des.wav",
  },
  {
    id: "aurora",
    name: "Aurora",
    position: { top: 14, left: 24 },
    iconSrc: "assets/aurora.png", // custom PNG instead of pixel icon
    description:
      "Charged particles from the Sun collide with Earth's magnetic field and make the sky glow near the poles.",
    nasaLink: "https://science.nasa.gov/sun/auroras/",
    icon: "aurora",
    sound: "aurora",
    soundLabel: "Slow, dreamy synth pad with changing chords",
    descriptionAudio: "assets/audio/Aurora-des.wav",
  },
  {
    id: "lightning",
    name: "Lightning",
    position: { top: 19, left: 80 },
    iconSrc: "assets/lightning.png",
    description:
      "A sudden flash of light in the sky, often accompanied by a loud noise.",
    nasaLink: "https://svs.gsfc.nasa.gov/5011/",
    sound: "lightning",
    audioSrc: "assets/sound/lightning.wav",
    soundLabel: "recorded",
    descriptionAudio: "assets/audio/Lightning-des.wav",
  },
  {
    id: "hurricanes",
    name: "Hurricanes",
    position: { top: 50, left: 20},
    iconSrc: "assets/hurricane.png",
    description:
      "a large, rotating tropical cyclone with sustained winds of 74 miles per hour (119 kilometers per hour) or greater",
    nasaLink: "http://svs.gsfc.nasa.gov/gallery/nasaand-hurricanes/",
    sound: "hurricane",
    audioSrc: "assets/sound/04_ocean_hurricanes.mp3",
    soundLabel: "recorded",
    descriptionAudio: "assets/audio/Hurricanes-des.wav",
  },
   {
    id: "NASA",
    name: "NASA",
    position: { top: 90, left: 50},
    iconSrc: "assets/NASA_SON.png",
    description:
      "NASA is the United States government agency. by clicking the link you can access a collection of sonifications related to the hubble mission and more. ",
    nasaLink: "https://svs.gsfc.nasa.gov/13786/",
    sound: "sonification",
    audioSrc: "assets/sound/hubble-sonification.mp4",
    soundLabel: "recorded",
    descriptionAudio: "assets/audio/nasa-des.wav",
  },
  {
    id: "Bahrain",
    name: "Bahrain",
    position: { top: 40, left: 60},
    iconSrc: "assets/bahrain.png",
    description:
      "Bahrain experiences many natural events that often go unnoticed. From shifting skies to changes across land and sea, our island is always in motion. Click the link to explore a website that tracks natural events across our beautiful country.",
    nasaLink: "https://worldnaturaldisasters.com/country/bahrain",
    sound: "",
    audioSrc: "assets/sound/bahrain.mp3",
    soundLabel: "Our beautiful bahrain sea waves",
    descriptionAudio: "assets/audio/bahrain-des.wav",
  },
];

/* ----------------------------------------------------------
   2. PIXEL ICONS
   8x8 grids. Each letter = one colour from PIXEL_PALETTE, "." = empty.
   ---------------------------------------------------------- */
const PIXEL_PALETTE = {
  B: "#2f7fd8", // water blue
  D: "#1b4f9c", // deep blue
  W: "#e8f6ff", // foam / cloud white
  R: "#c62828", // fire red
  O: "#f57c00", // fire orange
  Y: "#ffd54f", // yellow
  G: "#4caf50", // aurora green
  P: "#a06cd5", // purple
  S: "#9aa5b1", // smog grey
  C: "#5ad1d9", // wind cyan
  T: "#d9a066", // dust tan
};

const PIXEL_ICONS = {
  ocean: [
    "........",
    "..WW....",
    ".WBBW.WW",
    "WB..BWBB",
    "B....BB.",
    "BBBBBBBB",
    "DDDDDDDD",
    "........",
  ],
  fire: [
    "...R....",
    "..RR.R..",
    ".RORRR..",
    ".ROOORO.",
    "ROOOYOOR",
    "RYYYYYOR",
    ".RYYYYR.",
    "..RRRR..",
  ],
  air: [
    "..SSSS..",
    ".SWWWSS.",
    "SWWWWWSS",
    "SSSSSSSS",
    "........",
    "C.CC.CC.",
    ".CC.CC.C",
    "........",
  ],
  aerosols: [
    "........",
    ".P....Y.",
    "...B....",
    "Y....P..",
    "..P..B..",
    ".B...Y..",
    "....P..B",
    "T.......",
  ],
  night: [
    "...Y....",
    "...Y....",
    "..YYY...",
    "YYYWYYY.",
    "..YYY...",
    "...Y....",
    "...Y....",
    "........",
  ],
  aurora: [
    "..G.....",
    "..G...P.",
    ".GG..PP.",
    ".GGG.PP.",
    ".GGGPPP.",
    "GGGG.PP.",
    "G.GG.P..",
    "..G.....",
  ],
};

/** Turn a pixel grid into an inline SVG string (one <rect> per pixel). */
function pixelIconSVG(key) {
  const grid = PIXEL_ICONS[key];
  let rects = "";
  grid.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (PIXEL_PALETTE[ch]) {
        rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${PIXEL_PALETTE[ch]}"/>`;
      }
    });
  });
  return `<svg viewBox="0 0 8 8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
}

/* ----------------------------------------------------------
   3. AUDIO (Tone.js)
   Each profile is { bpm, start(), stop() }.
   Only one sound plays at a time, driven by the shared Transport.
   ---------------------------------------------------------- */
const audio = {
  ready: false,
  current: null,
  profiles: {},

  /** Must be called after Tone.start() (needs a user click). */
  async init() {
    Tone.Destination.volume.value = -6;

    // Shared output: dry signal + a little reverb, then a limiter to avoid clipping
    const limiter = new Tone.Limiter(-3).toDestination();
    const reverb = new Tone.Reverb({ decay: 3.5, wet: 1 }).connect(limiter);
    const out = new Tone.Gain(0.8).connect(limiter);
    out.connect(new Tone.Gain(0.3).connect(reverb)); // 30% of the signal to reverb
    await reverb.ready;

    this.profiles = {
      ocean: makeOcean(out),
      fire: makeFire(out),
      air: makeAir(out),
      aerosols: makeAerosols(out),
      night: makeNight(out),
      aurora: makeAurora(out),
    };
        // Load any events that use an MP3 file instead of a synth
    EVENTS.filter((e) => e.audioSrc).forEach((e) => {
      const player = new Tone.Player({
        url: e.audioSrc,
        loop: e.loop ?? false,
        fadeIn: 0.1,
        fadeOut: 0.3,
        volume: -6,
      }).connect(out);

      this.profiles[e.sound] = {
        bpm: 120,
        start() { player.start(); },
        stop()  { player.stop(); },
      };
    });
    try { await Tone.loaded(); } catch (e) { console.warn("A sound file failed to load:", e); }
        this.ready = true;
  },

  play(key) {
    if (!this.ready) return;
    this.stop();
    const profile = this.profiles[key];
    if (!profile) return;
    Tone.Transport.stop();
    Tone.Transport.bpm.value = profile.bpm;
    profile.start();
    Tone.Transport.start();
    this.current = profile;
  },

  stop() {
    if (!this.current) return;
    this.current.stop();
    this.current = null;
    Tone.Transport.stop();
  },
};

/* Small helpers --------------------------------------------------- */
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/** Looping noise bed (wind / water wash) with fade in/out. */
function makeNoiseBed(out, { type, level, filterFreq, filterBase, octaves }) {
  const noise = new Tone.Noise(type);
  noise.volume.value = -60;
  const sweep = new Tone.AutoFilter({
    frequency: filterFreq,
    baseFrequency: filterBase,
    octaves,
  }).start();
  noise.chain(sweep, out);
  return {
    start() {
      noise.start();
      noise.volume.rampTo(level, 0.4);
    },
    stop() {
      noise.volume.rampTo(-60, 0.3);
      noise.stop("+0.35");
    },
  };
}

/* 1. Ocean Currents: flowing water ------------------------------- */
function makeOcean(out) {
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" },
    envelope: { attack: 0.05, decay: 0.3, sustain: 0.3, release: 1.5 },
  });
  synth.chain(new Tone.Chorus(2, 3.5, 0.7).start(), new Tone.FeedbackDelay("8n.", 0.35), out);

  const wash = makeNoiseBed(out, { type: "pink", level: -30, filterFreq: 0.4, filterBase: 200, octaves: 2.5 });

  // D minor arpeggio rolling up and down like a wave
  const notes = ["D3", "A3", "D4", "F4", "A4", "F4", "D4", "A3"];
  const seq = new Tone.Sequence((time, note) => synth.triggerAttackRelease(note, "8n", time, 0.5), notes, "8n");

  return {
    bpm: 100,
    start() { wash.start(); seq.start(0); },
    stop() { seq.stop(); synth.releaseAll(); wash.stop(); },
  };
}

/* 2. Forest Fires: warm pulse + crackle -------------------------- */
function makeFire(out) {
  // Low, warm sawtooth pulse that "breathes" via tremolo
  const pulse = new Tone.Synth({
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.02, decay: 0.4, sustain: 0.2, release: 0.6 },
  });
  pulse.chain(new Tone.Filter(600, "lowpass"), new Tone.Tremolo(6, 0.6).start(), out);

  // Short bursts of high-passed noise = crackling embers
  const crackle = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.05, sustain: 0 },
  });
  crackle.volume.value = -14;
  crackle.chain(new Tone.Filter(2500, "highpass"), out);

  const seq = new Tone.Sequence(
    (time, step) => {
      if (step % 4 === 0) pulse.triggerAttackRelease(step % 8 === 0 ? "A2" : "E3", "8n", time, 0.6);
      if (Math.random() < 0.45) crackle.triggerAttackRelease("32n", time, 0.2 + Math.random() * 0.8);
    },
    [0, 1, 2, 3, 4, 5, 6, 7],
    "16n"
  );

  return {
    bpm: 110,
    start() { seq.start(0); },
    stop() { seq.stop(); },
  };
}

/* 3. Air Quality: airy / windy ----------------------------------- */
function makeAir(out) {
  const wind = makeNoiseBed(out, { type: "pink", level: -22, filterFreq: 0.25, filterBase: 400, octaves: 3 });

  const breath = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.4, decay: 0.5, sustain: 0.2, release: 2 },
  });
  breath.chain(new Tone.Chorus(1.5, 3, 0.6).start(), out);

  // Sparse, floating notes (null = rest)
  const notes = ["E5", null, "B4", null, "F#5", null, null, "G#4"];
  const seq = new Tone.Sequence((time, note) => {
    if (note) breath.triggerAttackRelease(note, "4n", time, 0.35);
  }, notes, "4n");

  return {
    bpm: 80,
    start() { wind.start(); seq.start(0); },
    stop() { seq.stop(); breath.triggerRelease(); wind.stop(); },
  };
}

/* 4. Aerosols: scattered particle chimes ------------------------- */
function makeAerosols(out) {
  const chime = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 8,
    modulationIndex: 2,
    envelope: { attack: 0.001, decay: 0.8, sustain: 0, release: 1 },
    modulation: { type: "square" },
    modulationEnvelope: { attack: 0.002, decay: 0.2, sustain: 0, release: 0.2 },
  });
  chime.volume.value = -10;
  chime.chain(new Tone.PingPongDelay("16n", 0.4), out);

  const scale = ["C6", "D6", "E6", "G6", "A6", "C7", "D7"]; // C major pentatonic
  const seq = new Tone.Sequence(
    (time) => {
      // About half the steps stay silent, so chimes feel randomly scattered
      if (Math.random() < 0.5) chime.triggerAttackRelease(pick(scale), "16n", time, 0.3 + Math.random() * 0.4);
    },
    [0, 1, 2, 3, 4, 5, 6, 7],
    "16n"
  );

  return {
    bpm: 120,
    start() { seq.start(0); },
    stop() { seq.stop(); chime.releaseAll(); },
  };
}

/* 5. Night Lights: sparkling high notes -------------------------- */
function makeNight(out) {
  const spark = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: { attack: 0.005, decay: 0.25, sustain: 0, release: 0.6 },
  });
  spark.volume.value = -8;
  spark.chain(new Tone.FeedbackDelay("8n", 0.4), out);

  // Bright arpeggio that climbs and falls
  const notes = ["C5", "E5", "G5", "B5", "C6", "E6", "G6", "B6", "G6", "E6", "C6", "B5", "G5", "E5"];
  const seq = new Tone.Sequence((time, note) => spark.triggerAttackRelease(note, "32n", time, 0.5), notes, "16n");

  return {
    bpm: 110,
    start() { seq.start(0); },
    stop() { seq.stop(); spark.releaseAll(); },
  };
}

/* 6. Aurora: ethereal, dreamy pad -------------------------------- */
function makeAurora(out) {
  const pad = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "fatsawtooth", count: 3, spread: 30 },
    envelope: { attack: 1.5, decay: 1, sustain: 0.6, release: 3 },
  });
  pad.volume.value = -14;
  pad.chain(new Tone.Filter(1200, "lowpass"), new Tone.Chorus(0.5, 3.5, 0.8).start(), out);

  // Slowly drifting chords (Dmaj7 → Gmaj7 → Bm9)
  const chords = [
    ["D3", "A3", "C#4", "F#4"],
    ["G3", "B3", "D4", "F#4"],
    ["B2", "F#3", "A3", "C#4"],
  ];
  const seq = new Tone.Sequence((time, chord) => pad.triggerAttackRelease(chord, "2n", time, 0.6), chords, "2n");

  return {
    bpm: 70,
    start() { seq.start(0); },
    stop() { seq.stop(); pad.releaseAll(); },
  };
}

/* ----------------------------------------------------------
   4. UI
   ---------------------------------------------------------- */
const mapEl = document.getElementById("map");
/* Audio description player (for visually impaired users).
   Keeps playing after the mouse leaves; stops when it ends, when the
   button is pressed again, when another icon is activated, or on Escape. */
const describer = {
  el: null,
  button: null,

  setPlaying(button, on) {
    button.classList.toggle("is-playing", on);
    button.setAttribute("aria-pressed", String(on));
    button.setAttribute(
      "aria-label",
      `${on ? "Stop" : "Listen to"} audio description of ${button.dataset.name}`
    );
  },

  toggle(src, button) {
    const wasThis = this.button === button;
    this.stop();
    if (wasThis) return;            // pressing again = stop
    audio.stop();                   // silence the sonification first
    this.el = new Audio(src);
    this.button = button;
    this.setPlaying(button, true);
    this.el.addEventListener("ended", () => this.stop());
    this.el.play().catch(() => this.stop());
  },

  stop() {
    if (this.el) { this.el.pause(); this.el = null; }
    if (this.button) { this.setPlaying(this.button, false); this.button = null; }
  },
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") describer.stop();
});
/** Build one marker (icon button + tooltip) for an event. */
function createMarker(event) {
  const marker = document.createElement("div");
  marker.className = "marker";
  marker.style.top = `${event.position.top}%`;
  marker.style.left = `${event.position.left}%`;

  // Icon: custom PNG if provided, otherwise the built-in pixel SVG
  const iconHTML = event.iconSrc
    ? `<img src="${event.iconSrc}" alt="">`
    : pixelIconSVG(event.icon);

  marker.innerHTML = `
    <button class="icon" type="button" aria-label="${event.name}">${iconHTML}</button>
    <div class="tooltip" role="tooltip">
      <div class="tooltip-head">
        <h2 class="tooltip-title">${event.name}</h2>
        ${event.descriptionAudio ? `
          <button class="tooltip-listen" type="button" aria-pressed="false"
                  title="Listen to audio description"
                  aria-label="Listen to audio description of ${event.name}"
                  data-name="${event.name}">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M3 9v6h4l5 4V5L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54z"/>
            </svg>
          </button>` : ""}
      </div>
      <p class="tooltip-desc">${event.description}</p>
      <p class="tooltip-sound">♪ ${event.soundLabel}</p>
      <a class="tooltip-link" href="${event.nasaLink}" target="_blank" rel="noopener">
        Explore the NASA data
      </a>
    </div>
  `;

   // Speaker button (only exists if the event has a description file)
  const listenBtn = marker.querySelector(".tooltip-listen");
  if (listenBtn) {
    listenBtn.addEventListener("click", () =>
      describer.toggle(event.descriptionAudio, listenBtn)
    );
  }

  // --- Hover: show tooltip + play sound instantly ---
  const activate = () => {
    if (marker.classList.contains("is-active")) return;   // already active, don't restart the sound
    marker.classList.add("is-active");
    if (listenBtn && describer.button === listenBtn) return; // description playing: stay quiet
    describer.stop();               // moving to a new icon stops any description
    audio.play(event.sound);
  };
  const deactivate = () => {
    marker.classList.remove("is-active");
    audio.stop();
  };

  marker.addEventListener("mouseenter", activate);
  marker.addEventListener("mouseleave", deactivate);

  // Keyboard support: Tab to an icon = same as hovering
  marker.addEventListener("focusin", activate);
  marker.addEventListener("focusout", (e) => {
    if (!marker.contains(e.relatedTarget)) deactivate();
  });

  return marker;
}

EVENTS.forEach((event) => mapEl.appendChild(createMarker(event)));

/* Start button: browsers only allow audio after a user gesture */
const overlay = document.getElementById("start-overlay");
document.getElementById("start-btn").addEventListener("click", async () => {
  await Tone.start();   // unlocks the AudioContext
  await audio.init();   // builds all instruments
  overlay.classList.add("is-hidden");
});
