const { app, BrowserWindow, WebContentsView, ipcMain, session, shell, dialog } = require('electron');
const path = require('path'), fs = require('fs'), os = require('os'), http = require('http'), cp = require('child_process');
const { pathToFileURL } = require('url');
const { WebSocketServer } = require('ws'), QR = require('qrcode');
let Bonjour; try { Bonjour = require('bonjour-service').Bonjour; } catch {}
if (!app.requestSingleInstanceLock()) app.quit();
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

const D = app.getPath('userData'), CF = path.join(D, 'config.json'), WP = path.join(D, 'wallpaper.jpg'), EXT = path.join(D, 'extensions');
const LOG = path.join(D, 'orcacast.log');
const log = (...a) => { try { fs.mkdirSync(D, { recursive: true }); fs.appendFileSync(LOG, new Date().toISOString() + ' ' + a.map(x => (x && x.stack) || x).join(' ') + '\n'); } catch {} };
process.on('uncaughtException', e => log('uncaught', e));
process.on('unhandledRejection', e => log('rejection', e));
const defaults = {
  pin: String(1000 + Math.floor(Math.random() * 9000)), theme: 0,
  apps: [
    { name: 'YouTube', url: 'https://www.youtube.com/tv', color: '#c4122f' },
    { name: 'Netflix', url: 'https://www.netflix.com', color: '#8a0b14' },
    { name: 'Prime Video', url: 'https://www.primevideo.com', color: '#0b6b94' },
    { name: 'Spotify', url: 'https://open.spotify.com', color: '#13803a' },
    { name: 'Twitch', url: 'https://www.twitch.tv', color: '#5b2fa6' }
  ]
};
let cfg; try { cfg = { ...defaults, ...JSON.parse(fs.readFileSync(CF)) }; } catch { cfg = defaults; }
const save = () => { fs.mkdirSync(D, { recursive: true }); fs.writeFileSync(CF, JSON.stringify(cfg)); };
const BUILTIN = [{ name: 'Radio', url: 'orcacast://radio', color: '#a21caf', icon: '📻' }, { name: 'Live TV', url: 'orcacast://tv', color: '#0369a1', icon: '📺' }];
if (!cfg.seeded) { for (const b of BUILTIN) if (!cfg.apps.some(a => a.url === b.url)) cfg.apps.push(b); cfg.seeded = 1; }
save();

let win, ov, view, viewHidden = false, port = 8787, off = false, listening = false, homeEdit = false, viewEdit = false, synthUntil = 0, ovT;
const cur = { x: 640, y: 360 };
const send = (c, d) => win && !win.isDestroyed() && win.webContents.send(c, d);
const sendApp = () => send('app', view ? { name: view.appName, active: !viewHidden } : null);
function osd(icon, text, ms) { // on-screen display, drawn above any app
  if (!ov || !win || win.isDestroyed()) return;
  try {
    const [w] = win.getContentSize(); ov.setBounds({ x: 0, y: 0, width: w, height: 150 }); ov.setVisible(true);
    ov.webContents.send('osd', { icon, text, ms }); clearTimeout(ovT);
    ovT = setTimeout(() => { try { ov.setVisible(false); } catch {} }, ms || 2100);
  } catch (e) { log('osd', e); }
}
const toast = t => osd('', t);
function ips() {
  const out = [];
  for (const [n, l] of Object.entries(os.networkInterfaces())) for (const i of l)
    if (i.family === 'IPv4' && !i.internal && !i.address.startsWith('169.254') && !/virtual|vmware|vbox|vethernet|wsl|hyper-v|loopback|bluetooth|tailscale|zerotier|docker/i.test(n)) out.push(i.address);
  const r = a => a.startsWith('192.168.') ? 0 : a.startsWith('10.') ? 1 : 2;
  return out.length ? out.sort((a, b) => r(a) - r(b)) : ['localhost'];
}
const push = () => send('cfg', { apps: cfg.apps, theme: cfg.theme || 0, ytShadow: cfg.ytShadow !== false, login: app.getLoginItemSettings().openAtLogin,
  wall: fs.existsSync(WP) ? pathToFileURL(WP).href + '?' + Date.now() : cfg.wallUrl || null });
async function pushPair() {
  const urls = [...ips(), os.hostname() + '.local'].map(a => `http://${a}:${port}`);
  send('pair', { urls, pin: cfg.pin, qr: await QR.toDataURL(`${urls[0]}/?pin=${cfg.pin}`, { margin: 1, width: 240 }) });
}
const norm = u => /^(https?|orcacast):/i.test(u) ? u : 'https://' + u;
function addApp(d) {
  if (!d || !d.name || !d.url) return;
  cfg.apps.push({ name: String(d.name).slice(0, 30), url: norm(String(d.url).trim()), thumb: d.thumb || undefined });
  save(); push(); osd('＋', 'Added ' + d.name);
}

// ---------- app browser ----------
const UA_TV = 'Mozilla/5.0 (SMART-TV; LINUX; Tizen 7.0) AppleWebKit/537.36 (KHTML, like Gecko) 94.0.4606.31/7.0 TV Safari/537.36';
const YT = /youtube\.com\/tv/;
function ytUrl(u) { try { const x = new URL(u); x.searchParams.set('env_forceFullAnimation', '1'); return x.toString(); } catch { return u; } } // YouTube TV: full animations
const YT_JS = `(()=>{if(window.__ocb)return;window.__ocb=1;setInterval(()=>{const b=document.body;if(!b)return;for(const c of [...b.children].flatMap(x=>[x,...x.children])){if(c.childElementCount<8){const t=c.textContent||'';if(t.length<500&&t.includes('DEBUG QUERY PARAMETERS'))c.style.display='none'}}},1500)})()`;
const YT_FIX_JS = `(()=>{if(window.__ocs)return;window.__ocs=1;
const SH='0 0 1px #000,0 1px 3px rgba(0,0,0,.95)',fixed=new WeakSet();
const dark=c=>{const n=(c||'').match(/[0-9.]+/g);if(!n||n.length<3)return false;const a=n.length>3?+n[3]:1;return a>0.04&&+n[0]<60&&+n[1]<60&&+n[2]<60};
function scan(){const v=document.querySelector('video');if(!v||!v.offsetWidth||!document.body)return;
const vr=v.getBoundingClientRect(),W=innerWidth,S=new Set(),w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n,c=0;
while((n=w.nextNode())&&c<800){if(!n.nodeValue.trim())continue;c++;let e=n.parentElement;for(let d=0;e&&d<3;d++,e=e.parentElement)S.add(e)}
for(const e of S){if(fixed.has(e))continue;if(!dark(getComputedStyle(e).backgroundColor))continue;const r=e.getBoundingClientRect();
if(r.height<1||r.height>170||r.width>W*0.96||r.bottom<vr.top||r.top>vr.bottom||r.right<vr.left||r.left>vr.right)continue;
if(e.closest('button,[role=button]')||e.querySelector('video,img,canvas,button'))continue;
fixed.add(e);e.style.setProperty('background','transparent','important');e.style.setProperty('text-shadow',SH,'important')}}
let dirty=1;new MutationObserver(()=>{dirty=1}).observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class']});
setInterval(()=>{if(!dirty)return;dirty=0;(window.requestIdleCallback||setTimeout)(scan)},1000)})()`;
const CURSOR_JS = `(()=>{let c,t;document.addEventListener('mousemove',e=>{if(!c){c=document.createElement('div');c.style.cssText='position:fixed;z-index:2147483647;width:22px;height:22px;border-radius:50%;background:#fffd;border:3px solid #000;box-shadow:0 2px 8px #0008;pointer-events:none;transform:translate(-50%,-50%);transition:opacity .3s';document.documentElement.appendChild(c)}c.style.opacity=1;c.style.left=e.clientX+'px';c.style.top=e.clientY+'px';clearTimeout(t);t=setTimeout(()=>c.style.opacity=0,3000)},true)})()`;
const EDIT_JS = `(()=>{let L=-1;const r=v=>{if(v!==L){L=v;console.log('__TVEDIT__'+v)}};document.addEventListener('focusin',e=>{const t=e.target;r((t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))?1:0)},true);document.addEventListener('focusout',()=>r(0),true)})()`;
function layout() { if (view) { const [w, h] = win.getContentSize(); view.setBounds({ x: 0, y: 0, width: w, height: h }); } }
function launch(url) { try { launch0(url); } catch (e) { console.log('launch error', e); view = null; viewHidden = false; toast('Could not open app'); } }
function launch0(url) {
  if (view && view.appUrl === url) return showApp();
  closeApp(true);
  const local = /^orcacast:\/\/(radio|tv)$/.exec(url);
  view = new WebContentsView({ webPreferences: { partition: 'persist:apps', backgroundThrottling: false, spellcheck: false, ...(local ? { webSecurity: false } : {}) } });
  view.appUrl = url; viewHidden = false; viewEdit = false;
  let host = url; try { host = new URL(url).hostname.replace(/^www\./, ''); } catch {}
  view.appName = (cfg.apps.find(a => a.url === url) || {}).name || host;
  const wc = view.webContents, yt = YT.test(url);
  wc.setUserAgent(yt ? UA_TV : wc.getUserAgent().replace(/ Electron\/\S+/, '').replace(/ orcacast-tv\/\S+/, ''));
  wc.setWindowOpenHandler(({ url }) => { wc.loadURL(url); return { action: 'deny' }; });
  hook(wc);
  wc.on('console-message', (e, l, msg) => { const m = typeof msg === 'string' ? msg : (e && e.message) || ''; if (m.startsWith('__TVEDIT__')) viewEdit = m.endsWith('1'); });
  wc.on('dom-ready', () => { try { wc.executeJavaScript(CURSOR_JS + ';' + EDIT_JS + (YT.test(wc.getURL()) ? ';' + YT_JS + (cfg.ytShadow === false ? '' : ';' + YT_FIX_JS) : '')).catch(() => {}); } catch {} });
  wc.on('render-process-gone', (e, d) => { log('app renderer gone', d && d.reason); if (view && view.webContents === wc) { closeApp(); toast('The app stopped responding – back to home'); } });
  try { win.contentView.addChildView(view, 0); } catch { win.contentView.addChildView(view); } // index 0 keeps the OSD layer on top
  layout(); if (local) wc.loadFile(path.join(__dirname, 'player.html'), { query: { mode: local[1] } }); else wc.loadURL(yt ? ytUrl(url) : url); wc.focus(); sendApp();
}
function closeApp(quiet) {
  if (!view) return;
  const v = view, wc = v.webContents; view = null; viewHidden = false; viewEdit = false;
  try { win.contentView.removeChildView(v); } catch (e) { log('remove', e); }
  try { wc.removeAllListeners('before-input-event'); wc.removeAllListeners('console-message'); wc.removeAllListeners('dom-ready'); wc.setAudioMuted(true); wc.stop(); } catch {}
  setTimeout(() => { try { if (!wc.isDestroyed()) wc.close(); } catch (e) { log('close', e.message); } }, 200); // never destroy inside an input/IPC callback
  if (!quiet) { win.webContents.focus(); sendApp(); }
}
function hideApp() { if (!view || viewHidden) return; viewHidden = true; try { view.setVisible(false); } catch (e) { log('hide', e); } win.webContents.focus(); sendApp(); }
function showApp() { if (!view) return; viewHidden = false; try { view.setVisible(true); } catch (e) { log('show', e); } layout(); view.webContents.focus(); sendApp(); }

// ---------- keyboard shortcuts (work in the home screen AND inside apps) ----------
const MAP = { '+': 'volup', '-': 'voldown', '*': 'mute', '/': 'power', '=': 'settings', ']': 'lock', '<': 'rew', '>': 'fwd', '\\': 'voice', PageUp: 'play', PageDown: 'pause', End: 'stop' };
const PRINT = new Set(['+', '-', '*', '/', '=', ']', '<', '>', '\\']), held = {};
const isEditing = () => (view && !viewHidden) ? viewEdit : homeEdit;
const defer = f => setImmediate(() => { try { f(); } catch (e) { log('key error', e); } });
function hook(wc) { wc.on('before-input-event', onInput); }
function onInput(e, i) {
  const k = i.key, down = i.type === 'keyDown';
  if ((k === 'Escape' && Date.now() < synthUntil) || i.control || i.alt || i.meta) return; // ignore our own synthetic Esc
  if (k === 'Escape' || k === 'Home') { // short press / long press
    e.preventDefault();
    if (down) { if (!i.isAutoRepeat) { clearTimeout(held[k] && held[k].t); const h = held[k] = { fired: false }; h.t = setTimeout(() => { h.fired = true; if (!off) defer(() => longPress(k)); }, 650); } }
    else if (held[k]) { clearTimeout(held[k].t); const f = held[k].fired; held[k] = null; if (!f) defer(() => key(k === 'Escape' ? 'back' : 'home')); }
    return;
  }
  if (!down || !MAP[k] || (PRINT.has(k) && isEditing() && !off)) return; // symbol keys type normally inside text boxes
  e.preventDefault();
  if (!i.isAutoRepeat || /^(vol|rew|fwd)/.test(MAP[k])) defer(() => key(MAP[k]));
}
function longPress(k) { if (view) closeApp(); else if (k === 'Home') send('key', 'home'); }

const VK = { volup: 175, voldown: 174, mute: 173 };
const VOSD = { volup: ['🔊', 'Volume up'], voldown: ['🔉', 'Volume down'], mute: ['🔇', 'Mute / unmute'] };
const press = (wc, code, ch) => { if (code === 'Escape') synthUntil = Date.now() + 150; wc.focus(); wc.sendInputEvent({ type: 'keyDown', keyCode: code }); if (ch) wc.sendInputEvent({ type: 'char', keyCode: ch }); wc.sendInputEvent({ type: 'keyUp', keyCode: code }); };
function setPower(v) { off = v; if (v) closeApp(); send('power', v); }
function back(wc) {
  if (/^file:/.test(wc.getURL())) return wc.executeJavaScript('window.__back?window.__back():0').then(r => { if (!r) closeApp(); }).catch(() => closeApp());
  if (/youtube\.com\/tv/.test(wc.getURL())) return press(wc, 'Escape');
  wc.executeJavaScript('document.fullscreenElement?(document.exitFullscreen(),1):0').then(r => { if (!r) wc.navigationHistory.canGoBack() ? wc.navigationHistory.goBack() : closeApp(); }).catch(() => {});
}
const MI = { play: ['▶', 'Play'], pause: ['⏸', 'Pause'], stop: ['⏹', 'Stopped'], rew: ['⏪', 'Rewind 10s'], fwd: ['⏩', 'Forward 10s'] };
function media(a) {
  if (!view) return osd('', 'Nothing is playing');
  const wc = view.webContents, arrows = /netflix|primevideo|disneyplus|hotstar|amazon\./.test(wc.getURL());
  osd(...MI[a]);
  if ((a === 'rew' || a === 'fwd') && arrows) return press(wc, a === 'rew' ? 'Left' : 'Right');
  wc.executeJavaScript(`(()=>{const v=[...document.querySelectorAll('video,audio')].sort((x,y)=>(y.duration||0)-(x.duration||0))[0];if(!v)return 0;const a='${a}';if(a==='play')v.play();else if(a==='pause')v.pause();else if(a==='stop'){v.pause();v.currentTime=0}else v.currentTime=Math.max(0,v.currentTime+(a==='fwd'?10:-10));return 1})()`)
    .then(r => { if (!r && (a === 'play' || a === 'pause')) press(wc, 'Space', ' '); }).catch(() => {});
}
function listen() { // desktop microphone -> Windows speech recognition (offline, no API key)
  if (listening) return; listening = true; osd('🎙', 'Listening…', 9500);
  const ps = "Add-Type -AssemblyName System.Speech;$r=New-Object System.Speech.Recognition.SpeechRecognitionEngine;$r.SetInputToDefaultAudioDevice();$r.LoadGrammar((New-Object System.Speech.Recognition.DictationGrammar));$x=$r.Recognize([TimeSpan]::FromSeconds(8));if($x){$x.Text}";
  cp.execFile('powershell', ['-NoProfile', '-Command', ps], { timeout: 20000, windowsHide: true }, (err, out) => {
    listening = false; const t = String(out || '').trim();
    if (err && !t) return osd('🎙', 'Mic/speech unavailable – check Windows privacy & speech settings', 4000);
    if (!t) return osd('🎙', "Didn't catch that");
    osd('🎙', '“' + t + '”');
    if (isEditing()) { const wc = (view && !viewHidden) ? view.webContents : win.webContents; wc.focus(); wc.insertText(t); } else voice(t);
  });
}
function key(k) {
  if (k === 'power') return setPower(!off);
  if (off) return;
  if (VK[k]) { osd(...VOSD[k]); return cp.exec(`powershell -NoProfile -WindowStyle Hidden -Command "(New-Object -ComObject WScript.Shell).SendKeys([char]${VK[k]})"`); }
  if (k === 'voice') return listen();
  if (MI[k]) return media(k);
  if (k === 'exit') return closeApp();
  if (k === 'lock' || k === 'settings') { hideApp(); return send('key', k); }
  if (k === 'home') return view && !viewHidden ? hideApp() : send('key', 'home');
  if (!view || viewHidden) { if (k === 'bksp') press(win.webContents, 'Backspace'); else send('key', k); return; }
  const wc = view.webContents;
  if (k === 'back') return back(wc);
  const m = { up: ['Up'], down: ['Down'], left: ['Left'], right: ['Right'], ok: ['Return', '\r'], bksp: ['Backspace'], playpause: ['Space', ' '] }[k];
  if (m) press(wc, ...m);
}
function ptr(m) {
  if (!view || viewHidden) return;
  const wc = view.webContents, [w, h] = win.getContentSize(), x = () => Math.round(cur.x), y = () => Math.round(cur.y);
  if (m.t === 'move') { cur.x = Math.min(w - 1, Math.max(0, cur.x + m.dx * 2.2)); cur.y = Math.min(h - 1, Math.max(0, cur.y + m.dy * 2.2)); wc.sendInputEvent({ type: 'mouseMove', x: x(), y: y() }); }
  else if (m.t === 'click') for (const type of ['mouseDown', 'mouseUp']) wc.sendInputEvent({ type, x: x(), y: y(), button: 'left', clickCount: 1 });
  else if (m.t === 'scroll') wc.sendInputEvent({ type: 'mouseWheel', x: x(), y: y(), deltaX: 0, deltaY: m.dy, canScroll: true });
}
function voice(t) {
  const q = String(t).trim(); if (!q) return;
  const l = q.toLowerCase().replace(/^(open|launch|go to|start)\s+/, '');
  const a = cfg.apps.find(a => a.name.toLowerCase() === l);
  osd('🎙', q);
  launch(a ? a.url : 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q.replace(/^(search|play)( for)?\s+/i, '')));
}
function handle(d) {
  if (d.t === 'key') key(d.k);
  else if (d.t === 'voice') voice(d.v);
  else if (d.t === 'text') { const wc = (view && !viewHidden) ? view.webContents : win.webContents; wc.focus(); wc.insertText(String(d.v)); }
  else if (d.t === 'addapp') addApp(d);
  else ptr(d);
}

// ---------- phone remote server ----------
const srv = http.createServer((q, r) => {
  const pin = new URL(q.url, 'http://x').searchParams.get('pin');
  if (q.method === 'POST' && q.url.startsWith('/cmd')) { // HTTP fallback if WebSocket is blocked
    if (pin !== cfg.pin) { r.writeHead(403); return r.end(); }
    const c = []; q.on('data', d => c.push(d));
    q.on('end', () => { try { handle(JSON.parse(Buffer.concat(c))); } catch {} r.end('ok'); });
    return;
  }
  if (q.method === 'POST' && q.url.startsWith('/wallpaper')) {
    if (pin !== cfg.pin) { r.writeHead(403); return r.end(); }
    const c = []; q.on('data', d => c.push(d));
    q.on('end', () => { fs.writeFileSync(WP, Buffer.concat(c)); delete cfg.wallUrl; save(); push(); r.end('ok'); });
    return;
  }
  if (q.url === '/' || q.url.startsWith('/?')) osd('📱', 'Phone opened the remote page');
  r.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }); r.end(fs.readFileSync(path.join(__dirname, 'remote.html')));
});
const wss = new WebSocketServer({ server: srv, maxPayload: 8e6 });
const phones = () => send('phones', [...wss.clients].filter(c => c.readyState === 1).length);
wss.on('connection', (ws, q) => {
  if (new URL(q.url, 'http://x').searchParams.get('pin') !== cfg.pin) { osd('⚠', 'Phone used the wrong PIN'); return ws.close(4001); }
  ws.dead = false; ws.on('pong', () => ws.dead = false); ws.on('close', phones); phones(); osd('📱', 'Phone connected');
  ws.on('message', m => { try { handle(JSON.parse(m)); } catch (e) { console.log('cmd error', e.message); } });
});
setInterval(() => wss.clients.forEach(c => { if (c.dead) return c.terminate(); c.dead = true; c.ping(); }), 15000);
function listenPort(p) {
  srv.once('error', e => { if (e.code === 'EADDRINUSE' && p < 8799) listenPort(p + 1); });
  srv.listen(p, '0.0.0.0', () => { port = p; pushPair(); if (Bonjour) try { new Bonjour().publish({ name: 'OrcaCast TV', type: 'orcacast', port: p }); } catch {} });
}
function fixFw() { // elevated: removes Windows' auto-created BLOCK rules and opens the port
  const bat = path.join(D, 'fix-firewall.bat'), exe = process.execPath;
  fs.writeFileSync(bat, `@echo off\r\nnetsh advfirewall firewall delete rule name=all program="${exe}"\r\nnetsh advfirewall firewall delete rule name="OrcaCast TV Port"\r\nnetsh advfirewall firewall add rule name="OrcaCast TV Port" dir=in action=allow protocol=TCP localport=8787-8799 profile=any\r\nnetsh advfirewall firewall add rule name="OrcaCast TV" dir=in action=allow program="${exe}" enable=yes profile=any\r\n`);
  cp.exec(`powershell -NoProfile -Command "Start-Process -FilePath '${bat}' -Verb RunAs -WindowStyle Hidden"`);
  toast('Approve the Windows prompt to open the firewall');
}
function fwCheck() { cp.exec('netsh advfirewall firewall show rule name="OrcaCast TV Port"', err => { if (err && !cfg.fwTried) { cfg.fwTried = true; save(); fixFw(); } }); }

ipcMain.on('launch', (e, url) => launch(url));
ipcMain.on('resume', () => showApp());
ipcMain.on('addapp', (e, d) => addApp(d));
ipcMain.on('rmapp', (e, i) => { cfg.apps.splice(i, 1); save(); push(); });
ipcMain.on('theme', (e, i) => { fs.rmSync(WP, { force: true }); delete cfg.wallUrl; cfg.theme = i; save(); push(); });
ipcMain.on('randwall', () => { fs.rmSync(WP, { force: true }); cfg.wallUrl = `https://picsum.photos/seed/${Date.now()}/1920/1080`; save(); push(); });
ipcMain.on('wallurl', (e, u) => { fs.rmSync(WP, { force: true }); cfg.wallUrl = u ? norm(u) : undefined; save(); push(); });
ipcMain.on('pickwall', async () => {
  const r = await dialog.showOpenDialog(win, { title: 'Choose wallpaper', properties: ['openFile'], filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'webp', 'bmp'] }] });
  if (!r.canceled && r.filePaths[0]) { fs.copyFileSync(r.filePaths[0], WP); delete cfg.wallUrl; save(); push(); }
});
ipcMain.on('login', (e, v) => { app.setLoginItemSettings({ openAtLogin: v }); push(); });
ipcMain.on('ytshadow', (e, v) => { cfg.ytShadow = !!v; save(); push(); });
ipcMain.on('openlog', () => { log('log opened'); shell.showItemInFolder(LOG); });
ipcMain.on('extdir', () => shell.openPath(EXT));
ipcMain.on('fixfw', fixFw);
ipcMain.on('editing', (e, v) => { homeEdit = !!v; });
ipcMain.on('lockstate', (e, v) => { if (view) view.webContents.setAudioMuted(!!v); });
ipcMain.on('poweroff', () => setPower(true));
ipcMain.on('ready', () => { push(); pushPair(); phones(); sendApp(); });

app.whenReady().then(async () => {
  win = new BrowserWindow({ show: false, fullscreen: !process.argv.includes('--windowed'), width: 1280, height: 720, autoHideMenuBar: true, backgroundColor: '#05070d', webPreferences: { nodeIntegration: true, contextIsolation: false } });
  win.once('ready-to-show', () => win.show()); win.on('resize', layout); win.loadFile('index.html'); hook(win.webContents);
  ov = new WebContentsView({ webPreferences: { nodeIntegration: true, contextIsolation: false } });
  ov.setBackgroundColor('#00000000'); ov.webContents.loadFile('osd.html'); win.contentView.addChildView(ov); ov.setBounds({ x: 0, y: 0, width: 1280, height: 150 }); ov.setVisible(false);
  win.webContents.on('render-process-gone', (e, d) => { log('home renderer gone', d && d.reason); setTimeout(() => { try { win.reload(); } catch {} }, 500); });
  app.on('child-process-gone', (e, d) => log('child gone', d.type, d.reason));
  const s = session.fromPartition('persist:apps'); // extensions: unpacked folders in <userData>/extensions
  fs.mkdirSync(EXT, { recursive: true });
  for (const d of fs.readdirSync(EXT)) try { await (s.extensions || s).loadExtension(path.join(EXT, d)); } catch (e) { console.log('ext fail', d, e.message); }
  fwCheck(); listenPort(8787);
});
app.on('second-instance', () => win && win.focus());
app.on('window-all-closed', () => app.quit());
