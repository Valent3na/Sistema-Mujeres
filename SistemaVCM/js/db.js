// Capa de datos: Supabase (si hay credenciales) o archivos locales /data
const CFG = window.APP_CONFIG || {};
const REMOTE = !!(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY);
const TABLES = ['casos_mensuales', 'cem_atenciones', 'fiscalia_casos', 'familias_atendidas'];
let sb = null;
if (REMOTE) {
  if (typeof supabase === 'undefined') alert('No se pudo cargar supabase-js (revisa tu conexión a internet).');
  else sb = supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
}

async function fetchAll(table) {            // Supabase entrega máx. 1000 filas por consulta
  const out = [], step = 1000;
  for (let from = 0; ; from += step) {
    const { data, error } = await sb.from(table).select('*').order('id').range(from, from + step - 1);
    if (error) throw new Error(`${table}: ${error.message}`);
    out.push(...data);
    if (data.length < step) break;
  }
  return out;
}

const DB = {
  remote: REMOTE,
  async login(user, pass) {
    const bad = { ok: false, msg: 'Usuario o contraseña incorrectos' };
    if (!REMOTE) {
      if (user === 'admin' && pass === 'admin123') { sessionStorage.setItem('vcm_local', '1'); return { ok: true }; }
      return bad;
    }
    const email = user.includes('@') ? user : `${user}@sistema.local`;   // admin → admin@sistema.local
    const { error } = await sb.auth.signInWithPassword({ email, password: pass });
    return error ? bad : { ok: true };
  },
  async hasSession() {
    if (!REMOTE) return sessionStorage.getItem('vcm_local') === '1';
    const { data } = await sb.auth.getSession();
    return !!data.session;
  },
  async logout() {
    if (REMOTE) await sb.auth.signOut(); else sessionStorage.removeItem('vcm_local');
  },
  async loadAll() {
    const res = await Promise.all(TABLES.map(t =>
      REMOTE ? fetchAll(t) : fetch(`data/${t}.json`).then(r => { if (!r.ok) throw new Error(t); return r.json(); })));
    return { casos: res[0], cem: res[1], fis: res[2], fam: res[3] };
  }
};
