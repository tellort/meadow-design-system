/* Meadow feedback: synthesized sound and haptics for web apps. No audio files needed.
   Usage:  MeadowFeedback.configure({ vibe:'personal', sound:true, haptics:true, volume:.6 });   // sounds are the same in both vibes; haptics follow the vibe
           MeadowFeedback.autowire();              // Meadow buttons, toggles, tabs, chips, sliders and menus make feedback on their own
           MeadowFeedback.event('success');        // sound + haptic together; or .play('success') / .haptic('success')
           <button data-feedback="success">        // explicit event on click; data-feedback="none" silences an element
   Events: tap, toggle-on, toggle-off, select, success, warning, error, sheet-open, sheet-close, toast, delete, notify, tick, refresh.
   Rules: sound is OFF by default (turn it on from an in-app setting), starts only after a user gesture, never plays on scroll or on load,
   and never carries information alone. Haptics use navigator.vibrate (Android and desktop Chrome; iOS Safari ignores it, use the Swift file in native apps). */
(function () {
  var cfg = { sound: false, haptics: true, volume: 0.6, vibe: 'personal', soundSet: 'clean' };
  var ctx = null, master = null, lastTick = 0;

  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function ensure() {
    if (!cfg.sound) return null;
    if (!ctx) {
      var C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C(); master = ctx.createGain(); master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    master.gain.value = cfg.volume;
    return ctx;
  }
  function env(g, t, peak, att, dur) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + att);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }
  // One voice: fundamental with optional slide (f2) and one decaying overtone (part).
  function osc(t, o) {
    var g = ctx.createGain(), f = ctx.createBiquadFilter(), s = ctx.createOscillator();
    f.type = 'lowpass'; f.frequency.value = o.lp || 4000;
    s.type = o.type || 'sine'; s.frequency.setValueAtTime(o.f, t);
    if (o.f2) s.frequency.exponentialRampToValueAtTime(o.f2, t + o.dur);
    env(g, t, o.gain || 0.15, o.att || 0.004, o.dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + o.dur + 0.05);
    if (o.part) {
      var p = ctx.createOscillator(), pg = ctx.createGain();
      p.frequency.setValueAtTime(o.f * o.part, t);
      env(pg, t, (o.gain || 0.15) * (o.partGain || 0.35), o.att || 0.004, o.dur * 0.5);
      p.connect(pg); pg.connect(master); p.start(t); p.stop(t + o.dur);
    }
  }
  // Filtered noise sweep, used for soft whooshes.
  function noise(t, o) {
    var len = Math.floor(ctx.sampleRate * o.dur), b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = b; f.type = 'bandpass'; f.Q.value = o.q || 1.2;
    f.frequency.setValueAtTime(o.f, t); f.frequency.exponentialRampToValueAtTime(o.f2 || o.f, t + o.dur);
    env(g, t, o.gain || 0.05, o.att || 0.03, o.dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(t);
  }
  // Marimba (optional set, configure({ soundSet:'marimba' })): warm, soft plucks on a C major pentatonic scale.
  function pl(t, m, d, g) { osc(t, { f: hz(m), dur: d, gain: g, part: 2, partGain: 0.35, lp: 3500 }); }
  // Clean (default sound set for BOTH vibes): short, dry, high and quiet.
  function ck(t, f, d, g, f2) { osc(t, { f: f, f2: f2, dur: d, gain: g, att: 0.002, lp: 6000 }); }

  var SETS = {
    marimba: {
      'tap': function (t) { pl(t, 79, 0.10, 0.14); },
      'toggle-on': function (t) { pl(t, 76, 0.10, 0.14); pl(t + 0.06, 81, 0.14, 0.15); },
      'toggle-off': function (t) { pl(t, 81, 0.09, 0.10); pl(t + 0.06, 76, 0.12, 0.10); },
      'select': function (t) { pl(t, 84, 0.06, 0.08); },
      'success': function (t) { pl(t, 72, 0.14, 0.16); pl(t + 0.08, 76, 0.14, 0.16); pl(t + 0.16, 79, 0.32, 0.18); },
      'warning': function (t) { pl(t, 77, 0.12, 0.15); pl(t + 0.15, 77, 0.16, 0.15); },
      'error': function (t) { osc(t, { f: 392, f2: 311, type: 'triangle', dur: 0.26, gain: 0.15, lp: 1800, att: 0.01 }); },
      'sheet-open': function (t) { noise(t, { f: 400, f2: 1800, dur: 0.24, gain: 0.05 }); pl(t + 0.12, 72, 0.2, 0.10); },
      'sheet-close': function (t) { noise(t, { f: 1800, f2: 400, dur: 0.2, gain: 0.04 }); },
      'toast': function (t) { osc(t, { f: hz(81), dur: 0.34, gain: 0.12, part: 3, partGain: 0.25, lp: 4500 }); },
      'delete': function (t) { osc(t, { f: 150, f2: 70, dur: 0.16, gain: 0.26, lp: 900, att: 0.003 }); },
      'notify': function (t) { pl(t, 76, 0.14, 0.15); pl(t + 0.12, 83, 0.3, 0.16); },
      'tick': function (t) { osc(t, { f: 1800, dur: 0.025, gain: 0.05, att: 0.002 }); },
      'refresh': function (t) { pl(t, 79, 0.12, 0.13); pl(t + 0.07, 84, 0.24, 0.13); }
    },
    clean: {
      'tap': function (t) { ck(t, 1400, 0.03, 0.07); },
      'toggle-on': function (t) { ck(t, 900, 0.03, 0.07); ck(t + 0.045, 1350, 0.04, 0.07); },
      'toggle-off': function (t) { ck(t, 1350, 0.03, 0.05); ck(t + 0.045, 900, 0.04, 0.05); },
      'select': function (t) { ck(t, 1700, 0.02, 0.05); },
      'success': function (t) { ck(t, 1319, 0.07, 0.09); ck(t + 0.08, 1976, 0.12, 0.09); },
      'warning': function (t) { ck(t, 880, 0.06, 0.09); ck(t + 0.10, 880, 0.08, 0.09); },
      'error': function (t) { ck(t, 330, 0.16, 0.10, 262); },
      'sheet-open': function (t) { noise(t, { f: 900, f2: 2400, dur: 0.16, gain: 0.025, q: 0.8 }); },
      'sheet-close': function (t) { noise(t, { f: 2400, f2: 900, dur: 0.14, gain: 0.02, q: 0.8 }); },
      'toast': function (t) { ck(t, 1047, 0.14, 0.08); },
      'delete': function (t) { ck(t, 220, 0.10, 0.14, 140); },
      'notify': function (t) { ck(t, 988, 0.08, 0.08); ck(t + 0.09, 1319, 0.12, 0.08); },
      'tick': function (t) { ck(t, 2200, 0.012, 0.035); },
      'refresh': function (t) { ck(t, 1047, 0.08, 0.07); ck(t + 0.06, 1568, 0.1, 0.07); }
    }
  };
  // Haptic patterns in milliseconds: vibrate, pause, vibrate...  Personal feels rounder (longer, softer), Clean crisper (shorter).
  var HAP = {
    personal: { 'tap': [10], 'toggle-on': [12, 30, 8], 'toggle-off': [8], 'select': [6], 'success': [10, 40, 10, 40, 22], 'warning': [16, 70, 16], 'error': [24, 60, 24, 60, 34], 'sheet-open': [8], 'sheet-close': [6], 'toast': [8], 'delete': [34], 'notify': [12, 60, 12], 'tick': [4], 'refresh': [10, 40, 14] },
    clean: { 'tap': [6], 'toggle-on': [8, 24, 6], 'toggle-off': [5], 'select': [4], 'success': [7, 34, 7, 34, 16], 'warning': [12, 60, 12], 'error': [18, 50, 18, 50, 26], 'sheet-open': [6], 'sheet-close': [4], 'toast': [5], 'delete': [26], 'notify': [8, 50, 8], 'tick': [3], 'refresh': [7, 34, 10] }
  };

  var API = {
    config: cfg,
    events: Object.keys(SETS.clean),
    patterns: HAP,
    configure: function (o) { for (var k in o) cfg[k] = o[k]; if (master) master.gain.value = cfg.volume; return API; },
    play: function (name) {
      var c = ensure(); if (!c) return;
      var set = SETS[cfg.soundSet] || SETS.clean, fn = set[name];
      if (fn) fn(c.currentTime + 0.01);
    },
    haptic: function (name) {
      if (!cfg.haptics || !navigator.vibrate) return;
      var p = (HAP[cfg.vibe] || HAP.personal)[name];
      if (p) navigator.vibrate(p);
    },
    event: function (name) { API.haptic(name); API.play(name); },
    autowire: function () {
      if (API._wired) return API; API._wired = true;
      var sel = '[data-feedback],.m-toggle,.m-seg button,.m-tabs button,.m-tab,.m-chip--select,.m-day,.m-pages button,.m-menu__item,.m-btn,.m-iconbtn,.m-fab';
      document.addEventListener('click', function (e) {
        var t = e.target.closest ? e.target.closest(sel) : null; if (!t) return;
        var n = t.getAttribute('data-feedback');
        if (n === 'none') return;
        if (!n) {
          if (t.matches('.m-toggle')) { setTimeout(function () { API.event(t.getAttribute('aria-checked') === 'true' ? 'toggle-on' : 'toggle-off'); }, 0); return; }
          n = t.matches('.m-seg button,.m-tabs button,.m-tab,.m-chip--select,.m-day,.m-pages button') ? 'select' : t.matches('.m-btn--danger') ? 'delete' : 'tap';
        }
        API.event(n);
      }, true);
      document.addEventListener('change', function (e) {
        if (e.target.matches && e.target.matches('.m-check input,.m-radio input')) API.event('select');
      }, true);
      document.addEventListener('input', function (e) {
        if (e.target.matches && e.target.matches('.m-slider')) { var now = Date.now(); if (now - lastTick > 45) { lastTick = now; API.event('tick'); } }
      }, true);
      return API;
    }
  };
  if (typeof window !== 'undefined') window.MeadowFeedback = API; // safe during server-side rendering
})();
