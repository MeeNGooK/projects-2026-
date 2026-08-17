(() => {
  const $ = s => document.querySelector(s);
  const key = 'portbear-pilot-state-v1';
  const seed = () => ({
    consent: { personal: true, activity: true },
    offers: [
      { id: 'offer-hotel', type: 'coupon', merchant: '성수 작은 호텔', title: '오늘 남은 더블룸 1실', stock: 1, price: 0, expiry: Date.now() + 86400000, terms: '현장 QR 1회 사용 시 조식 포함 45% 할인' },
      { id: 'offer-film', type: 'pass', merchant: '망원 작은 극장', title: '독립영화 잔여 좌석 12석', stock: 12, price: 40, expiry: Date.now() + 72 * 3600000, terms: '선결제 이용권. 시작 2시간 전까지 취소 가능' },
      { id: 'offer-public', type: 'public', merchant: '한강 환경정화 모임', title: '토요일 10시 봉사 참여자 모집', stock: 20, price: 0, expiry: Date.now() + 168 * 3600000, terms: '참여 확인 후 지역 상점 혜택 책갈피 발급' }
    ], reservations: [], souvenirs: [], stats: { issued: 3, saved: 0, booked: 0, qr: 0, visits: 0 }
  });
  const get = () => JSON.parse(localStorage.getItem(key) || 'null') || seed();
  const set = state => localStorage.setItem(key, JSON.stringify(state));
  const typeLabel = type => ({ ad: '광고형', coupon: '무료 쿠폰', pass: '유료 이용권', public: '공익형' }[type] || '책갈피');
  const toast = text => { const box = $('#toast'); box.textContent = text; box.classList.add('show'); setTimeout(() => box.classList.remove('show'), 1800); };
  const status = offer => Math.max(0, Math.ceil((offer.expiry - Date.now()) / 3600000));
  let state = get();
  function save() { set(state); }
  function render() {
    $('#consentPersonal').checked = state.consent.personal; $('#consentActivity').checked = state.consent.activity;
    $('#aiReason').textContent = state.consent.personal ? '선택한 관심사(전시·커피), 활동 지역, 선호 여행지를 바탕으로 거리·시간·잔여 재고를 함께 고려합니다.' : '개인화 추천 동의가 꺼져 있어, 현재 위치와 인기·재고 기준의 일반 추천만 보여줍니다.';
    const reservationFor = id => state.reservations.find(x => x.offerId === id);
    const card = offer => { const reservation = reservationFor(offer.id); const action = reservation ? (reservation.used ? '사용 완료' : 'QR 열기') : (offer.type === 'ad' ? '저장' : offer.type === 'pass' ? `${offer.price} P 예약` : '예약·참여'); return `<article class="offer-card ${offer.type}"><span class="kind">${typeLabel(offer.type)}</span><div><b>${offer.title}</b><small>${offer.merchant} · 잔여 ${offer.stock} · ${status(offer)}시간</small></div><button data-offer="${offer.id}">${action}</button></article>`; };
    $('#offerList').innerHTML = state.offers.map(card).join('');
    $('#merchantOffers').innerHTML = state.offers.map(offer => `<article class="merchant-item"><b>${offer.title}</b><br>${typeLabel(offer.type)} · ${offer.merchant} · 재고 ${offer.stock} · 사용 ${state.reservations.filter(x => x.offerId === offer.id && x.used).length}건<br><small>${offer.terms}</small></article>`).join('');
    $('#souvenirList').innerHTML = state.souvenirs.length ? state.souvenirs.map(s => `<article class="souvenir"><b>✦ ${s.title}</b><small>${s.code} · ${s.merchant} · ${s.date}</small><p>1회 QR 사용 완료 · 양도/재판매 불가 디지털 기념책갈피</p></article>`).join('') : '<p class="pilot-copy">QR을 사용하면 고유번호가 있는 기념책갈피가 여기에 남습니다.</p>';
    const metrics = [['발행', state.stats.issued], ['저장', state.stats.saved], ['예약', state.stats.booked], ['QR 사용', state.stats.qr], ['예상 방문', state.stats.visits], ['남은 발행물', state.offers.reduce((n, x) => n + x.stock, 0)]];
    $('#metricGrid').innerHTML = metrics.map(([label, value]) => `<article class="metric"><small>${label}</small><b>${value}</b></article>`).join('');
    document.querySelectorAll('[data-offer]').forEach(button => button.onclick = () => offerAction(button.dataset.offer));
  }
  function offerAction(id) {
    const offer = state.offers.find(x => x.id === id); if (!offer) return;
    const existing = state.reservations.find(x => x.offerId === id);
    if (existing) return existing.used ? toast('이미 사용 완료된 QR입니다.') : openQr(existing, offer);
    if (offer.type === 'ad') { state.stats.saved++; save(); render(); return toast('광고형 책갈피를 저장했어요.'); }
    if (!offer.stock) return toast('잔여 수량이 없어요.');
    const reservation = { id: `R-${Date.now()}`, offerId: id, code: `PB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, used: false, date: new Date().toLocaleDateString('ko-KR') };
    state.reservations.unshift(reservation); state.stats.booked++; save(); render(); toast('예약 정보와 1회용 QR을 만들었어요.');
  }
  function openQr(reservation, offer) {
    let modal = $('#pilotQrModal');
    if (!modal) { document.body.insertAdjacentHTML('beforeend', '<section id="pilotQrModal" class="sheet"><div class="sheet-head"><b>현장 사용 QR</b><button id="closePilotQr">×</button></div><div class="qr-ticket"><div class="qr-code"></div><p id="pilotQrTitle"></p><small id="pilotQrCode"></small><b>1회 사용 · 중복 사용 방지</b></div><button id="usePilotQr" class="qr-action">QR 사용 처리</button></section>'); modal = $('#pilotQrModal'); $('#closePilotQr').onclick = () => modal.remove(); }
    $('#pilotQrTitle').textContent = offer.title; $('#pilotQrCode').textContent = reservation.code; $('#usePilotQr').dataset.reservation = reservation.id; $('#usePilotQr').dataset.offer = offer.id; $('#usePilotQr').classList.toggle('used', reservation.used); $('#usePilotQr').textContent = reservation.used ? '이미 사용 완료' : '현장 QR 사용 처리';
  }
  function useQr(reservationId, offerId) {
    const reservation = state.reservations.find(x => x.id === reservationId), offer = state.offers.find(x => x.id === offerId); if (!reservation || !offer) return;
    if (reservation.used) return toast('중복 사용이 차단됐어요.');
    reservation.used = true; offer.stock = Math.max(0, offer.stock - 1); state.stats.qr++; state.stats.visits++; state.souvenirs.unshift({ title: offer.title, merchant: offer.merchant, code: `PB-SOUV-${Math.random().toString(36).slice(2, 7).toUpperCase()}`, date: new Date().toLocaleDateString('ko-KR') }); save(); $('#pilotQrModal')?.remove(); render(); toast('QR 사용 완료 · 재고 차감 및 기념책갈피 발급');
  }
  function issue(event) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const expiryHours = +form.get('expiry'); const offer = { id: `offer-${Date.now()}`, type: form.get('type'), merchant: form.get('merchant').trim(), title: form.get('title').trim(), stock: +form.get('stock'), price: +form.get('price'), expiry: Date.now() + expiryHours * 3600000, terms: form.get('terms').trim() }; state.offers.unshift(offer); state.stats.issued++; save(); render(); toast('조건이 표시된 책갈피를 발행했어요.'); event.currentTarget.reset();
  }
  function course() { const result = $('#courseResult'); result.innerHTML = '<b>AI 추천 코스 · 성수 오후</b><ol><li>성수 작은 호텔 · 잔여 객실 확인</li><li>연남동 재즈 바 · 저장한 장소</li><li>망원 작은 극장 · 좌석 예약</li></ol><small>추천 사유: 선택한 취향·활동 지역·현재 재고/시간을 반영한 테스트 결과</small>'; result.classList.remove('hidden'); }
  document.querySelectorAll('[data-pilot-tab]').forEach(button => button.onclick = () => { document.querySelectorAll('[data-pilot-tab]').forEach(x => x.classList.toggle('selected', x === button)); document.querySelectorAll('[data-pilot-panel]').forEach(panel => panel.classList.toggle('hidden', panel.dataset.pilotPanel !== button.dataset.pilotTab)); render(); });
  $('#pilotButton').onclick = () => { render(); $('#pilotHub').classList.remove('hidden'); };
  $('#closePilot').onclick = () => $('#pilotHub').classList.add('hidden');
  $('#pilotReset').onclick = () => { localStorage.removeItem(key); state = get(); render(); toast('시운전 데이터를 초기화했어요.'); };
  $('#saveConsent').onclick = () => { state.consent.personal = $('#consentPersonal').checked; state.consent.activity = $('#consentActivity').checked; save(); render(); toast('동의 설정을 저장했어요.'); };
  $('#buildCourse').onclick = course; $('#issueForm').addEventListener('submit', issue); document.addEventListener('click', event => { if (event.target.id === 'usePilotQr') useQr(event.target.dataset.reservation, event.target.dataset.offer); }); render();
})();
