/* Shared number formatting — identical on every ERS page. */
function commas(n){
  var s = String(Math.abs(Math.round(n))), o = '', c = 0, i;
  for (i = s.length - 1; i >= 0; i--) { o = s.charAt(i) + o; if (++c % 3 === 0 && i > 0) o = ',' + o; }
  return (n < 0 ? '−' : '') + o;
}
function money(n){ return '$' + commas(n); }
function pct1(n){ return n.toFixed(1) + '%'; }
function sgn(n, f){ return (n >= 0 ? '+' : '−') + f(Math.abs(n)); }

/* Hard rule 4: never show a zero where there is no value. An em-dash means
   "no goal set" or "not available"; a zero means "this happened zero times".
   This is the only correct way to print a missing figure. */
function dashIf(v){
  return (v === null || v === undefined || v === '' || v === 'None' || v === 'null') ? '—' : v;
}

/* A count cannot be negative. When a source value violates its own type —
   e.g. bike-sales' transactions.missed arrives as −14 — print the magnitude
   and flag the row rather than either inventing a sign or trusting a broken
   figure silently. The flag explains itself on hover. OPEN_QUESTIONS.md tracks
   what Logan needs to confirm. */
function counted(v, note){
  if (v === null || v === undefined) return '—';
  var bad = v < 0;
  var out = commas(Math.abs(v));
  if (bad) {
    out += '<span class="qflag" title="' +
      (note || 'Source value is ' + commas(v) + '. A count cannot be negative, so the ' +
       'magnitude is shown and the figure is flagged for review. See OPEN_QUESTIONS.md.') +
      '">&#9873;</span>';
  }
  return out;
}
