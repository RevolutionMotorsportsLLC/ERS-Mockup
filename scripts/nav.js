/* Shared left-rail navigation, source-tag legend, "Hide notes" wiring, the
   source-tag filter and the Print page action — one copy for every page.

   Each page sets `var ERS_PAGE = 'bike-sales';` (its own nav id) before loading this
   script, so the matching link gets marked current.

   Pages not built yet keep a '#' href rather than a real link, exactly as they did
   before this was shared - nothing to land on until that tab exists. They render as
   visibly disabled with a "Soon" badge so a click doesn't bounce the reader to the
   top of the page for no reason. */
var ERS_NAV = [
  { h: 'Overview', items: [
    { id: 'store-overview', t: 'Store Overview', href: 'store-overview.html' },
    { id: 'scorecards',     t: 'Scorecards',     href: 'scorecards.html' },
    { id: 'financial-statements', t: 'Financial Statements', href: 'financial-statements.html' }
  ]},
  { h: 'Departments', items: [
    { id: 'bike-sales',   t: 'Bike Sales',   href: 'bike-sales.html' },
    { id: 'parts-sales',  t: 'Parts Sales',  href: 'parts-sales.html' },
    { id: 'motorclothes', t: 'Motorclothes', href: 'motorclothes.html' },
    { id: 'service',      t: 'Service',      href: 'service.html' }
  ]},
  { h: 'Management', items: [
    { id: 'crm',             t: 'CRM',             href: '#' },
    { id: 'riding-academy', t: 'Riding Academy', href: '#' }
  ]},
  { h: 'Admin', items: [
    { id: 'maintenance', t: 'Maintenance', href: '#' }
  ]}
];

/* The four source tags every data row carries (CLAUDE.md hard rule 3). Kept in the
   rail so the vocabulary is on screen wherever a tagged row is - 'derived' is the
   only band ERS calculates, and the only one a formula can get wrong. */
var ERS_SOURCES = [
  ['statement', 'read from the Talon statement', false],
  ['counted',   'unit, deal or invoice records', false],
  ['entered',   'dealer or CRM entered', false],
  ['derived',   'ERS arithmetic', true]
];

/* The brand glyph is the product's own hero chart: a pace bullet — track, fill,
   marker — drawn at 22px inside the accent square. 24px stroke icons, one per tab. */
var ERS_GLYPH =
  '<svg class="glyph" width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">' +
  '<rect width="22" height="22" rx="5" fill="#D9541F"/>' +
  '<rect x="4" y="9" width="14" height="4" rx="2" fill="rgba(255,255,255,.32)"/>' +
  '<rect x="4" y="9" width="9" height="4" rx="2" fill="#fff"/>' +
  '<rect x="15.25" y="6" width="1.5" height="10" rx=".75" fill="#fff" opacity=".9"/>' +
  '</svg>';

var ERS_ICONS = {
  'store-overview':      '<rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/>',
  'scorecards':          '<path d="M6 20v-7M12 20V4M18 20v-10"/>',
  'financial-statements':'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h5"/>',
  'bike-sales':          '<circle cx="5.5" cy="16.5" r="3"/><circle cx="18.5" cy="16.5" r="3"/><path d="M5.5 16.5l3.5-8h4.5l2.5 5M9 8.5h3.5M14.5 12.5h4"/>',
  'parts-sales':         '<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3.3 8.2l8.7 4.8 8.7-4.8M12 13v8"/>',
  'motorclothes':        '<path d="M20.4 3.5L16 2a4 4 0 0 1-8 0L3.6 3.5a2 2 0 0 0-1.3 2.2l.6 3.5a1 1 0 0 0 1 .8H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-10h2.2a1 1 0 0 0 1-.8l.6-3.5a2 2 0 0 0-1.4-2.2z"/>',
  'service':             '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',
  'crm':                 '<path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  'riding-academy':      '<circle cx="12" cy="8" r="5.5"/><path d="M8.5 12.5L7 21l5-2.5L17 21l-1.5-8.5"/>',
  'maintenance':         '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1.5 14h5M9.5 8h5M17.5 16h5"/>'
};

function ersIco(id){
  return ERS_ICONS[id]
    ? '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ERS_ICONS[id] + '</svg>'
    : '';
}

function renderNav(){
  var mount = document.getElementById('navRail');
  if (!mount) return;
  var html = '<div class="brand">' + ERS_GLYPH + '<div class="mark">ERS</div></div>' +
    '<div class="sub">Executive Review System</div>' +
    '<div class="brandrule"></div>', i, j;
  for (i = 0; i < ERS_NAV.length; i++) {
    html += '<h3>' + ERS_NAV[i].h + '</h3>';
    for (j = 0; j < ERS_NAV[i].items.length; j++) {
      var it = ERS_NAV[i].items[j];
      var built = it.href !== '#';
      var on = it.id === ERS_PAGE;
      html += '<a href="' + it.href + '"' +
        (on ? ' class="on" aria-current="page"' : built ? '' : ' class="soon" aria-disabled="true" tabindex="-1"') +
        '>' + ersIco(it.id) + '<span class="lbl">' + it.t + '</span>' +
        (built ? '' : '<span class="badge">Soon</span>') +
        '</a>';
    }
  }
  html += '<div class="railfoot"><div class="lg-title">Row sources</div>';
  for (i = 0; i < ERS_SOURCES.length; i++) {
    html += '<div class="lg-row' + (ERS_SOURCES[i][2] ? ' derived' : '') + '">' +
      '<span class="lg-k">' + ERS_SOURCES[i][0] + '</span>' +
      '<span class="lg-v">' + ERS_SOURCES[i][1] + '</span></div>';
  }
  html += '</div>';
  mount.innerHTML = html;

  /* Unbuilt tabs: keep the click inert instead of jumping to the top of the page. */
  var soon = mount.querySelectorAll('a.soon');
  for (i = 0; i < soon.length; i++) {
    soon[i].addEventListener('click', function(e){ e.preventDefault(); });
  }
}
renderNav();

/* ------------------------------------------------------------------
   Build notes default to hidden.

   The mockup is the specification, so the notes still have to be one
   click away on every page — but the default read is the dashboard,
   not the annotation. The toggle keeps its own label in sync.
   ------------------------------------------------------------------ */
(function(){
  var b = document.getElementById('notesToggle');
  document.body.className = 'notes-off';
  if (!b) return;
  b.innerHTML = 'Show notes';
  b.setAttribute('aria-pressed', 'true');
  b.onclick = function(){
    var off = document.body.className.indexOf('notes-off') > -1;
    document.body.className = off ? '' : 'notes-off';
    b.innerHTML = off ? 'Hide notes' : 'Show notes';
    b.setAttribute('aria-pressed', off ? 'false' : 'true');
  };
})();

/* ------------------------------------------------------------------
   Source tags are a filter, not just a label.

   Hard rule 3 puts provenance on every row. Clicking a tag isolates
   that band so the data contract can actually be audited — click again
   to clear. Turns an existing trust convention into a working tool
   with no new data behind it.
   ------------------------------------------------------------------ */
(function(){
  var current = null;
  function apply(){
    var rows = document.querySelectorAll('tbody tr'), i, j, tags, hit;
    for (i = 0; i < rows.length; i++) {
      if (!current) { rows[i].className = rows[i].className.replace(/\s*src-hit|\s*src-miss/g, ''); continue; }
      tags = rows[i].querySelectorAll('.src');
      hit = false;
      for (j = 0; j < tags.length; j++) {
        if (tags[j].textContent.replace(/\s+/g,'').toLowerCase().indexOf(current) === 0) { hit = true; break; }
      }
      var cls = rows[i].className.replace(/\s*src-hit|\s*src-miss/g, '');
      rows[i].className = cls + (hit ? ' src-hit' : ' src-miss');
    }
    document.body.setAttribute('data-src-filter', current || '');
  }

  document.addEventListener('click', function(e){
    var t = e.target;
    while (t && t !== document && !(t.className && String(t.className).indexOf('src') > -1)) t = t.parentNode;
    if (!t || t === document) return;
    var word = (t.textContent || '').replace(/[^a-z]/gi,'').toLowerCase();
    var known = false, i;
    for (i = 0; i < ERS_SOURCES.length; i++) if (word.indexOf(ERS_SOURCES[i][0]) === 0) known = true;
    if (!known) return;
    e.preventDefault();
    e.stopPropagation();
    current = (current === word) ? null : word;
    apply();
  });

  /* Escape clears the filter, like any other transient highlight. */
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && current) { current = null; apply(); }
  });
})();

/* "Print page" prints. The print stylesheet in app.css strips the rail, the
   controls and the developer notes so what comes out is a clean report. */
(function(){
  var btns = document.querySelectorAll('.acts .btn'), i;
  for (i = 0; i < btns.length; i++) {
    if (/^\s*Print page\s*$/i.test(btns[i].textContent)) {
      (function(b){
        b.addEventListener('click', function(){ window.print(); });
      })(btns[i]);
    }
  }
})();
