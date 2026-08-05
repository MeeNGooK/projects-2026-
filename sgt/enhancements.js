const localBusinessSeeds = [
  ['망원 꽃집 원데이 클래스','첫 방문 2인 패키지 30% 할인 · 꽃다발은 그대로 가져가세요.','1490750967868-88aa4486c946'],
  ['연희동 수제 파스타','소개팅 고객 웰컴 드링크 제공 · 당일 예약 가능.','1551183053-bf91a1d81141'],
  ['성수 사진관 커플 촬영','15분 미니 촬영 + 보정 2장 · 둘만의 첫 기록을 남겨요.','1516035069371-29a1b244cc32'],
  ['합정 보드게임 카페','2인 첫 방문 1시간 무료 · 대화가 자연스럽게 시작돼요.','1511632765486-a01980e01a18'],
  ['용산 도예 공방','함께 만드는 머그컵 체험 · 이번 주말 잔여석 4자리.','1452860606245-08befc0ff44b'],
  ['잠실 반려견 산책 서비스','주말 1시간 체험 산책 · 반려견 친구도 함께 만나요.','1558788353-f76d92427f16']
];
localBusinessSeeds.forEach(([title,text,id],i)=>contents.push({kind:'ad',title,text,asset:id,mark:'LOCAL PARTNER · 동네 제휴',image:`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1800&q=88`,likes:52+i*7}));

function runAgent(content){
  const title = content.title.replace('<br />',' ');
  const number = `SBS-${Math.floor(100000+Math.random()*899999)}`;
  $('#chatName').textContent='AI 예약 도우미';
  $('#chatSheet').classList.remove('hidden');
  const log=$('#chatLog');
  log.innerHTML=`<div class="message them">${title} 특가 예약을 도와드릴게요.</div><div class="message them">혜택과 예약 가능 여부를 확인하고 있어요.</div>`;
  $('#typing').classList.remove('hidden');
  setTimeout(()=>{log.insertAdjacentHTML('beforeend','<div class="message them">숙박객 정보를 전송했습니다.<br/>예약자: 테스트 사용자 · 인원: 2명</div>');log.scrollTop=log.scrollHeight},900);
  setTimeout(()=>{log.insertAdjacentHTML('beforeend','<div class="message them">예약 가능 여부를 확인했습니다. 현재 특가가 적용됩니다.</div>');log.scrollTop=log.scrollHeight},1800);
  setTimeout(()=>{log.insertAdjacentHTML('beforeend',`<div class="message them"><b>예약 완료 ✓</b><br/>예약 번호: ${number}<br/>결제: 테스트 결제수단 · 자동 확정</div>`);$('#typing').classList.add('hidden');log.scrollTop=log.scrollHeight},2800);
}
