(function () {
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  body.setAttribute('data-theme', prefersLight ? 'light' : 'dark');
  themeToggle.addEventListener('click', () => {
    const next = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', next);
  });

  const REVIEWS = [
    { name: "Даня Рогачёв", date: "22 июня", avatar: "https://avatars.mds.yandex.net/get-yapic/65952/0d-6/orig", text: "Решил сразу обменять деньги перед отдыхом, персонал любезный и быстренько все сделал и что самое главное курс вообще топ. Всем рекомендую" },
    { name: "Анастасия Блинникова", date: "15 июня", avatar: "https://avatars.mds.yandex.net/get-yapic/31804/0m-7/orig", text: "Отличный обменник, быстрый сервис и мягкий персонал. Найти легко, просто зайдите в цветочный магазин. Советую." },
    { name: "Матвей Шалагин", date: "28 марта", avatar: "https://avatars.mds.yandex.net/get-yapic/26311/0h-4/orig", text: "Данное место очень понравилось. Обслуживание быстрое и качественное. Курс валют полностью устроил. Обязательно буду заходить сюда и не раз!" },
    { name: "Дима Прока", date: "27 марта", avatar: "https://avatars.mds.yandex.net/get-yapic/27503/0d-7/orig", text: "Лучший курс! Лучшее расположение! Лучший сервис. Без преувеличения один из лучших обменников в которых я бываю." },
    { name: "викА", date: "7 октября", avatar: "https://avatars.mds.yandex.net/get-yapic/60687/8UvGHsAxiKkqOAO6heB6gt1IIU-1/orig", text: "Посетила этот пункт, мне очень все понравилось, быстро обслужили, вежливые кассиры, буду обращаться еще, спасибо большое" },
    { name: "Николай Макаров", date: "23 апреля", avatar: "https://avatars.mds.yandex.net/get-yapic/43473/dSCzRUJqLweK9SBBMtyHquiNY-1/orig", text: "Отличный персонал, быстро и качественно обменяли валюту. Советую всем. Чистое место, курс валют хороший." },
    { name: "Lyu@125", date: "19 мая", avatar: "https://avatars.mds.yandex.net/get-yapic/31078/0o-4/orig", text: "Операционная касса супер, выгодный курс, вежливый персонал, который поможет во всем." },
    { name: "Денис Солонин", date: "20 апреля", avatar: "https://avatars.mds.yandex.net/get-yapic/68143/0g-8/orig", text: "Быстрое обслуживание. Вежливый персонал, все подробно объяснят если что-то не понятно. В зале ожидания чисто." },
  ];

  function initials(name) { return name.split(' ').filter(Boolean).slice(0, 2).map(s => s[0]).join('').toUpperCase(); }

  function renderReviews() {
    const grid = document.getElementById('reviewsGrid');
    grid.innerHTML = REVIEWS.map(r => `
      <div class="review-card">
        <div class="review-head">
          <div class="review-avatar">${r.avatar ? `<img src="${r.avatar}" alt="${r.name}" loading="lazy">` : initials(r.name)}</div>
          <div><div class="review-name">${r.name}</div><div class="review-date">${r.date}</div></div>
        </div>
        <div class="review-stars">★★★★★</div>
        <p class="review-text">${r.text}</p>
      </div>
    `).join('');
  }
  renderReviews();

  let RATES = [];
  const fmt = n => Number(n).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function renderMiniBoard() {
    const el = document.getElementById('mini-board-body');
    if (!RATES.length) { el.innerHTML = '<div class="mini-row"><span class="mini-unavail">Курсы не опубликованы</span></div>'; return; }
    el.innerHTML = RATES.map(r => `
      <div class="mini-row">
        <div class="mini-cur">
          <span class="flag">${r.flag || ''}</span>
          <div><div class="code">${r.code.replace('_',' ')}</div><div class="name">${r.name}</div></div>
        </div>
        ${r.available
          ? `<div class="mini-nums"><div class="buy">${fmt(r.buy)}</div><div class="sell">${fmt(r.sell)}</div></div>`
          : `<div class="mini-unavail">по звонку</div>`}
      </div>
    `).join('');
  }

  function renderRatesGrid() {
    const grid = document.getElementById('ratesGrid');
    if (!RATES.length) { grid.innerHTML = '<div class="rate-card"><div class="rate-card-head"><span class="name">Курсы не опубликованы</span></div></div>'; return; }
    grid.innerHTML = RATES.map(r => {
      if (!r.available) {
        return `
          <div class="rate-card unavailable">
            <div class="rate-card-head" style="justify-content:center;">
              <span class="flag">${r.flag || ''}</span>
              <div><div class="code">${r.code.replace('_',' ')}</div><div class="name">${r.name}</div></div>
            </div>
            <p class="msg">Курс уточняйте по телефону</p>
            <a class="btn btn-outline" href="tel:+79616269999">+7 (961) 626-99-99</a>
          </div>`;
      }
      return `
        <div class="rate-card">
          <div class="rate-card-head">
            <span class="flag">${r.flag || ''}</span>
            <div><div class="code">${r.code.replace('_',' ')}</div><div class="name">${r.name}</div></div>
          </div>
          ${r.code === 'EUR500' ? '<div style="display:inline-flex;align-items:center;padding:5px 9px;border-radius:999px;background:var(--gold);color:#15100a;font-size:12px;font-weight:700;margin:-4px 0 8px;">Купюра 500 €</div>' : ''}
          <div class="rate-line"><span>Покупка</span><span class="val buy">${fmt(r.buy)} ₽</span></div>
          <div class="rate-line"><span>Продажа</span><span class="val sell">${fmt(r.sell)} ₽</span></div>
        </div>`;
    }).join('');
  }

  function populateCalcCurrencies() {
    const sel = document.getElementById('calcCurrency');
    sel.innerHTML = RATES.map(r =>
      `<option value="${r.code}">${(r.flag||'')} ${r.code.replace('_',' ')} — ${r.name}${!r.available ? ' (нет в наличии)' : ''}</option>`
    ).join('');
  }

  let mode = 'buy';

  function runCalc() {
    const code = document.getElementById('calcCurrency').value;
    const amount = parseFloat(document.getElementById('calcAmount').value) || 0;
    const rate = RATES.find(r => r.code === code);
    const box = document.getElementById('resultBox');
    const label = document.getElementById('resultLabel');
    const amountEl = document.getElementById('resultAmount');
    const note = document.getElementById('resultRateNote');

    if (!rate || !rate.available) {
      box.classList.add('unavailable');
      label.textContent = '';
      amountEl.textContent = 'Валюта временно недоступна — уточните по телефону +7 (961) 626-99-99';
      note.textContent = '';
      return;
    }
    box.classList.remove('unavailable');

    if (mode === 'buy') {
      label.textContent = 'Вы отдаёте:';
      amountEl.textContent = fmt(amount * rate.sell) + ' ₽';
      note.textContent = `Курс: ${fmt(rate.sell)} ₽ за 1 ${rate.code.replace('_',' ')}`;
    } else {
      label.textContent = 'Вы получаете:';
      amountEl.textContent = fmt(amount * rate.buy) + ' ₽';
      note.textContent = `Курс: ${fmt(rate.buy)} ₽ за 1 ${rate.code.replace('_',' ')}`;
    }
  }

  document.getElementById('segBuy').addEventListener('click', () => {
    mode = 'buy';
    document.getElementById('segBuy').classList.add('active');
    document.getElementById('segSell').classList.remove('active');
    runCalc();
  });
  document.getElementById('segSell').addEventListener('click', () => {
    mode = 'sell';
    document.getElementById('segSell').classList.add('active');
    document.getElementById('segBuy').classList.remove('active');
    runCalc();
  });
  document.getElementById('calcAmount').addEventListener('input', runCalc);
  document.getElementById('calcCurrency').addEventListener('change', runCalc);

  function load() {
    fetch('/api/rates?_=' + Date.now())
      .then(res => { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
      .then(data => {
        RATES = data.rates || [];
        renderMiniBoard();
        renderRatesGrid();
        populateCalcCurrencies();
        runCalc();
      })
      .catch(err => {
        console.error('Ошибка загрузки курсов:', err);
        document.getElementById('mini-board-body').innerHTML = '<div class="mini-row"><span class="mini-unavail">Не удалось загрузить курсы</span></div>';
      });
  }

  load();
  setInterval(load, 60000);
})();