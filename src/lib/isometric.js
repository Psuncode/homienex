// Build-time isometric cutaway-home generator.
// Ported verbatim (geometry-wise) from the prototype's getScene(); runs at
// build time in Astro frontmatter so the result ships as static inline SVG
// with zero client JS. Returns { svg, spots } where spots are hotspot
// positions as viewBox percentages.
export function buildScene(hotspots) {
  const SX = 33, SY = 16.5, SZ = 27;
  const iso = (x, y, z) => [(x - y) * SX, (x + y) * SY - z * SZ];
  const items = [];
  const C = {
    floor: { t: '#E6DAC3', r: '#C6B597', l: '#B2A083' },
    wall:  { t: '#F0E9DB', r: '#D3C8B5', l: '#C1B69F' },
    div:   { t: '#E7DFCF', r: '#CBC0AC', l: '#B9AD96' },
    sofa:  { t: '#2F7E5C', r: '#246349', l: '#1B5340' },
    wood:  { t: '#CBA069', r: '#B0884F', l: '#9B7742' },
    char:  { t: '#3C3833', r: '#2B2723', l: '#201D19' },
    bed:   { t: '#ECE5D7', r: '#D4CBB8', l: '#C2B7A1' },
    green: { t: '#2F7E5C', r: '#1E5B43', l: '#164431' },
    white: { t: '#F4F1EA', r: '#DAD3C5', l: '#C8C0AE' },
  };
  const box = (x, y, z, w, d, h, c, sw) => {
    const tp = [[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]].map(p => iso(p[0], p[1], p[2]));
    const rt = [[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]].map(p => iso(p[0], p[1], p[2]));
    const lf = [[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]].map(p => iso(p[0], p[1], p[2]));
    items.push({ key: x + y + z * 0.002, faces: [{ p: lf, fill: c.l, sw }, { p: rt, fill: c.r, sw }, { p: tp, fill: c.t, sw }] });
  };
  const flat = (pts3, fill, key) => { items.push({ key, faces: [{ p: pts3.map(p => iso(p[0], p[1], p[2])), fill }] }); };

  const T = 0.18, H = 0.5, DH = 0.34; // wall thickness, perimeter & divider heights
  box(0, 0, -0.22, 10, 8, 0.22, C.floor, '#0d0b09'); items[items.length - 1].key = -999;
  flat([[0.5, 0.5, 0.012], [4.4, 0.5, 0.012], [4.4, 3.6, 0.012], [0.5, 3.6, 0.012]], '#D7CBB3', -50);
  flat([[6.0, 4.6, 0.012], [9.5, 4.6, 0.012], [9.5, 7.5, 0.012], [6.0, 7.5, 0.012]], '#D2C7AF', -50);
  box(0, 0, 0, 10, T, H, C.wall, '#b3a98f');   // back wall
  box(0, 0, 0, T, 8, H, C.wall, '#b3a98f');     // left wall
  box(5, 0, 0, T, 4, DH, C.div, '#b6ab92');
  box(0, 4, 0, 5, T, DH, C.div, '#b6ab92');
  box(5, 4, 0, 5, T, DH, C.div, '#b6ab92');
  box(5, 4, 0, T, 4, DH, C.div, '#b6ab92');
  flat([[6.0, T + 0.002, 0.16], [8.2, T + 0.002, 0.16], [8.2, T + 0.002, 0.92], [6.0, T + 0.002, 0.92]], '#BFD8E6', 6.18);
  for (let i = 0; i < 4; i++) { const zz = 0.28 + i * 0.16; flat([[6.0, T + 0.004, zz], [8.2, T + 0.004, zz], [8.2, T + 0.004, zz + 0.05], [6.0, T + 0.004, zz + 0.05]], '#E8EEF2', 6.2); }
  flat([[T + 0.002, 5.3, 0.0], [T + 0.002, 6.7, 0.0], [T + 0.002, 6.7, 1.0], [T + 0.002, 5.3, 1.0]], '#7A5C3E', 5.3);
  flat([[T + 0.004, 5.45, 0.06], [T + 0.004, 6.55, 0.06], [T + 0.004, 6.55, 0.92], [T + 0.004, 5.45, 0.92]], '#8C6A48', 5.31);
  box(0.5, 2.6, 0, 2.7, 0.95, 0.5, C.sofa);
  box(0.55, 2.45, 0.5, 2.7, 0.3, 0.22, C.sofa);
  box(1.5, 1.6, 0, 1.2, 0.7, 0.26, C.wood);
  box(3.4, 0.25, 0, 1.1, 0.45, 0.42, C.char);
  flat([[3.55, 0.5, 0.5], [4.4, 0.5, 0.5], [4.4, 0.5, 1.18], [3.55, 0.5, 1.18]], '#15130F', 0.55);
  box(0.7, 0.7, 0, 0.16, 0.16, 1.15, C.char);
  box(0.55, 0.55, 1.15, 0.46, 0.46, 0.16, C.green);
  box(6.2, 1.0, 0, 2.6, 2.6, 0.42, C.bed);
  box(6.2, 0.7, 0, 2.6, 0.32, 0.95, C.white);
  box(6.45, 1.05, 0.42, 1.0, 0.55, 0.16, C.green);
  box(7.6, 1.05, 0.42, 1.0, 0.55, 0.16, C.green);
  box(8.95, 0.8, 0, 0.55, 0.55, 0.5, C.wood);
  box(5.15, 1.05, 0.42, 0.1, 0.42, 0.42, C.green);
  box(5.4, 4.5, 0, 0.8, 2.8, 0.55, C.char);
  box(7.2, 5.4, 0, 1.7, 1.0, 0.28, C.wood);
  box(7.0, 5.0, 0, 0.4, 0.4, 0.45, C.char); box(8.7, 5.0, 0, 0.4, 0.4, 0.45, C.char);
  box(7.0, 6.4, 0, 0.4, 0.4, 0.45, C.char); box(8.7, 6.4, 0, 0.4, 0.4, 0.45, C.char);
  box(0.45, 5.0, 0, 1.1, 0.5, 0.7, C.wood);
  box(0.3, 4.0, 1.45, 0.34, 0.42, 0.26, C.white);
  flat([[0.64, 4.12, 1.5], [0.64, 4.38, 1.5], [0.64, 4.38, 1.66], [0.64, 4.12, 1.66]], '#15130F', 4.0);
  box(10.3, 1.7, 0, 0.7, 1.0, 1.15, C.green);
  box(10.3, 3.0, 0, 0.7, 1.4, 0.85, C.white);
  box(11.0, 0.5, 0.0, 0.08, 1.9, 1.15, C.char);
  flat([[10.55, 0.3, 1.15], [10.55, 2.2, 1.15], [11.4, 2.2, 1.62], [11.4, 0.3, 1.62]], '#2C3A58', 12.0);

  let pts = [];
  items.forEach(it => it.faces.forEach(f => f.p.forEach(p => pts.push(p))));
  hotspots.map(h => iso(h.fx, h.fy, h.fz)).forEach(p => pts.push(p));
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const VW = 980, VH = 620, pad = 44;
  const s = Math.min((VW - 2 * pad) / (maxX - minX), (VH - 2 * pad) / (maxY - minY));
  const tx = pad - minX * s + ((VW - 2 * pad) - (maxX - minX) * s) / 2;
  const ty = pad - minY * s + ((VH - 2 * pad) - (maxY - minY) * s) / 2;
  const tf = p => [p[0] * s + tx, p[1] * s + ty];
  items.sort((a, b) => a.key - b.key);
  let svg = `<svg viewBox="0 0 ${VW} ${VH}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style="display:block" role="img" aria-label="Isometric cutaway of a smart home showing entry, living, kitchen, bedroom and energy zones" focusable="false">`;
  const sh = tf(iso(5, 4, -0.2));
  svg += `<ellipse cx="${sh[0].toFixed(0)}" cy="${(sh[1] + 18).toFixed(0)}" rx="${(330 * s / 1.4).toFixed(0)}" ry="${(150 * s / 1.4).toFixed(0)}" fill="#000" opacity="0.28"/>`;
  items.forEach(it => it.faces.forEach(f => {
    const d = f.p.map(p => { const q = tf(p); return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' ');
    svg += `<polygon points="${d}" fill="${f.fill}"${f.sw ? ` stroke="${f.sw}" stroke-width="1.1" stroke-linejoin="round"` : ''}/>`;
  }));
  svg += '</svg>';
  const spots = {};
  hotspots.forEach(h => { const q = tf(iso(h.fx, h.fy, h.fz)); spots[h.id] = { left: q[0] / VW * 100, top: q[1] / VH * 100 }; });
  return { svg, spots };
}
