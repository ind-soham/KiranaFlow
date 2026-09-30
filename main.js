(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Navbar compacts on scoll
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Process steps + product screen
  const row = (a, b) => `<div class="line"><span>${a}</span><b>${b}</b></div>`;
  const steps = [
    ['Install + KYC', 'Merchant signs up and consents to data use.', 'Onboarding', row('Shop name', 'Shree Ganesh General Stores') + row('KYC', 'Merchant verification') + row('Data-use consent', 'Given') + '<span class="tag">CONSENT RECORDED</span>'],
    ['Training', 'Merchant and family members learn the app in their local language.', 'Training', row('Language', 'मराठी') + row('Lesson 1', 'Record a sale') + row('Lesson 2', 'Record udhaar') + row('Family members', '2 invited')],
    ['Daily records', 'Sales, purchases, UPI and udhaar are recorded.', 'Daily total', row('Sales', '₹18,420') + row('Purchases', '₹11,250') + row('UPI', '₹9,840') + row('Udhaar', '₹3,200') + '<span class="tag">TRANSACTION RECORD</span>'],
    ['Quality check', 'Entries can be matched against UPI activity and inconsistencies flagged.', 'UPI match', row('UPI entries matched', '96%') + row('Flagged for review', 'Few') + row('Record quality', 'Strong') + '<span class="tag w">UPI MATCH · CHECKING</span>'],
    ['Track record', '60–90 days of activity creates a structured business record.', 'Track record', row('Progress', 'Day 67 / 90') + row('Business days', '67') + row('UPI matched', '96%') + '<span class="tag">STRUCTURED RECORD</span>'],
    ['Lending partner', 'With consent, the profile can be shared with a lending partner. The partner decides whether to lend.', 'Eligibility review', row('Share profile', 'Your choice') + row('Decision by', 'Lending partner') + row('Cost and terms', 'Shown by partner first') + '<span class="tag w">CONSENT REQUIRED</span>']
  ];
  const wrap = $('.steps'), screen = $('#screen');
  wrap.innerHTML = steps.map((s, i) => `<button role="tab" aria-selected="${i === 0}" data-i="${i}"><b>0${i + 1}</b><strong>${s[0]}</strong><span>${s[1]}</span></button>`).join('');
  const show = i => {
    wrap.querySelectorAll('button').forEach((b, j) => b.setAttribute('aria-selected', j === i));
    const s = steps[i];
    screen.innerHTML = `<div class="scr"><p class="lbl">Step ${i + 1} of 6</p><h4>${s[2]}</h4>${s[3]}</div>`;
  };
  wrap.addEventListener('click', e => { const b = e.target.closest('button'); if (b) show(+b.dataset.i); });
  wrap.addEventListener('keydown', e => {
    const cur = +document.activeElement.dataset.i; if (isNaN(cur)) return;
    const n = e.key === 'ArrowDown' ? cur + 1 : e.key === 'ArrowUp' ? cur - 1 : null;
    if (n !== null && steps[n]) { e.preventDefault(); show(n); wrap.children[n].focus(); }
  });
  show(0);

  // Calculator: case-study scenarios (₹ lakh)
  const sc = [[250, 6.28, 10.25, -3.97], [500, 12.57, 12.5, 0.07], [750, 18.85, 14.75, 4.1], [1000, 25.13, 17.0, 8.13]];
  const f = n => '₹' + n.toFixed(2) + 'L';
  const sl = $('#sl'), out = {rv: $('#rv'), co: $('#co'), pl: $('#pl')};
  const cur = {rv: 0, co: 0, pl: 0};
  let raf;
  const render = () => {
    const d = sc[sl.value]; $('#mv').textContent = d[0].toLocaleString('en-IN');
    const to = {rv: d[1], co: d[2], pl: d[3]}, t0 = performance.now(), from = {...cur};
    cancelAnimationFrame(raf);
    const tick = t => {
      const p = reduce ? 1 : Math.min((t - t0) / 450, 1), e = 1 - Math.pow(1 - p, 3);
      for (const k in to) { cur[k] = from[k] + (to[k] - from[k]) * e; }
      out.rv.textContent = f(cur.rv); out.co.textContent = f(cur.co);
      out.pl.textContent = (cur.pl < 0 ? '−' : '') + f(Math.abs(cur.pl));
      out.pl.className = to.pl < 0 ? 'neg' : 'pos';
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };
  sl.addEventListener('input', render); render();

  // Roadmap progress follows scroll
  const tl = $('.tl');
  const prog = () => { const r = tl.getBoundingClientRect(), p = Math.min(Math.max((innerHeight * .8 - r.top) / r.height * 1.4, 0), 1); tl.style.setProperty('--p', p * 100 + '%'); };
  addEventListener('scroll', prog, { passive: true }); prog();

  // Language chips are visual only
  document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.lang button').forEach(x => x.classList.remove('on')); b.classList.add('on');
  }));
})();
