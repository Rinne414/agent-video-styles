// Seeded randomness: every value is a pure function of (id, hold index).
function hash32(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// One value in [0,1) for a named thing at hold index k (the "boil" re-roll).
function rnd(id, k) {
  const r = mulberry32(hash32(id) ^ Math.imul(k + 1, 2654435761));
  r();
  return r();
}
