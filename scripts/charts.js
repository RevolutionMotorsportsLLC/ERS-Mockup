/* ERS chart kit — dependency-free SVG, one copy for every page.

   WHY THIS EXISTS: every figure in ERS arrived as a table cell. These primitives
   make the three comparison points the data already carries (month to date, last
   month, last year) readable at a glance, without inventing anything.

   RULES THIS KIT OBEYS (see CLAUDE.md):
   - No trend lines. There is no daily feed; every dataset has three points.
   - Colour only where a judgment is possible. A chart with no red and no green is
     a healthy chart — absence of colour is information.
   - Never a zero for "no value". Em-dash on the axis and in labels.
   - The two day-counts stay separate and stay labelled.
   - Every figure reconciles with the tables beside it. Charts are a different
     view of the same numbers, never a second source of truth.

   Usage: ERS.bullet(el, rows) etc. — each takes a mount element and plain data,
   and replaces the mount's contents with inline SVG. */
var ERS = (function(){

/* ---------- shared helpers ---------- */

/* An em-dash means "no value". A zero means "this happened zero times". */
function dash(v){ return (v === null || v === undefined) ? '\u2014' : v; }
function fmtN(v){ return v === null || v === undefined ? '\u2014' : commas(v); }
function fmtM(v){ return v === null || v === undefined ? '\u2014' : money(v); }

function esc(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* Colour only where a judgment is possible. Returns '' when it is not.
   Pace: green at +3 points or more, red at -3 or worse (CLAUDE.md). */
function paceClass(pctPts){
  if (pctPts === null || pctPts === undefined) return '';
  return pctPts >= 3 ? 'up' : (pctPts <= -3 ? 'down' : '');
}

function mount(el, svg, label){
  if (!el) return;
  el.className = (el.className.indexOf('chart') > -1 ? el.className : el.className + ' chart').replace(/\s+/g,' ');
  el.setAttribute('role','img');
  el.setAttribute('aria-label', label || '');
  el.innerHTML = svg;
}

/* ================================================================
   1. PACE BULLET
   The hero chart. Answers "are we on plan" in one glance instead of
   three columns of arithmetic.

     [ label ] [ =========actual========= | ]  [ value ]
                             ▲ pace      ▲ prior
   ================================================================ */
function bullet(el, rows, opts){
  opts = opts || {};
  var labelW = opts.labelWidth || 168;
  var valueW = opts.valueWidth || 104;
  var rowH   = opts.rowHeight || 30;
  var gap    = 7;
  var W      = 900;
  var pad    = 2;
  var barTop = 8, barH = 11;
  var H      = rows.length * (rowH + gap);

  /* Scale: every row uses its own max so short rows stay readable. */
  var out = '<svg class="c-bullet" viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="' + H + '" preserveAspectRatio="none" aria-hidden="true">';
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    var y = i * (rowH + gap);
    var max = Math.max(r.value || 0, r.pace || 0, r.prior || 0) || 1;
    var x0 = labelW, x1 = W - valueW;
    var span = x1 - x0;

    out += '<text class="c-lab" x="0" y="' + (y + barTop + 9) + '">' + esc(r.label) + '</text>';

    /* track */
    out += '<rect class="c-track" x="' + x0 + '" y="' + (y + barTop) + '" width="' + span + '" height="' + barH + '" rx="2"/>';

    /* actual */
    var aw = Math.max(1, span * (r.value || 0) / max);
    out += '<rect class="c-fill ' + (r.cls || '') + '" x="' + x0 + '" y="' + (y + barTop) + '" width="' + aw + '" height="' + barH + '" rx="2"/>';

    /* pace marker */
    if (r.pace !== null && r.pace !== undefined) {
      var px = x0 + span * r.pace / max;
      out += '<line class="c-pace" x1="' + px + '" y1="' + (y + barTop - 3) + '" x2="' + px + '" y2="' + (y + barTop + barH + 3) + '"/>';
    }
    /* prior marker */
    if (r.prior !== null && r.prior !== undefined) {
      var rx = x0 + span * r.prior / max;
      out += '<line class="c-prior" x1="' + rx + '" y1="' + (y + barTop + barH + 4) + '" x2="' + rx + '" y2="' + (y + barTop + barH + 7) + '"/>';
    }

    out += '<text class="c-val" x="' + W + '" y="' + (y + barTop + 9) + '">' + esc(r.display === undefined ? fmtN(r.value) : r.display) + '</text>';

    /* basis caption — the two day-counts stay separate and labelled */
    if (r.caption) {
      out += '<text class="c-cap" x="' + x0 + '" y="' + (y + barTop + barH + 13) + '">' + esc(r.caption) + '</text>';
    }
  }
  out += '</svg>';
  mount(el, out, opts.label || (rows.length + ' pace bullets'));
}

/* ================================================================
   2. CONVERSION FUNNEL
   Sales-floor health in one shape. Greets -> sit-downs -> units.

   NOTE on `missed`: it is a loss count, not a stage. It renders as a
   side callout, not a funnel segment. See OPEN_QUESTIONS.md.
   ================================================================ */
function funnel(el, stages, opts){
  opts = opts || {};
  var W = 900, rowH = 34, gap = 10, labelW = 150, valW = 132;
  var H = stages.length * (rowH + gap);
  var top = stages[0].value || 1;
  var x0 = labelW, x1 = W - valW, span = x1 - x0;

  var out = '<svg class="c-funnel" viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="' + H + '" preserveAspectRatio="none" aria-hidden="true">';
  for (var i = 0; i < stages.length; i++) {
    var s = stages[i], y = i * (rowH + gap);
    var w = Math.max(2, span * (s.value || 0) / top);
    var conv = i === 0 ? '' : (stages[i-1].value ? Math.round(s.value / stages[i-1].value * 100) + '%' : '\u2014');

    out += '<text class="c-lab" x="0" y="' + (y + 16) + '">' + esc(s.label) + '</text>';
    out += '<rect class="c-track" x="' + x0 + '" y="' + y + '" width="' + span + '" height="20" rx="2"/>';
    out += '<rect class="c-fill" x="' + x0 + '" y="' + y + '" width="' + w + '" height="20" rx="2" opacity="' + (1 - i * 0.16) + '"/>';
    out += '<text class="c-val" x="' + W + '" y="' + (y + 15) + '">' + esc(fmtN(s.value)) + '</text>';
    if (conv) out += '<text class="c-cap" x="' + (x0 + w + 8) + '" y="' + (y + 14) + '">' + esc(conv) + ' of prior stage</text>';
    else      out += '<text class="c-cap" x="' + (x0 + w + 8) + '" y="' + (y + 14) + '">100%</text>';
  }
  out += '</svg>';
  mount(el, out, opts.label || 'Conversion funnel');
}

/* ================================================================
   3. WATERFALL
   "Where did the money go" in one shape. Used for the income
   statement: sales -> gross -> departmental -> admin -> net.
   ================================================================ */
function waterfall(el, items, opts){
  opts = opts || {};
  var W = 900, H = opts.height || 190;
  var padL = 4, padR = 4, padT = 16, padB = 34;
  var n = items.length;
  var gap = 14;
  var bw = (W - padL - padR - gap * (n - 1)) / n;

  /* Work out the running total so bars float. */
  var run = 0, tops = [], bots = [], i;
  for (i = 0; i < n; i++) {
    var it = items[i];
    if (it.type === 'total') {
      tops[i] = Math.max(0, it.value); bots[i] = Math.min(0, it.value);
      run = it.value;
    } else {
      var from = run, to = run + it.value;
      tops[i] = Math.max(from, to); bots[i] = Math.min(from, to);
      run = to;
    }
  }
  var hi = Math.max.apply(null, tops), lo = Math.min.apply(null, bots);
  var span = (hi - lo) || 1;
  var plotH = H - padT - padB;
  function y(v){ return padT + plotH - (v - lo) / span * plotH; }

  var out = '<svg class="c-waterfall" viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="' + H + '" aria-hidden="true">';
  /* zero baseline when the run crosses it */
  if (lo < 0) out += '<line class="c-base" x1="' + padL + '" y1="' + y(0) + '" x2="' + (W - padR) + '" y2="' + y(0) + '"/>';

  var prevTop = null;
  for (i = 0; i < n; i++) {
    var it2 = items[i];
    var x = padL + i * (bw + gap);
    var yt = y(tops[i]), yb = y(bots[i]);
    var h = Math.max(2, yb - yt);
    var cls = it2.type === 'total' ? 'c-wf-total' : (it2.value < 0 ? 'c-wf-neg' : 'c-wf-pos');

    /* connector from previous bar's end */
    if (prevTop !== null) {
      var cy = it2.type === 'total' ? y(items[i-1].type === 'total' ? items[i-1].value : run) : y(tops[i] === y(run) ? bots[i] : tops[i]);
      out += '<line class="c-wf-link" x1="' + (x - gap) + '" y1="' + prevTop + '" x2="' + x + '" y2="' + prevTop + '"/>';
    }

    out += '<rect class="' + cls + '" x="' + x + '" y="' + yt + '" width="' + bw + '" height="' + h + '" rx="2"/>';
    out += '<text class="c-val" x="' + (x + bw / 2) + '" y="' + (yt - 5) + '" text-anchor="middle">' +
             esc(it2.fmt ? it2.fmt(it2.value) : fmtM(it2.value)) + '</text>';
    out += '<text class="c-cap c-wf-lab" x="' + (x + bw / 2) + '" y="' + (H - padB + 15) + '" text-anchor="middle">' + esc(it2.label) + '</text>';

    /* end of this bar for the next connector */
    prevTop = it2.type === 'total' ? y(it2.value) : y(it2.value < 0 ? bots[i] : tops[i]);
  }
  out += '</svg>';
  mount(el, out, opts.label || 'Waterfall');
}

/* ================================================================
   4. AGING STACK
   One bar, three buckets. Obsolescence is a cash problem; three
   unrelated numbers hide that.
   ================================================================ */
function stack(el, segs, opts){
  opts = opts || {};
  var W = 900, barH = 30, H = barH + 42;
  var total = 0, i;
  for (i = 0; i < segs.length; i++) total += (segs[i].value || 0);
  if (!total) total = 1;

  var out = '<svg class="c-stack" viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="' + H + '" aria-hidden="true">';
  var x = 0;
  for (i = 0; i < segs.length; i++) {
    var s = segs[i];
    var w = W * (s.value || 0) / total;
    out += '<rect class="c-seg c-seg-' + i + '" x="' + x + '" y="0" width="' + Math.max(0, w - 2) + '" height="' + barH + '" rx="2"/>';
    if (w > 54) {
      out += '<text class="c-val c-on-dark" x="' + (x + 9) + '" y="' + (barH / 2 + 4) + '">' +
               esc(s.fmt ? s.fmt(s.value) : fmtM(s.value)) + '</text>';
    }
    /* legend row below */
    out += '<rect class="c-key c-seg-' + i + '" x="' + x + '" y="' + (barH + 16) + '" width="9" height="9" rx="1"/>';
    out += '<text class="c-cap" x="' + (x + 15) + '" y="' + (barH + 24) + '">' + esc(s.label) +
             ' \u00b7 ' + esc(s.fmt ? s.fmt(s.value) : fmtM(s.value)) + ' (' + Math.round((s.value || 0) / total * 100) + '%)</text>';
    x += w;
  }
  out += '</svg>';
  mount(el, out, opts.label || 'Composition');
}

/* ================================================================
   5. SORTED BARS (Pareto / ranking)
   A ranking question gets a ranking shape. The F&I charges table is
   sorted by product name, which hides where back-end gross actually
   comes from.
   ================================================================ */
function bars(el, items, opts){
  opts = opts || {};
  var labelW = opts.labelWidth || 176;
  var valW = opts.valueWidth || 110;
  var rowH = opts.rowHeight || 24, gap = 6;
  var W = 900, H = items.length * (rowH + gap);
  var x0 = labelW, x1 = W - valW, span = x1 - x0;
  var max = 0, i;
  for (i = 0; i < items.length; i++) max = Math.max(max, Math.abs(items[i].value || 0));
  if (!max) max = 1;

  var out = '<svg class="c-bars" viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="' + H + '" preserveAspectRatio="none" aria-hidden="true">';
  for (i = 0; i < items.length; i++) {
    var it = items[i], y = i * (rowH + gap);
    var w = Math.max(1, span * Math.abs(it.value || 0) / max);
    out += '<text class="c-lab" x="0" y="' + (y + 13) + '">' + esc(it.label) + '</text>';
    out += '<rect class="c-fill ' + (it.cls || '') + '" x="' + x0 + '" y="' + (y + 3) + '" width="' + w + '" height="14" rx="2"' +
           (it.base ? ' opacity="0.34"' : '') + '/>';
    out += '<text class="c-val" x="' + W + '" y="' + (y + 14) + '">' + esc(it.display === undefined ? fmtM(it.value) : it.display) + '</text>';
  }
  out += '</svg>';
  mount(el, out, opts.label || 'Ranked bars');
}

/* ================================================================
   6. SHARE BARS (department contribution)
   Two aligned bars: share of store sales, share of store gross. The
   inversion (Service is a sliver of sales and a slab of gross) is the
   most useful thing on Store Overview and is currently invisible.
   ================================================================ */
function share(el, series, opts){
  opts = opts || {};
  var W = 900, barH = 22, rowGap = 30, legendH = 30;
  var H = series.length * (barH + rowGap) + legendH;
  var out = '<svg class="c-share" viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="' + H + '" aria-hidden="true">';

  var r, i, x, total;
  for (r = 0; r < series.length; r++) {
    var row = series[r];
    total = 0;
    for (i = 0; i < row.parts.length; i++) total += (row.parts[i].value || 0);
    if (!total) total = 1;
    var y = r * (barH + rowGap);
    out += '<text class="c-lab" x="0" y="' + (y + 15) + '">' + esc(row.label) + '</text>';
    x = 150;
    for (i = 0; i < row.parts.length; i++) {
      var p = row.parts[i];
      var w = (W - 160) * (p.value || 0) / total;
      out += '<rect class="c-seg c-seg-' + i + '" x="' + x + '" y="' + y + '" width="' + Math.max(0, w - 2) + '" height="' + barH + '" rx="2"/>';
      if (w > 72) {
        out += '<text class="c-val c-on-dark" x="' + (x + 8) + '" y="' + (y + 15) + '">' + Math.round((p.value || 0) / total * 100) + '%</text>';
      }
      x += w;
    }
  }
  /* legend */
  var ly = series.length * (barH + rowGap) + 8, lx = 150;
  for (i = 0; i < series[0].parts.length; i++) {
    var lbl = series[0].parts[i].label;
    out += '<rect class="c-key c-seg-' + i + '" x="' + lx + '" y="' + ly + '" width="9" height="9" rx="1"/>';
    out += '<text class="c-cap" x="' + (lx + 15) + '" y="' + (ly + 9) + '">' + esc(lbl) + '</text>';
    lx += 22 + lbl.length * 5.6;
  }
  out += '</svg>';
  mount(el, out, opts.label || 'Share of total');
}

/* ================================================================
   7. HEATMAP / BAR MATRIX
   Cross-store comparison in one shape.

   IMPORTANT (CLAUDE.md hard rule 9): cross-store *ranking* is Phase 2
   and consent-gated. So:
   - Cells carry magnitude bars, neutral in colour. No green/red, because
     without a per-metric target there is no judgment to make, and
     colouring against peers would be ranking.
   - The reader's own store uses the documented `tr.me` accent treatment.
   - Below four contributing stores this renders the empty state instead
     of a two-cell heatmap. Design the empty state before the feature.
   ================================================================ */
function heatmap(el, cols, stores, opts){
  opts = opts || {};
  if (!stores || stores.length < (opts.minStores || 4)) {
    el.className = (el.className.indexOf('chart') > -1 ? el.className : el.className + ' chart');
    el.innerHTML = '<div class="chart-empty">' +
      '<b class="h">Not enough contributing stores</b>' +
      'Cross-store comparison needs at least four stores before it is shown \u2014 with fewer, ' +
      'a single store can be identified from its own row. Nothing is suppressed here by ' +
      'accident; it is the consent-gated empty state described in CLAUDE.md.' +
      '</div>';
    el.setAttribute('role','note');
    return;
  }

  var labelW = 148, cellW = opts.cellWidth || 96, headH = 46, rowH = 26;
  var W = labelW + cols.length * cellW;
  var H = headH + stores.length * rowH + 6;

  /* Column maxima for magnitude bars — neutral, not judgment. */
  var maxes = [], c, s;
  for (c = 0; c < cols.length; c++) {
    var m = 0;
    for (s = 0; s < stores.length; s++) {
      var v = cols[c].get(stores[s]);
      if (v !== null && v !== undefined) m = Math.max(m, Math.abs(v));
    }
    maxes[c] = m || 1;
  }

  var out = '<svg class="c-heat" viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="' + H + '" preserveAspectRatio="xMinYMin meet" aria-hidden="true">';
  for (c = 0; c < cols.length; c++) {
    var cx = labelW + c * cellW + cellW / 2;
    out += '<text class="c-col" x="' + cx + '" y="12" text-anchor="middle">' + esc(cols[c].short || cols[c].label) + '</text>';
    if (cols[c].unit) out += '<text class="c-col-unit" x="' + cx + '" y="24" text-anchor="middle">' + esc(cols[c].unit) + '</text>';
    out += '<line class="c-heat-rule" x1="' + (labelW + c * cellW) + '" y1="' + (headH - 8) + '" x2="' + (labelW + c * cellW) + '" y2="' + H + '"/>';
  }
  out += '<line class="c-heat-rule c-heat-rule-hard" x1="0" y1="' + (headH - 8) + '" x2="' + W + '" y2="' + (headH - 8) + '"/>';

  for (s = 0; s < stores.length; s++) {
    var st = stores[s];
    var y = headH + s * rowH;
    var me = opts.me && st.name === opts.me;
    if (me) out += '<rect class="c-heat-me" x="0" y="' + (y - 2) + '" width="' + W + '" height="' + rowH + '" rx="2"/>';
    out += '<text class="c-lab' + (me ? ' c-lab-me' : '') + '" x="0" y="' + (y + 15) + '">' + esc(st.name) + '</text>';
    for (c = 0; c < cols.length; c++) {
      var val = cols[c].get(st);
      var bx = labelW + c * cellW + 6;
      var bw = cellW - 12;
      if (val === null || val === undefined) {
        out += '<text class="c-dash" x="' + (bx + bw / 2) + '" y="' + (y + 15) + '" text-anchor="middle">\u2014</text>';
      } else {
        out += '<rect class="c-heat-track" x="' + bx + '" y="' + (y + 8) + '" width="' + bw + '" height="8" rx="1"/>';
        var fw = Math.max(1, bw * Math.abs(val) / maxes[c]);
        out += '<rect class="c-heat-fill' + (me ? ' me' : '') + '" x="' + bx + '" y="' + (y + 8) + '" width="' + fw + '" height="8" rx="1"/>';
        out += '<text class="c-heat-val' + (me ? ' me' : '') + '" x="' + (labelW + c * cellW + cellW / 2) + '" y="' + (y + 7) + '" text-anchor="middle">' +
                 esc(cols[c].fmt ? cols[c].fmt(val) : fmtN(val)) + '</text>';
      }
    }
    out += '<line class="c-heat-row" x1="0" y1="' + (y + rowH - 3) + '" x2="' + W + '" y2="' + (y + rowH - 3) + '"/>';
  }
  out += '</svg>';
  mount(el, out, opts.label || 'Cross-store comparison');
}

/* ================================================================
   8. PACE RIBBON
   Sits under the KPI ribbon as one panel with it (CLAUDE.md). Carries
   the two day-counts, labelled, so they are never read as an error.
   ================================================================ */
function paceRibbon(el, o){
  if (!el) return;
  var pct = o.total ? (o.elapsed / o.total * 100) : 0;
  var projPct = o.projTotal ? (o.projElapsed / o.projTotal * 100) : 0;
  el.innerHTML =
    '<div class="pbar">' +
      '<div class="pbar-track"><div class="pbar-fill" style="width:' + pct.toFixed(1) + '%"></div>' +
      '<div class="pbar-tick" style="left:' + pct.toFixed(1) + '%"></div></div>' +
      '<div class="pbar-legend">' +
        '<span><i class="k"></i>Display basis &mdash; <b>' + o.elapsed + ' of ' + o.total + '</b> open days</span>' +
        '<span><i class="k k2"></i>Projection basis &mdash; <b>' + o.projElapsed + ' of ' + o.projTotal + '</b> (six-day trading week)</span>' +
      '</div>' +
    '</div>';
}

return {
  bullet: bullet, funnel: funnel, waterfall: waterfall, stack: stack,
  bars: bars, share: share, heatmap: heatmap, paceRibbon: paceRibbon,
  paceClass: paceClass, dash: dash, fmtN: fmtN, fmtM: fmtM
};
})();
