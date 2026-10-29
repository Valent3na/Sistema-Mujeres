/* =====================================================================
   Sistema de Información · Violencia Contra la Mujer (Lima y Callao)
   ===================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const MESES_L = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre'];
const COL = ['#7c4dff', '#ec5fa5', '#3d8bfd', '#22c58b', '#f5a524', '#9aa3b5'];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = n => Number(n || 0).toLocaleString('es-PE');
const sum = (a, f) => a.reduce((s, x) => s + (f ? f(x) : x), 0);
const group = (arr, kf, vf) => { const m = new Map(); for (const r of arr) { const k = kf(r); m.set(k, (m.get(k) || 0) + vf(r)); } return m; };
const topN = (m, n) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);

/* ---------- nombres bonitos ---------- */
const ACC = { canete:'Cañete', brena:'Breña', jesus:'Jesús', maria:'María', rimac:'Rímac', pachacamac:'Pachacámac',
  huarochiri:'Huarochirí', martin:'Martín', lurin:'Lurín', ancon:'Ancón', peru:'Perú', oyon:'Oyón', vitarte:'Vitarte' };
const SMALL = new Set(['de','del','la','las','los','el','y']);
const tc = s => String(s || '').toLowerCase().split(/(\s+|-)/).map((w, i) =>
  (SMALL.has(w) && i > 0) ? w : (ACC[w] || w.charAt(0).toUpperCase() + w.slice(1))).join('');
const DEP = { 'LIMA METROPOLITANA':'Lima Metropolitana', 'REGION LIMA':'Región Lima', 'LIMA PROVINCIAS':'Lima Provincias',
  'PROV. CONST. DEL CALLAO':'Callao', 'CALLAO':'Callao' };
const dep = s => DEP[s] || tc(s);

/* ---------- coordenadas referenciales (centro aproximado de cada distrito) ---------- */
const COORDS = {
 '150101':[-12.046,-77.030],'150102':[-11.773,-77.175],'150103':[-12.026,-76.918],'150104':[-12.146,-77.021],'150105':[-12.057,-77.052],
 '150106':[-11.890,-77.036],'150107':[-11.977,-76.768],'150108':[-12.169,-77.013],'150109':[-12.100,-76.790],'150110':[-11.940,-77.050],
 '150111':[-12.045,-77.000],'150112':[-11.992,-77.054],'150113':[-12.070,-77.049],'150114':[-12.080,-76.910],'150115':[-12.065,-77.017],
 '150116':[-12.084,-77.036],'150117':[-11.970,-77.070],'150118':[-11.940,-76.700],'150119':[-12.275,-76.870],'150120':[-12.090,-77.072],
 '150121':[-12.075,-77.063],'150122':[-12.120,-77.030],'150123':[-12.230,-76.860],'150124':[-12.470,-76.800],'150125':[-11.860,-77.075],
 '150126':[-12.335,-76.820],'150127':[-12.365,-76.795],'150128':[-12.030,-77.035],'150129':[-12.390,-76.780],'150130':[-12.100,-77.000],
 '150131':[-12.098,-77.036],'150132':[-11.990,-77.005],'150133':[-12.155,-76.970],'150134':[-12.075,-76.995],'150135':[-12.000,-77.085],
 '150136':[-12.078,-77.085],'150137':[-12.045,-76.970],'150138':[-12.405,-76.775],'150139':[-11.805,-77.165],'150140':[-12.145,-76.990],
 '150141':[-12.110,-77.015],'150142':[-12.215,-76.935],'150143':[-12.160,-76.930],
 '070101':[-12.050,-77.120],'070102':[-12.057,-77.110],'070103':[-12.045,-77.095],'070104':[-12.070,-77.125],'070105':[-12.072,-77.165],
 '070106':[-11.870,-77.130],'070107':[-11.855,-77.115]
};

/* ---------- iconos ---------- */
const IC = {
  dashboard:'<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  consultas:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  reportes:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
  estadisticas:'<path d="M12 20V10M18 20V4M6 20v-4"/>',
  mapa:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  configuracion:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  salir:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
  build:'<path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 13v.01M9 17v.01"/>',
  total:'<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>'
};
const svgIc = n => `<svg viewBox="0 0 24 24">${IC[n]}</svg>`;

/* =====================================================================
   GRÁFICOS SVG (sin librerías)
   ===================================================================== */
let uid = 0;
const niceMax = v => { const p = Math.pow(10, Math.floor(Math.log10(v || 1))), m = v / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p; };

function bars(labels, series, o = {}) {
  const W = 420, H = 210, L = 42, B = 26, T = 18, R = 8, iw = W - L - R, ih = H - T - B, n = labels.length, id = 'g' + (++uid);
  const tot = labels.map((_, i) => o.stacked ? sum(series, s => s.data[i]) : Math.max(...series.map(s => s.data[i])));
  const max = niceMax(Math.max(...tot, 1));
  let g = `<defs><linearGradient id="${id}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9b6cf0"/><stop offset="1" stop-color="#6d3df5"/></linearGradient>
    <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cdbbff"/><stop offset="1" stop-color="#a98cf7"/></linearGradient></defs>`;
  for (let k = 0; k <= 4; k++) {
    const y = T + ih - ih * k / 4;
    g += `<line x1="${L}" x2="${W - R}" y1="${y}" y2="${y}" stroke="rgba(124,77,255,.13)"/><text x="${L - 6}" y="${y + 3}" text-anchor="end">${fmt(max * k / 4)}</text>`;
  }
  const slot = iw / n, ns = series.length, grouped = !o.stacked && ns > 1;
  const bw = Math.min(48, slot * .62 / (grouped ? ns : 1));
  labels.forEach((lb, i) => {
    const cx = L + slot * i + slot / 2; let acc = 0;
    g += `<text x="${cx}" y="${H - 8}" text-anchor="middle">${esc(lb)}</text>`;
    series.forEach((s, j) => {
      const v = s.data[i], h = ih * v / max;
      const x = grouped ? cx - bw * ns / 2 + bw * j : cx - bw / 2;
      const y = o.stacked ? T + ih - ih * (acc + v) / max : T + ih - h;
      const fill = ns === 1 ? `url(#${id}${o.hl === i || o.hl === undefined ? 'a' : 'b'})` : s.color;
      g += `<rect x="${x}" y="${y}" width="${bw}" height="${Math.max(h, 0)}" rx="${o.stacked ? 2 : 6}" fill="${fill}"><title>${esc(s.name || lb)}: ${fmt(v)}</title></rect>`;
      if (ns === 1) g += `<text x="${cx}" y="${y - 6}" text-anchor="middle" style="font-weight:700;fill:#1d1840">${fmt(v)}</text>`;
      acc += v;
    });
  });
  return `<svg class="chart" viewBox="0 0 ${W} ${H}">${g}</svg>${series.length > 1 ? legend(series.map(s => ({ label: s.name, color: s.color }))) : ''}`;
}

function lines(labels, series) {
  const W = 520, H = 220, L = 44, B = 26, T = 14, R = 12, iw = W - L - R, ih = H - T - B, n = labels.length;
  const max = niceMax(Math.max(...series.flatMap(s => s.data), 1));
  let g = '';
  for (let k = 0; k <= 4; k++) {
    const y = T + ih - ih * k / 4;
    g += `<line x1="${L}" x2="${W - R}" y1="${y}" y2="${y}" stroke="rgba(124,77,255,.13)"/><text x="${L - 6}" y="${y + 3}" text-anchor="end">${fmt(max * k / 4)}</text>`;
  }
  labels.forEach((lb, i) => g += `<text x="${L + iw * i / (n - 1)}" y="${H - 8}" text-anchor="middle">${lb}</text>`);
  series.forEach(s => {
    const pts = s.data.map((v, i) => [L + iw * i / (n - 1), T + ih - ih * v / max]);
    g += `<path d="M${pts.map(p => p.join(',')).join(' L')}" fill="none" stroke="${s.color}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>`;
    pts.forEach((p, i) => g += `<circle cx="${p[0]}" cy="${p[1]}" r="3.4" fill="#fff" stroke="${s.color}" stroke-width="2"><title>${s.name} · ${labels[i]}: ${fmt(s.data[i])}</title></circle>`);
  });
  return `<svg class="chart" viewBox="0 0 ${W} ${H}">${g}</svg>${legend(series.map(s => ({ label: s.name, color: s.color })))}`;
}

function donut(items, big, small) {
  const tot = sum(items, i => i.value) || 1; let cum = 0, g = '';
  items.forEach(it => {
    const p = it.value / tot * 100;
    g += `<circle cx="21" cy="21" r="15.9155" fill="none" stroke="${it.color}" stroke-width="5.4" stroke-dasharray="${p} ${100 - p}" stroke-dashoffset="${25 - cum}"><title>${esc(it.label)}: ${fmt(it.value)}</title></circle>`;
    cum += p;
  });
  const lg = `<div class="legend">${items.map(it => `<span><i style="background:${it.color}"></i>${esc(it.label)}<em>${Math.round(it.value / tot * 100)}%</em></span>`).join('')}</div>`;
  return `<div class="donut-wrap"><svg viewBox="0 0 42 42" width="150">${g}
    <text x="21" y="22" text-anchor="middle" style="font:800 6px var(--font);fill:#1d1840">${fmt(big)}</text>
    <text x="21" y="27" text-anchor="middle" style="font:600 2.8px var(--font);fill:#6b6890">${esc(small)}</text></svg>${lg}</div>`;
}
const legend = it => `<div class="legend" style="flex-direction:row;flex-wrap:wrap;gap:6px 16px;margin-top:8px;justify-content:center">${it.map(i => `<span><i style="background:${i.color}"></i>${esc(i.label)}</span>`).join('')}</div>`;
const hbars = (items, o = {}) => { const mx = Math.max(...items.map(i => i[1]), 1);
  return `<div class="hb">${items.map(([k, v]) => `<div><span class="nm" title="${esc(k)}">${esc(k)}</span><span class="bar"><u style="width:${v / mx * 100}%"></u></span><b>${fmt(v)}</b></div>`).join('')}</div>`; };
const delta = (cur, prev) => { if (!prev) return ''; const p = (cur - prev) / prev * 100;
  return `<span class="delta ${p > 0 ? 'up' : 'down'}">${p > 0 ? '↑' : '↓'} ${Math.abs(p).toFixed(1)}%</span>`; };
const card = (t, body, cls = '') => `<div class="card glass ${cls}"><h3>${t}</h3>${body}</div>`;
const table = (head, rows, nums = []) => `<div class="tw"><table><thead><tr>${head.map((h, i) => `<th class="${nums.includes(i) ? 'n' : ''}">${esc(h)}</th>`).join('')}</tr></thead>
  <tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td class="${nums.includes(i) ? 'n' : ''}">${nums.includes(i) && typeof c === 'number' ? fmt(c) : esc(c)}</td>`).join('')}</tr>`).join('') || '<tr><td colspan="99">Sin resultados</td></tr>'}</tbody></table></div>`;
function download(name, head, rows) {
  const q = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = '\ufeff' + [head, ...rows].map(r => r.map(q).join(';')).join('\r\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  a.download = name; a.click(); URL.revokeObjectURL(a.href);
}

/* =====================================================================
   ESTADO Y DATOS
   ===================================================================== */
let D = null;
const S = { year: null };
const years = () => [...new Set(D.casos.map(r => r.anio))].sort();
const nameOf = () => { const m = new Map(); D.casos.forEach(r => m.set(r.ubigeo, tc(r.distrito))); return m; };

/* =====================================================================
   VISTAS
   ===================================================================== */
const VIEWS = {};

/* ---------- DASHBOARD ---------- */
VIEWS.dashboard = { html() {
  const y = S.year, py = y - 1, ys = years();
  const cY = D.casos.filter(r => r.anio === y), tY = sum(cY, r => r.cantidad), tP = sum(D.casos.filter(r => r.anio === py), r => r.cantidad);
  const eY = D.cem.filter(r => r.anio === y), aY = sum(eY, r => r.casos_total), aP = sum(D.cem.filter(r => r.anio === py), r => r.casos_total);
  const muj = sum(eY, r => r.mujeres), nm = nameOf();
  const kpi = (c, ic, col, t, v, sub, d = '') => `<div class="card glass kpi ${c}"><div class="ic" style="background:${col}">${svgIc(ic)}</div><div><small>${t}</small><b>${fmt(v)}</b><i>${sub}</i>${d}</div></div>`;
  const porAnio = ys.map(a => sum(D.casos.filter(r => r.anio === a), r => r.cantidad));
  const tipo = [['Psicológica', 'psicologica'], ['Física', 'fisica'], ['Sexual', 'sexual']].map(([l, k], i) => ({ label: l, value: sum(eY, r => r[k]), color: COL[i] }));
  const edades = [['0-5','edad_0_5'],['6-11','edad_6_11'],['12-17','edad_12_17'],['18-25','edad_18_25'],['26-35','edad_26_35'],['36-45','edad_36_45'],['46-59','edad_46_59'],['60+','edad_60_mas']];
  const mes = a => MESES.map((_, i) => sum(D.casos.filter(r => r.anio === a && r.mes === i + 1), r => r.cantidad));
  const ser = [{ name: String(y), color: '#7c4dff', data: mes(y) }];
  if (ys.includes(py)) ser.push({ name: String(py), color: '#ec5fa5', data: mes(py) });
  const dp = [...group(cY, r => dep(r.departamento), r => r.cantidad)].map(([label, value], i) => ({ label, value, color: COL[i] }));
  return `
  <div class="grid g4">
    ${kpi('k1', 'heart', 'linear-gradient(135deg,#7c4dff,#a07bf5)', 'Casos de violencia', tY, `Registro ${y}`, delta(tY, tP))}
    ${kpi('k2', 'users', 'linear-gradient(135deg,#ec5fa5,#f58ac0)', 'Atenciones en CEM', aY, `${aY ? Math.round(muj / aY * 100) : 0}% mujeres · ${y}`, delta(aY, aP))}
    ${kpi('k3', 'build', 'linear-gradient(135deg,#3d8bfd,#7db3ff)', 'Distritos con casos', new Set(cY.map(r => r.ubigeo)).size, `Lima y Callao · ${y}`)}
    ${kpi('k4', 'total', 'linear-gradient(135deg,#22c58b,#6ee7b7)', 'Total acumulado', sum(D.casos, r => r.cantidad), `${ys[0]} – ${ys[ys.length - 1]}`)}
  </div>
  <div class="grid g3">
    ${card('Casos de violencia por año', bars(ys.map(String), [{ name: 'Casos', data: porAnio }], { hl: ys.indexOf(y) }))}
    ${card(`Atenciones CEM por tipo de violencia (${y})`, donut(tipo, sum(tipo, t => t.value), 'casos'))}
    ${card(`Top 5 distritos con más casos (${y})`, hbars(topN(group(cY, r => nm.get(r.ubigeo), r => r.cantidad), 5)))}
  </div>
  <div class="grid g3">
    ${card(`Evolución mensual de casos`, lines(MESES, ser))}
    ${card(`Atenciones CEM por edad (${y})`, bars(edades.map(e => e[0]), [{ name: 'Casos', data: edades.map(e => sum(eY, r => r[e[1]])) }]))}
    ${card(`Casos por departamento (${y})`, donut(dp, tY, 'casos'))}
  </div>`;
} };

/* ---------- CONSULTAS ---------- */
const SRC = {
  casos: { t: 'Casos mensuales por distrito', rows: () => D.casos, year: 'anio', dep: 'departamento',
    cols: [['anio','Año'],['mes','Mes',v => MESES_L[v - 1]],['departamento','Departamento',dep],['provincia','Provincia',tc],['distrito','Distrito',tc],['cantidad','Casos',null,1]] },
  cem: { t: 'Atenciones Centro Emergencia Mujer', rows: () => D.cem, year: 'anio', dep: 'departamento',
    cols: [['anio','Año'],['departamento','Departamento',dep],['distrito','Distrito',tc],['centro','Centro',tc],['casos_total','Total',null,1],['mujeres','Mujeres',null,1],['hombres','Hombres',null,1],['psicologica','Psicológica',null,1],['fisica','Física',null,1],['sexual','Sexual',null,1]] },
  fis: { t: 'Casos fiscales', rows: () => D.fis, year: 'anio', dep: 'dpto_pjfs',
    cols: [['anio','Año'],['distrito_fiscal','Distrito fiscal',tc],['tipo_fiscalia','Fiscalía',tc],['tipo_caso','Tipo de caso',tc],['dist_pjfs','Distrito',tc],['ingresado','Ingresados',null,1],['atendido','Atendidos',null,1]] },
  fam: { t: 'Familias atendidas (2025)', rows: () => D.fam, year: 'anio', dep: 'dep',
    cols: [['cod_fam','Código'],['sexo','Sexo'],['edad','Edad',null,1],['dep','Departamento',tc],['prov','Provincia',tc],['dist','Distrito',tc],['fec_ing','Fecha ingreso']] }
};
const Q = { src: 'casos', q: '', year: '', dep: '', page: 0 };
const PAGE = 20;
function queryRows() {
  const s = SRC[Q.src], q = Q.q.trim().toLowerCase();
  return s.rows().filter(r => (!Q.year || String(r[s.year]) === Q.year) && (!Q.dep || dep(r[s.dep]) === Q.dep) &&
    (!q || s.cols.some(c => String(c[2] ? c[2](r[c[0]]) : r[c[0]]).toLowerCase().includes(q))));
}
const cell = (r, c) => c[2] ? c[2](r[c[0]]) : r[c[0]];
VIEWS.consultas = {
  html() {
    const s = SRC[Q.src], rows = s.rows();
    const yrs = [...new Set(rows.map(r => r[s.year]))].sort(), deps = [...new Set(rows.map(r => dep(r[s.dep])))].sort();
    return `<h1 class="h1">Consultas</h1><div class="card glass">
      <div class="filters">
        <select id="q-src">${Object.entries(SRC).map(([k, v]) => `<option value="${k}" ${k === Q.src ? 'selected' : ''}>${v.t}</option>`).join('')}</select>
        <input id="q-txt" placeholder="Buscar…" value="${esc(Q.q)}">
        <select id="q-year"><option value="">Todos los años</option>${yrs.map(y => `<option ${String(y) === Q.year ? 'selected' : ''}>${y}</option>`).join('')}</select>
        <select id="q-dep"><option value="">Todos los departamentos</option>${deps.map(d => `<option ${d === Q.dep ? 'selected' : ''}>${esc(d)}</option>`).join('')}</select>
        <button class="btn ghost" id="q-csv">Exportar CSV</button>
      </div><div id="q-out"></div></div>`;
  },
  after() {
    const upd = () => { Q.q = $('#q-txt').value; Q.year = $('#q-year').value; Q.dep = $('#q-dep').value; Q.page = 0; VIEWS.consultas.table(); };
    $('#q-src').onchange = e => { Q.src = e.target.value; Q.q = Q.year = Q.dep = ''; Q.page = 0; route(); };
    $('#q-txt').oninput = upd; $('#q-year').onchange = upd; $('#q-dep').onchange = upd;
    $('#q-csv').onclick = () => { const s = SRC[Q.src]; download(`${Q.src}.csv`, s.cols.map(c => c[1]), queryRows().map(r => s.cols.map(c => cell(r, c)))); };
    this.table();
  },
  table() {
    const s = SRC[Q.src], all = queryRows(), pages = Math.max(1, Math.ceil(all.length / PAGE)); Q.page = Math.min(Q.page, pages - 1);
    const rows = all.slice(Q.page * PAGE, (Q.page + 1) * PAGE).map(r => s.cols.map(c => cell(r, c)));
    $('#q-out').innerHTML = table(s.cols.map(c => c[1]), rows, s.cols.map((c, i) => c[3] ? i : -1).filter(i => i >= 0)) +
      `<div class="pager"><span>${fmt(all.length)} registros</span><button class="btn ghost" id="pv" ${Q.page === 0 ? 'disabled' : ''}>‹</button>
       <span>Página ${Q.page + 1} / ${pages}</span><button class="btn ghost" id="nx" ${Q.page >= pages - 1 ? 'disabled' : ''}>›</button></div>`;
    $('#pv').onclick = () => { Q.page--; this.table(); }; $('#nx').onclick = () => { Q.page++; this.table(); };
  }
};

/* ---------- REPORTES ---------- */
const REPORTS = [
  { t: 'Ranking de distritos', d: 'Casos de violencia por distrito (año seleccionado)', build(y) {
      const nm = nameOf(), g = group(D.casos.filter(r => r.anio === y), r => r.ubigeo, r => r.cantidad), tot = sum([...g.values()]);
      return { name: `ranking_distritos_${y}`, head: ['#', 'Distrito', 'Casos', '% del total'], nums: [0, 2, 3],
        rows: topN(g, 999).map(([u, v], i) => [i + 1, nm.get(u), v, (v / tot * 100).toFixed(1) + '%']) }; } },
  { t: 'Evolución mensual', d: 'Casos por mes, comparando todos los años', build() {
      const ys = years();
      return { name: 'evolucion_mensual', head: ['Mes', ...ys], nums: ys.map((_, i) => i + 1),
        rows: MESES_L.map((m, i) => [m, ...ys.map(a => sum(D.casos.filter(r => r.anio === a && r.mes === i + 1), r => r.cantidad))]) }; } },
  { t: 'Atenciones por CEM', d: 'Centros Emergencia Mujer (año seleccionado)', build(y) {
      return { name: `atenciones_cem_${y}`, head: ['Centro', 'Distrito', 'Total', 'Mujeres', 'Hombres', 'Psicológica', 'Física', 'Sexual'], nums: [2, 3, 4, 5, 6, 7],
        rows: D.cem.filter(r => r.anio === y).sort((a, b) => b.casos_total - a.casos_total)
          .map(r => [tc(r.centro), tc(r.distrito), r.casos_total, r.mujeres, r.hombres, r.psicologica, r.fisica, r.sexual]) }; } },
  { t: 'Casos fiscales', d: 'Ingresados y atendidos por distrito fiscal', build() {
      const g = {}; D.fis.forEach(r => { const k = r.anio + '|' + r.distrito_fiscal; g[k] = g[k] || [r.anio, tc(r.distrito_fiscal), 0, 0]; g[k][2] += r.ingresado; g[k][3] += r.atendido; });
      return { name: 'casos_fiscales', head: ['Año', 'Distrito fiscal', 'Ingresados', 'Atendidos', '% atendido'], nums: [2, 3, 4],
        rows: Object.values(g).sort((a, b) => b[2] - a[2]).map(r => [...r, (r[3] / r[2] * 100).toFixed(1) + '%']) }; } },
  { t: 'Familias atendidas', d: 'Familias por distrito de atención', build() {
      const g = group(D.fam, r => tc(r.dist), () => 1), tot = D.fam.length;
      return { name: 'familias_por_distrito', head: ['Distrito', 'Familias', '% del total'], nums: [1, 2], rows: topN(g, 999).map(([k, v]) => [k, v, (v / tot * 100).toFixed(1) + '%']) }; } }
];
let repSel = 0;
VIEWS.reportes = {
  html() {
    return `<h1 class="h1">Reportes</h1><div class="rep-layout">
      <div class="card glass no-print"><h3>Seleccione un reporte</h3><div class="rep-list">
        ${REPORTS.map((r, i) => `<button data-i="${i}" class="${i === repSel ? 'on' : ''}"><b>${r.t}</b><span>${r.d}</span></button>`).join('')}</div></div>
      <div class="card glass" id="rep-out"></div></div>`;
  },
  after() {
    const draw = () => {
      const r = REPORTS[repSel], b = r.build(S.year);
      $('#rep-out').innerHTML = `<div class="filters" style="justify-content:space-between"><h3 style="margin:0">${r.t}</h3>
        <span class="no-print"><button class="btn ghost" id="r-csv">Exportar CSV</button> <button class="btn" id="r-pdf">Imprimir / PDF</button></span></div>` + table(b.head, b.rows, b.nums);
      $('#r-csv').onclick = () => download(b.name + '.csv', b.head, b.rows);
      $('#r-pdf').onclick = () => print();
    };
    document.querySelectorAll('.rep-list button').forEach(btn => btn.onclick = () => {
      repSel = +btn.dataset.i; document.querySelectorAll('.rep-list button').forEach(x => x.classList.toggle('on', x === btn)); draw(); });
    draw();
  }
};

/* ---------- ESTADÍSTICAS ---------- */
VIEWS.estadisticas = { html() {
  const y = S.year, ys = years(), nm = nameOf();
  const mes = a => MESES.map((_, i) => sum(D.casos.filter(r => r.anio === a && r.mes === i + 1), r => r.cantidad));
  const cem = k => ys.map(a => sum(D.cem.filter(r => r.anio === a), r => r[k]));
  const fg = {}; D.fis.forEach(r => { const o = fg[r.distrito_fiscal] = fg[r.distrito_fiscal] || [0, 0]; o[0] += r.ingresado; o[1] += r.atendido; });
  const fm = Math.max(...Object.values(fg).map(v => v[0]), 1), fi = sum(Object.values(fg), v => v[0]), fa = sum(Object.values(fg), v => v[1]);
  const fis = `<div class="hb two">${Object.entries(fg).sort((a, b) => b[1][0] - a[1][0]).map(([k, v]) =>
    `<div><span class="nm">${tc(k)}</span><span class="bar" title="Ingresados ${fmt(v[0])} · Atendidos ${fmt(v[1])}"><u style="width:${v[0] / fm * 100}%"></u><u class="b2" style="width:${v[1] / fm * 100}%"></u></span><b>${Math.round(v[1] / v[0] * 100)}%</b></div>`).join('')}</div>
    <p class="note">Barra clara: ingresados · Barra verde: atendidos. Total ${fmt(fi)} ingresados, ${fmt(fa)} atendidos (${fi ? (fa / fi * 100).toFixed(1) : 0}%).</p>`;
  const gr = [['15-24', 15, 24], ['25-34', 25, 34], ['35-44', 35, 44], ['45-54', 45, 54], ['55+', 55, 200]];
  const mujF = D.fam.filter(r => r.sexo === 'Mujer').length;
  return `<h1 class="h1">Estadísticas</h1>
  <div class="grid g2">
    ${card('Comparativo mensual de casos por año', lines(MESES, ys.map((a, i) => ({ name: String(a), color: COL[i], data: mes(a) }))))}
    ${card('Atenciones CEM por tipo de violencia y año', bars(ys.map(String), [['Psicológica','psicologica'],['Física','fisica'],['Sexual','sexual']].map(([n, k], i) => ({ name: n, color: COL[i], data: cem(k) })), { stacked: true }))}
  </div>
  <div class="grid g2">
    ${card(`Top 10 distritos con más casos (${y})`, hbars(topN(group(D.casos.filter(r => r.anio === y), r => nm.get(r.ubigeo), r => r.cantidad), 10)))}
    ${card('Casos fiscales atendidos por distrito fiscal', fis)}
  </div>
  <div class="grid g3">
    ${card('Familias atendidas por edad', bars(gr.map(g => g[0]), [{ name: 'Familias', data: gr.map(g => D.fam.filter(r => r.edad >= g[1] && r.edad <= g[2]).length) }]))}
    ${card('Familias atendidas por sexo', donut([{ label: 'Mujeres', value: mujF, color: COL[1] }, { label: 'Hombres', value: D.fam.length - mujF, color: COL[2] }], D.fam.length, 'familias'))}
    ${card('Familias por distrito (Top 8)', hbars(topN(group(D.fam, r => tc(r.dist), () => 1), 8)))}
  </div>`;
} };

/* ---------- MAPA ---------- */
VIEWS.mapa = {
  html() {
    return `<h1 class="h1">Mapa de casos por distrito · ${S.year}</h1><div class="card glass">
      <div class="chips"><span class="chip">Tamaño del círculo = N.º de casos</span><span class="chip">Ubicación referencial (centro del distrito)</span></div>
      <div id="map"></div><p class="note" id="map-note"></p></div>`;
  },
  after() {
    if (typeof L === 'undefined') { $('#map').innerHTML = '<div class="fail">No se pudo cargar el mapa (Leaflet). Revisa tu conexión a internet.</div>'; return; }
    const map = L.map('map').setView([-12.03, -77.03], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OpenStreetMap' }).addTo(map);
    const nm = nameOf(), g = group(D.casos.filter(r => r.anio === S.year), r => r.ubigeo, r => r.cantidad);
    const mx = Math.max(...g.values(), 1); const pts = []; let omit = 0;
    g.forEach((v, u) => {
      const c = COORDS[u]; if (!c) { omit++; return; }
      L.circleMarker(c, { radius: 6 + 28 * Math.sqrt(v / mx), color: '#6d3df5', weight: 1.5, fillColor: '#9b6cf0', fillOpacity: .5 })
        .bindPopup(`<b>${esc(nm.get(u))}</b><br>${fmt(v)} casos`).addTo(map); pts.push(c);
    });
    if (pts.length) map.fitBounds(pts, { padding: [30, 30] });
    $('#map-note').textContent = omit ? `${omit} distritos de provincias de Lima (Cañete, Huaral, Huaura, etc.) no se muestran en el mapa; sí aparecen en Consultas y Reportes.` : '';
  }
};

/* ---------- CONFIGURACIÓN ---------- */
VIEWS.configuracion = { html() {
  const rows = [['Datos de casos mensuales', D.casos.length], ['Atenciones CEM', D.cem.length], ['Casos fiscales', D.fis.length], ['Familias atendidas', D.fam.length]];
  return `<h1 class="h1">Configuración</h1><div class="grid g2">
    ${card('Conexión', `<div class="kv"><b>Origen de datos</b><span>${DB.remote ? 'Supabase (en línea)' : 'Archivos locales /data (modo demostración)'}</span>
      <b>Servidor</b><span>${DB.remote ? esc(new URL(window.APP_CONFIG.SUPABASE_URL).host) : '—'}</span><b>Usuario</b><span>Administrador</span></div>
      <p style="margin-top:16px"><button class="btn" id="reload">Recargar datos</button></p>`)}
    ${card('Registros cargados', `<div class="kv">${rows.map(r => `<b>${r[0]}</b><span>${fmt(r[1])}</span>`).join('')}</div>`)}
  </div>`;
}, after() { $('#reload').onclick = async () => { D = await DB.loadAll(); prep(); route(); }; } };

/* =====================================================================
   ARRANQUE / NAVEGACIÓN
   ===================================================================== */
const NAV = [['dashboard','Dashboard'],['consultas','Consultas'],['reportes','Reportes'],['estadisticas','Estadísticas'],['mapa','Mapa'],['configuracion','Configuración']];
function prep() { D.fam.forEach(r => { r.anio = +String(r.fec_ing).slice(0, 4); r.sexo = r.sex_fam === 2 ? 'Mujer' : 'Hombre'; }); }

function route() {
  const v = (location.hash || '#dashboard').slice(1), name = VIEWS[v] ? v : 'dashboard';
  document.querySelectorAll('#nav a[data-v]').forEach(a => a.classList.toggle('on', a.dataset.v === name));
  $('#view').innerHTML = VIEWS[name].html(); VIEWS[name].after?.();
  $('#sidebar').classList.remove('open');
}

async function enter() {
  $('#login-view').hidden = true; $('#app-view').hidden = false;
  $('#nav').innerHTML = NAV.map(([k, l]) => `<a href="#${k}" data-v="${k}"><svg viewBox="0 0 24 24">${IC[k]}</svg>${l}</a>`).join('') +
    `<a class="out" id="logout"><svg viewBox="0 0 24 24">${IC.salir}</svg>Cerrar Sesión</a>`;
  $('#logout').onclick = async () => { await DB.logout(); location.hash = ''; location.reload(); };
  $('#view').innerHTML = '<div class="loading"><div class="spin"></div>Cargando datos…</div>';
  try {
    D = await DB.loadAll(); prep();
    const ys = years(); S.year = ys[ys.length - 1];
    $('#year').innerHTML = ys.map(y => `<option ${y === S.year ? 'selected' : ''}>${y}</option>`).join('');
    $('#year').onchange = e => { S.year = +e.target.value; route(); };
    window.onhashchange = route; route();
  } catch (e) {
    $('#view').innerHTML = `<div class="card glass fail">No se pudieron cargar los datos.<br><small>${esc(e.message)}</small><br><br>
      ${DB.remote ? 'Verifica que creaste las tablas, importaste los CSV y activaste las políticas (schema.sql).' : 'En modo local abre el sitio con Live Server (no con doble clic).'}</div>`;
  }
}

$('#burger').onclick = () => $('#sidebar').classList.toggle('open');
$('#login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const btn = $('#login-btn'), err = $('#login-err'); btn.disabled = true; btn.textContent = 'Ingresando…'; err.hidden = true;
  const r = await DB.login($('#u').value.trim(), $('#p').value);
  btn.disabled = false; btn.textContent = 'Ingresar al sistema';
  if (r.ok) enter();
  else { err.textContent = r.msg; err.hidden = false; const c = $('#login-form'); c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake'); }
});
(async () => {
  $('#mode-note').textContent = DB.remote ? '' : 'Modo demostración · datos locales (Supabase sin configurar)';
  if (await DB.hasSession()) enter(); else $('#login-view').hidden = false;
})();
