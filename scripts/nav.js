/* Shared left-rail navigation, source-tag legend, "Hide notes" wiring and the
   Print page action — one copy for every page.

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

(function(){
  var b = document.getElementById('notesToggle');
  if (!b) return;
  b.onclick = function(){
    var off = document.body.className.indexOf('notes-off') > -1;
    document.body.className = off ? '' : 'notes-off';
    b.innerHTML = off ? 'Hide notes' : 'Show notes';
    b.setAttribute('aria-pressed', off ? 'false' : 'true');
  };
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
