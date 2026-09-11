/* Shared number formatting — identical on every ERS page. */
function commas(n){
  var s = String(Math.abs(Math.round(n))), o = '', c = 0, i;
  for (i = s.length - 1; i >= 0; i--) { o = s.charAt(i) + o; if (++c % 3 === 0 && i > 0) o = ',' + o; }
  return (n < 0 ? '−' : '') + o;
}
function money(n){ return '$' + commas(n); }
function pct1(n){ return n.toFixed(1) + '%'; }
function sgn(n, f){ return (n >= 0 ? '+' : '−') + f(Math.abs(n)); }
