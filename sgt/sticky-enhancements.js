(() => {
  const $ = s => document.querySelector(s);
  const keys = { bookmarks: 'sbs-bookmarks', bookings: 'sbs-bookings', likes: 'sbs-likes', hots: 'sbs-hots' };
  const read = key => JSON.parse(localStorage.getItem(keys[key]) || '[]');
  const write = (key, value) => localStorage.setItem(keys[key], JSON.stringify(value));
  const uniqueAdd = (key, item) => { const list = read(key); if (!list.some(x => x.title === item.title)) { list.unshift(item); write(key, list); } renderCollections(); };
  const itemFrom = note => ({ title: note.querySelector('h1')?.textContent || '저장한 메모', image: note.querySelector('img')?.src || '', detail: note.querySelector('.note-body')?.textContent || '' });

  function bookmarkMarkup(item, kind) { return `<button class="mini-bookmark ${kind}" data-title="${item.title}" data-detail="${item.detail}"><span>${kind === 'booking' ? '▣' : '🔖'}</span><b>${item.title}</b><small>${kind === 'booking' ? '예약 QR 열기' : '저장한 콘텐츠'}</small></button>`; }
  function peopleMarkup(item) { return `<div class="person-chip"><img src="${item.image}" alt="" /><span>${item.title}</span></div>`; }
  function renderCollections() {
    const bookmarks = read('bookmarks'), bookings = read('bookings'), likes = read('likes'), hots = read('hots');
    $('#bookmarkList').innerHTML = bookmarks.length ? bookmarks.map(x => bookmarkMarkup(x, 'bookmark')).join('') : '<p class="empty-list">아직 붙인 책갈피가 없어요.</p>';
    $('#bookingList').innerHTML = bookings.length ? bookings.map(x => bookmarkMarkup(x, 'booking')).join('') : '<p class="empty-list">예약한 메모가 없어요.</p>';
    $('#likeList').innerHTML = likes.length ? likes.map(peopleMarkup).join('') : '<p class="empty-list">좋아요한 인연이 없어요.</p>';
    $('#hotList').innerHTML = hots.length ? hots.map(peopleMarkup).join('') : '<p class="empty-list">Hot한 인연이 없어요.</p>';
    document.querySelectorAll('.mini-bookmark.booking').forEach(button => button.onclick = () => openReservation(button.dataset.title, button.dataset.detail));
  }
  function openReservation(title, detail) { $('#qrTitle').textContent = title; $('#qrDetail').textContent = detail; $('#reservationSheet').classList.remove('hidden'); }
  function bindNote(note) {
    if (!note || note.dataset.enhanced) return;
    note.dataset.enhanced = 'true';
    const item = itemFrom(note);
    if (note.classList.contains('content-note')) {
      const actions = note.querySelector('.note-actions');
      if (actions) { actions.innerHTML = '<button class="content-bookmark">🔖 저장</button><button class="content-comment">💬 댓글</button>'; actions.querySelector('.content-bookmark').onclick = () => { uniqueAdd('bookmarks', item); actions.querySelector('.content-bookmark').textContent = '✓ 저장됨'; }; actions.querySelector('.content-comment').onclick = () => window.openComments?.(); }
      const reserve = note.querySelector('.reserve');
      if (reserve) { const replacement = reserve.cloneNode(true); reserve.replaceWith(replacement); replacement.onclick = () => { uniqueAdd('bookings', item); replacement.textContent = '✓ 내 예약 메모에 붙였어요'; }; }
    } else if (note.classList.contains('profile-note')) {
      const heart = note.querySelector('.heart');
      if (heart) { const replacement = heart.cloneNode(true); heart.replaceWith(replacement); replacement.textContent = '♡'; replacement.onclick = () => { uniqueAdd('likes', item); replacement.textContent = '♥'; replacement.classList.add('selected'); }; }
    }
  }
  function enhanceNotes() { document.querySelectorAll('.sticky:not(.back)').forEach(bindNote); }
  function startIntro() { const splash = $('#introSplash'), note = $('#introNote'); if (!splash) return; setTimeout(() => note.classList.add('peel'), 900); setTimeout(() => splash.classList.add('finish'), 1450); setTimeout(() => splash.remove(), 1900); }
  const observer = new MutationObserver(enhanceNotes);
  observer.observe($('#noteStack'), { childList: true, subtree: true });
  $('#meButton').addEventListener('click', () => setTimeout(renderCollections, 0));
  $('#findButton').onclick = () => $('#findSheet').classList.remove('hidden');
  document.querySelectorAll('.search-people article').forEach(card => card.querySelector('.search-hot').onclick = () => { const button = card.querySelector('.search-hot'); uniqueAdd('hots', { title: card.dataset.name, image: card.dataset.image, detail: 'Hot으로 저장한 인연', mutual: card.dataset.name === '윤슬, 30' }); button.textContent = '🔥 Hot!'; button.classList.add('selected'); });
  document.addEventListener('click', event => { if (event.target.closest('#editMe')) setTimeout(renderCollections, 0); });
  enhanceNotes(); renderCollections(); startIntro();
})();
