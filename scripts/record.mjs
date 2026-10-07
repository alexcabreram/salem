// Records short GIFs of the page's motion in real time through the Chrome DevTools Protocol.
// Run with the preview server up: node scripts/record.mjs
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'http://localhost:4321/';
const PORT = 9333;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const clips = [
  // fresh: clear session so the intro plays. scrollTo: element to bring into view before recording.
  { name: 'intro-hero', fresh: true, duration: 6500, every: 160 },
  { name: 'today', scrollTo: '#today', duration: 7000, every: 220 },
  { name: 'world-mission', scrollTo: '#world .world', block: 'center', duration: 7500, every: 220 },
  { name: 'routing', scrollTo: '.routes', block: 'center', duration: 3000, every: 120 },
  { name: 'architecture', scrollTo: '.arch', block: 'center', duration: 3000, every: 120 },
  { name: 'hero-delegate', hover: '[data-delegate]', duration: 4000, every: 160 },
];

const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`, '--hide-scrollbars',
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'salem-rec-'))}`, '--window-size=1440,900', 'about:blank',
]);

let ws;
let seq = 0;
const pending = new Map();
function send(method, params = {}) {
  const id = ++seq;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve) => pending.set(id, resolve));
}
const evaluate = (expression) => send('Runtime.evaluate', { expression, awaitPromise: true });

try {
  let target;
  for (let i = 0; i < 50 && !target; i++) {
    await sleep(200);
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      target = list.find((t) => t.type === 'page');
    } catch {}
  }
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  ws.addEventListener('message', (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
  });
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

  for (const c of clips) {
    await send('Page.navigate', { url: BASE });
    await sleep(1200);
    if (c.fresh) {
      await evaluate('sessionStorage.clear()');
      await send('Page.reload');
      await sleep(80);
    } else {
      await evaluate(`document.documentElement.classList.remove('intro'); sessionStorage.setItem('salem-intro','1')`);
    }
    if (c.scrollTo) {
      await evaluate(`document.querySelector('${c.scrollTo}').scrollIntoView({ block: '${c.block ?? 'start'}', behavior: 'instant' })`);
    }
    if (c.hover) {
      await sleep(600);
      const res = await evaluate(`JSON.stringify(document.querySelector('${c.hover}').getBoundingClientRect())`);
      const r = JSON.parse(res.result.value);
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: r.x - 200, y: r.y + 10 });
      await sleep(100);
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: r.x + r.width / 2, y: r.y + r.height / 2 });
    }
    const frames = [];
    const start = Date.now();
    while (Date.now() - start < c.duration) {
      const t0 = Date.now();
      const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 85 });
      frames.push({ buf: Buffer.from(shot.data, 'base64'), at: t0 });
      await sleep(Math.max(0, c.every - (Date.now() - t0)));
    }
    const delays = frames.map((f, i) => (i < frames.length - 1 ? frames[i + 1].at - f.at : c.every));
    const pngs = await Promise.all(frames.map((f) => sharp(f.buf).resize(960).png().toBuffer()));
    await sharp(pngs, { join: { animated: true } })
      .gif({ delay: delays, loop: 0, colours: 128, effort: 7, dither: 0.6 })
      .toFile(`design/motion/${c.name}.gif`);
    console.log(c.name, frames.length, 'frames');
  }
} finally {
  ws?.close();
  chrome.kill();
}
