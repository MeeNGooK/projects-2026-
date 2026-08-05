let swipeStartX = null;
let swipeStartY = null;
let swiping = false;
const swipeSurface = $('#experience');

function swipeBlocked(target){
  return getComputedStyle($('#onboarding')).display !== 'none' ||
    !$('#commentSheet').classList.contains('hidden') ||
    !$('#chatSheet').classList.contains('hidden') ||
    ['INPUT','TEXTAREA','BUTTON'].includes(target.tagName);
}

swipeSurface.addEventListener('pointerdown', event => {
  if(swipeBlocked(event.target)) return;
  swipeStartX = event.clientX;
  swipeStartY = event.clientY;
  swiping = true;
});

swipeSurface.addEventListener('pointerup', event => {
  if(!swiping || swipeStartX === null) return;
  const dx = event.clientX - swipeStartX;
  const dy = event.clientY - swipeStartY;
  swiping = false;
  swipeStartX = null;
  if(Math.abs(dx) < 65 || Math.abs(dx) < Math.abs(dy)) return;
  if(dx < 0) goLeft();
  else goRight();
});

swipeSurface.addEventListener('pointercancel', () => { swiping = false; swipeStartX = null; });
