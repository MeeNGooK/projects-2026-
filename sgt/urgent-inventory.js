const urgentInventorySeeds = [
  ['오늘만 · 홍대 부티크 호텔 빈 객실','체크인 18시 이후 · 디럭스 더블 1실이 비었습니다. 당일 특가 45% 할인.','1564501049412-61c2a3083791','객실: 디럭스 더블 1실 · 투숙: 2명 · 체크인: 오늘 18:00'],
  ['마감 임박 · 영화관 잔여 2석','오늘 20:10 상영 · 중앙 블록 연석 2자리를 특가로 오픈합니다.','1489599849927-2ee91cede3ba','상영: 오늘 20:10 · 좌석: A관 F열 7–8번 · 인원: 2명'],
  ['당일 취소 · 이탈리안 바 테이블','저녁 7시 창가 2인석이 비었어요. 웰컴 와인 2잔을 제공합니다.','1414235077428-338989a2e8c0','예약: 오늘 19:00 · 좌석: 창가 테이블 · 인원: 2명'],
  ['마감 전 · 도예 공방 잔여석','오늘 저녁 머그컵 클래스에 딱 2자리가 남았어요.','1452860606245-08befc0ff44b','클래스: 오늘 19:30 · 잔여석: 2석 · 체험: 머그컵 만들기'],
  ['갑작스러운 취소 · 프라이빗 상영관','오늘 밤 9시, 2시간 단독 대관 슬롯이 비었습니다.','1485846234645-a62644f84728','대관: 오늘 21:00–23:00 · 룸: 프라이빗 1실 · 인원: 2명'],
  ['오늘의 빈 타임 · 향수 공방','16:30 두 명이 함께 만드는 커스텀 향수 체험이 가능합니다.','1523293182086-7651a899d37f','체험: 오늘 16:30 · 인원: 2명 · 상품: 30ml 커스텀 향수']
];
urgentInventorySeeds.forEach(([title,text,id,bookingInfo],i)=>contents.push({kind:'ad',title,text,asset:id,mark:'URGENT INVENTORY · 당일 특가',image:`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1800&q=88`,likes:83+i*11,bookingInfo}));

function runAgent(content){
  const title = content.title.replace('<br />',' ');
  const number = `SBS-${Math.floor(100000+Math.random()*899999)}`;
  const bookingInfo = content.bookingInfo || '예약자: 테스트 사용자 · 인원: 2명';
  $('#chatName').textContent='AI 예약 도우미';
  $('#chatSheet').classList.remove('hidden');
  const log=$('#chatLog');
  log.innerHTML=`<div class="message them">${title} 특가 예약을 도와드릴게요.</div><div class="message them">남은 재고와 할인 조건을 실시간으로 확인하고 있어요.</div>`;
  $('#typing').classList.remove('hidden');
  setTimeout(()=>{log.insertAdjacentHTML('beforeend',`<div class="message them">예약 정보를 전송했습니다.<br/>${bookingInfo}</div>`);log.scrollTop=log.scrollHeight},900);
  setTimeout(()=>{log.insertAdjacentHTML('beforeend','<div class="message them">해당 재고가 아직 남아 있어요. 당일 특가를 적용합니다.</div>');log.scrollTop=log.scrollHeight},1800);
  setTimeout(()=>{log.insertAdjacentHTML('beforeend',`<div class="message them"><b>예약 완료 ✓</b><br/>예약 번호: ${number}<br/>결제: 테스트 결제수단 · 자동 확정</div>`);$('#typing').classList.add('hidden');log.scrollTop=log.scrollHeight},2800);
}
