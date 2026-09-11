/* Shared left-rail navigation and "Hide notes" wiring — one copy for every page.
   Each page sets `var ERS_PAGE = 'bike-sales';` (its own nav id) before loading this
   script, so the matching link gets marked current.

   Pages not built yet keep a '#' href rather than a real link, exactly as they did
   before this was shared - nothing to land on until that tab exists. */
var ERS_NAV = [
  { h: 'Overview', items: [
    { id: 'store-overview', t: 'Store Overview', href: 'store-overview.html' },
    { id: 'compare-stores', t: 'Compare Stores', href: '#' }
  ]},
  { h: 'Departments', items: [
    { id: 'bike-sales',   t: 'Bike Sales',   href: 'bike-sales.html' },
    { id: 'parts-sales',  t: 'Parts Sales',  href: '#' },
    { id: 'motorclothes', t: 'Motorclothes', href: '#' },
    { id: 'service',      t: 'Service',      href: '#' }
  ]},
  { h: 'Management', items: [
    { id: 'scorecards',     t: 'Scorecards',     href: '#' },
    { id: 'crm',             t: 'CRM',             href: '#' },
    { id: 'riding-academy', t: 'Riding Academy', href: '#' }
  ]},
  { h: 'Admin', items: [
    { id: 'maintenance', t: 'Maintenance', href: '#' }
  ]}
];

function renderNav(){
  var mount = document.getElementById('navRail');
  if (!mount) return;
  var html = '<div class="mark">ER<em>S</em></div><div class="sub">Executive Review System</div>', i, j;
  for (i = 0; i < ERS_NAV.length; i++) {
    html += '<h3>' + ERS_NAV[i].h + '</h3>';
    for (j = 0; j < ERS_NAV[i].items.length; j++) {
      var it = ERS_NAV[i].items[j];
      html += '<a href="' + it.href + '"' + (it.id === ERS_PAGE ? ' class="on"' : '') + '>' + it.t + '</a>';
    }
  }
  mount.innerHTML = html;
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
