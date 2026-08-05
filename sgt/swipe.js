let swipeStartX = 0;
let swipeStartY = 0;
let swipePointerId = null;
let lastSwipeAt = 0;
const swipeSurface = $('#experience');

function swipeBlocked(target){
  return getComputedStyle($('#onboarding')).display !== 'none' ||
    !$('#commentSheet').classList.contains('hidden') ||
    !$('#chatSheet').classList.contains('hidden') ||
    !$('#agentLayer').classList.contains('hidden') ||
    ['INPUT','TEXTAREA','BUTTON'].includes(target.tagName);
}
function triggerSwipe(dx,dy){
  if(Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy)) return;
  lastSwipeAt = Date.now();
  if(dx > 0) goLeft();
  else goRight();
}

swipeSurface.addEventListener('pointerdown', event => {
  if(swipeBlocked(event.target)) return;
  swipeStartX = event.clientX; swipeStartY = event.clientY; swipePointerId = event.pointerId;
  swipeSurface.setPointerCapture?.(event.pointerId);
});
swipeSurface.addEventListener('pointerup', event => {
  if(event.pointerId !== swipePointerId) return;
  triggerSwipe(event.clientX-swipeStartX,event.clientY-swipeStartY);
  swipePointerId = null;
});
swipeSurface.addEventListener('pointercancel', () => { swipePointerId = null; });

// Pointer Event가 없는 모바일 브라우저를 위한 터치 전용 처리.
swipeSurface.addEventListener('touchstart', event => {
  if(swipeBlocked(event.target) || !event.touches[0]) return;
  swipeStartX = event.touches[0].clientX; swipeStartY = event.touches[0].clientY;
},{passive:true});
swipeSurface.addEventListener('touchend', event => {
  if(Date.now()-lastSwipeAt < 350 || !event.changedTouches[0]) return;
  triggerSwipe(event.changedTouches[0].clientX-swipeStartX,event.changedTouches[0].clientY-swipeStartY);
},{passive:true});
