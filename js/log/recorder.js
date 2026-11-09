/* ============ Sandbox: el código del usuario corre en un Web Worker ============ */
// El Worker no tiene DOM, ni window, ni localStorage, ni acceso a la página.
// Además se anulan en el global red y APIs peligrosas. Si el código se cuelga
// (bucle síncrono sin await) el hilo principal lo termina con un timeout.
// Nota: los globales anulados se leen desde el mismo objeto global, así que
// Function('return this')() no permite recuperarlos.
const SANDBOX_SRC = `
'use strict';
const post = self.postMessage.bind(self);
const BLOCK = ['fetch','XMLHttpRequest','WebSocket','importScripts','indexedDB','caches',
  'EventSource','Worker','SharedWorker','BroadcastChannel','postMessage','close','navigator'];
for (const k of BLOCK) {
  try { Object.defineProperty(self, k, { value: undefined, writable: false, configurable: false }); } catch (e) {}
}

function buildApi(S) {
  const nd = id => S.nodes.find(n => n.id === id);
  const W = e => S.weighted ? e.w : 1;
  const dist = (a, b) => Math.hypot(nd(a).x - nd(b).x, nd(a).y - nd(b).y);
  const ratios = S.edges.map(e => W(e) / (dist(e.u, e.v) || 1));
  const k = ratios.length ? Math.min(...ratios) : 0;
  return Object.freeze({
    directed: S.directed, weighted: S.weighted,
    nodes: S.nodes.map(n => n.id),
    edges: S.edges.map(e => ({ from: e.u, to: e.v, weight: W(e) })),
    key: (u, v) => S.directed ? u + '>' + v : [u, v].sort().join('-'),
    neighbors: id => {
      const o = [];
      S.edges.forEach(e => {
        if (e.u === id) o.push({ to: e.v, weight: W(e) });
        else if (!S.directed && e.v === id) o.push({ to: e.u, weight: W(e) });
      });
      return o;
    },
    children: id => S.edges.filter(e => e.u === id).map(e => e.v).sort((a, b) => nd(a).x - nd(b).x),
    left: id => S.edges.filter(e => e.u === id && nd(e.v).x < nd(id).x).map(e => e.v)[0],
    right: id => S.edges.filter(e => e.u === id && nd(e.v).x > nd(id).x).map(e => e.v)[0],
    h: (a, b) => dist(a, b) * k,
    val: id => { const n = nd(id); return n && n.label !== undefined ? n.label : id; },
    at: i => S.nodes[i] ? S.nodes[i].id : undefined,
    len: S.nodes.length,
    succ: id => { const e = S.edges.find(e => e.u === id && e.kind !== 'prev'); return e ? e.v : undefined; },
    head: () => { const inc = new Set(S.edges.filter(e => e.kind !== 'prev').map(e => e.v));
      const h = S.nodes.find(n => !inc.has(n.id)) || S.nodes[0]; return h ? h.id : undefined; }
  });
}

class Recorder {
  constructor(g) { this.g = g; this.s = { n: {}, e: {}, ds: {} }; this.logs = []; this.cnt = 0; this.frames = [this.snap()]; }
  snap() {
    return { n: { ...this.s.n }, e: { ...this.s.e },
      ds: JSON.parse(JSON.stringify(this.s.ds, (k, v) => v === Infinity ? '∞' : v)), l: this.logs.length };
  }
  async push() {
    if (++this.cnt > 5000) throw Error('Límite de 5000 pasos (¿bucle infinito?)');
    this.frames.push(this.snap());
    if (this.cnt % 100 === 0) await new Promise(r => setTimeout(r));
  }
  async visitNode(id, st = 'visited') { this.s.n[id] = st; await this.push(); }
  async highlightEdge(u, v, st = 'path') { this.s.e[this.g.key(u, v)] = st; await this.push(); }
  async log(m) { this.logs.push(String(m)); await this.push(); }
  async setStructure(name, val) {
    this.s.ds[name] = Array.isArray(val) ? [...val] : (val && typeof val === 'object' ? { ...val } : val);
    await this.push();
  }
  async showPath(p) {
    for (let i = 0; i < p.length; i++) {
      this.s.n[p[i]] = 'path';
      if (i) this.s.e[this.g.key(p[i - 1], p[i])] = 'path';
      await this.push();
    }
  }
}

self.onmessage = async ev => {
  const { code, graph, params } = ev.data;
  const api = buildApi(graph);
  const rec = new Recorder(api);
  const AF = Object.getPrototypeOf(async function () {}).constructor;
  const names = ['graph', 'visualizer', 'params', 'self', 'globalThis', 'window', 'document', 'fetch',
    'localStorage', 'sessionStorage', 'parent', 'top', 'XMLHttpRequest', 'importScripts', 'postMessage', 'close'];
  try {
    const fn = new AF(...names, code);
    await fn(api, rec, params, ...new Array(names.length - 3));
  } catch (e) {
    try { await rec.log('❌ ' + e.message); } catch (_) {}
  }
  post({ frames: rec.frames, logs: rec.logs });
};
`;

const SANDBOX_TIMEOUT = 4000;
let logsRef = [];

// Ejecuta el algoritmo en un Worker aislado. Devuelve { frames, logs }.
function runSandbox(payload) {
  return new Promise(resolve => {
    const url = URL.createObjectURL(new Blob([SANDBOX_SRC, TREE_LIB], { type: 'text/javascript' }));
    const w = new Worker(url);
    const done = r => { clearTimeout(kill); w.terminate(); URL.revokeObjectURL(url); resolve(r); };
    const kill = setTimeout(() => done({ frames: null, logs: ['⏱ Tiempo agotado: ¿bucle sin await? Ejecución detenida'] }), SANDBOX_TIMEOUT);
    w.onmessage = e => done(e.data);
    w.onerror = e => done({ frames: null, logs: ['❌ ' + (e.message || 'error en el algoritmo')] });
    w.postMessage(payload);
  });
}
