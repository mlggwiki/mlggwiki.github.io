// The unit page's Animation tab: the high-rarity card art as the game animates it (Spine, SBC:
// idle loop and camera moves), copied from the scene player (py -m wikitool images ->
// img/cardanim/<unit>/). Adapted from the player's web/cardanim.js: one card at a time, its own
// canvas and WebGL context, drawn only while it is on the page. The official spine-webgl runtime
// (4.2, the skeletons are 4.2) is loaded from jsDelivr the first time the tab opens.
"use strict";

const CardAnim = (() => {
  const RUNTIME = "https://cdn.jsdelivr.net/npm/@esotericsoftware/spine-webgl@4.2.120/dist/iife/spine-webgl.min.js";
  const W = 1280, H = 720, VW = 1920, VH = 1080, FIT = 1920 / 2222;
  let runtime = null, canvas = null, ctx = null, renderer = null;
  let card = null, raf = 0, last = 0, seq = 0;          // card: {key, atlas, skeleton, state, names}

  function loadRuntime() {
    if (!runtime) {
      runtime = new Promise((ok, fail) => {
        if (window.spine) return ok(window.spine);
        const s = document.createElement("script");
        s.src = RUNTIME;
        s.onload = () => (window.spine ? ok(window.spine) : fail(new Error("no spine runtime")));
        s.onerror = () => { runtime = null; fail(new Error("the Spine runtime could not be loaded")); };
        document.head.appendChild(s);
      });
    }
    return runtime;
  }

  function setup() {
    if (canvas) return;
    canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    canvas.className = "cardanim-canvas";
    ctx = new spine.ManagedWebGLRenderingContext(canvas, { alpha: false, premultipliedAlpha: false });
    renderer = new spine.SceneRenderer(canvas, ctx, true);
    renderer.camera.setViewport(VW, VH);
    renderer.camera.position.set(0, 0, 0);
  }

  // Load card KEY from FOLDER (img/cardanim/<key>/) and show it in HOST. -> the animation names
  async function show(host, folder, key) {
    const my = ++seq;
    await loadRuntime();
    if (my !== seq) return null;
    setup();
    if (!card || card.key !== key) {
      const [text, skel] = await Promise.all([
        fetch(`${folder}${key}.atlas`).then((r) => { if (!r.ok) throw new Error("atlas"); return r.text(); }),
        fetch(`${folder}${key}.json`).then((r) => { if (!r.ok) throw new Error("skeleton"); return r.json(); })]);
      if (my !== seq) return null;
      const atlas = new spine.TextureAtlas(text);
      await Promise.all(atlas.pages.map((page) => new Promise((ok, fail) => {
        const img = new Image();
        img.onload = () => { page.setTexture(new spine.GLTexture(ctx, img)); ok(); };
        img.onerror = () => fail(new Error("texture " + page.name));
        img.src = folder + page.name;
      })));
      if (my !== seq) { atlas.dispose(); return null; }
      const data = new spine.SkeletonJson(new spine.AtlasAttachmentLoader(atlas)).readSkeletonData(skel);
      const skeleton = new spine.Skeleton(data);
      skeleton.scaleX = skeleton.scaleY = FIT;
      const sd = new spine.AnimationStateData(data);
      sd.defaultMix = 0.2;
      const state = new spine.AnimationState(sd);
      const names = data.animations.map((a) => a.name);
      state.setAnimation(0, names.includes("IdlingLoop") ? "IdlingLoop" : names[0], true);
      free();
      card = { key, atlas, skeleton, state, names };
    }
    if (canvas.parentNode !== host) host.appendChild(canvas);
    start();
    return card.names;
  }

  function free() {
    stop();
    if (card) { card.atlas.dispose(); card = null; }
  }

  // a *CameraIn move plays once, then the idle loop
  function play(name) {
    if (!card) return;
    if (/CameraIn$/.test(name) && card.names.includes("IdlingLoop")) {
      card.state.setAnimation(0, name, false);
      card.state.addAnimation(0, "IdlingLoop", true, 0);
    } else card.state.setAnimation(0, name, true);
  }

  function start() {
    if (!raf && card) { last = 0; raf = requestAnimationFrame(frame); }
  }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

  function frame(now) {
    raf = 0;
    if (!card || !canvas.isConnected) return;               // off the page: stops by itself
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.1, last ? (now - last) / 1000 : 0);
    last = now;
    const { skeleton, state } = card;
    state.update(dt);
    state.apply(skeleton);
    skeleton.update(dt);
    skeleton.updateWorldTransform(spine.Physics.update);
    const gl = ctx.gl;
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    renderer.begin();
    renderer.drawSkeleton(skeleton, false);
    renderer.end();
  }

  return { show, play, stop, free };
})();
