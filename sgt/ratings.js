let currentRatingTarget = '';
const ratingSheet = $('#ratingSheet');
function addRatingControl(){
  const social = $('.content-social');
  if(!social || social.querySelector('.rate-button')) return;
  const button = document.createElement('button');
  button.className='rate-button'; button.textContent='★ 4.7 평점';
  button.addEventListener('click',()=>{
    currentRatingTarget = $('.content-info h2')?.textContent || $('.comic-caption')?.textContent || '이용권';
    $('#ratingTarget').textContent=currentRatingTarget;
    ratingSheet.classList.remove('hidden');
  });
  social.append(button);
}
new MutationObserver(addRatingControl).observe($('#screen'),{childList:true,subtree:true});
$('#closeRating').onclick=()=>ratingSheet.classList.add('hidden');
$('#ratingStars').onclick=event=>{
  const button=event.target.closest('button'); if(!button) return;
  const score=Number(button.dataset.score);
  [...$('#ratingStars').children].forEach(star=>star.classList.toggle('on',Number(star.dataset.score)<=score));
  $('#ratingMessage').textContent=`${score}점 평가가 등록됐어요. 고마워요!`;
  setTimeout(()=>ratingSheet.classList.add('hidden'),900);
};
addRatingControl();
