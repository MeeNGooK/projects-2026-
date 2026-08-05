let swipeStartX = 0;
let swipeStartY = 0;
let swipePointerId = null;
const swipeSurface = $('#experience');

function swipeBlocked(target){
  return getComputedStyle($('#onboarding')).display !== 'none' ||
    !$('#commentSheet').classList.contains('hidden') ||
    !$('#chatSheet').classList.contains('hidden') ||
    !$('#agentLayer').classList.contains('hidden') ||
    ['INPUT','TEXTAREA','BUTTON'].includes(target.tagName);
}

swipeSurface.addEventListener('pointerdown', event => {
  if(swipeBlocked(event.target)) return;
  swipeStartX = event.clientX;
  swipeStartY = event.clientY;
  swipePointerId = event.pointerId;
  swipeSurface.setPointerCapture(event.pointerId);
});

swipeSurface.addEventListener('pointerup', event => {
  if(event.pointerId !== swipePointerId) return;
  const dx = event.clientX - swipeStartX;
  const dy = event.clientY - swipeStartY;
  swipePointerId = null;
  if(Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
  // 손가락을 왼쪽 영역에서 오른쪽으로 밀면 '좌측 콘텐츠'를 꺼냅니다.
  if(dx > 0) goLeft();
  // 오른쪽 영역에서 왼쪽으로 밀면 '우측 새 인연'을 꺼냅니다.
  else goRight();
});

swipeSurface.addEventListener('pointercancel', () => { swipePointerId = null; });
