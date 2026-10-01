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

function renderNav(){
  var mount = document.getElementById('navRail');
  if (!mount) return;
  var html = '<div class="mark">ER<em>S</em></div><div class="sub">Executive Review System</div>', i, j;
  for (i = 0; i < ERS_NAV.length; i++) {
    html += '<h3>' + ERS_NAV[i].h + '</h3>';
    for (j = 0; j < ERS_NAV[i].items.length; j++) {
      var it = ERS_NAV[i].items[j];
      var built = it.href !== '#';
      var on = it.id === ERS_PAGE;
      html += '<a href="' + it.href + '"' +
        (on ? ' class="on" aria-current="page"' : built ? '' : ' class="soon" aria-disabled="true" tabindex="-1"') +
        '>' + it.t +
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
