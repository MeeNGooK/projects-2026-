const meSheet = $('#meSheet');
const meForm = $('#meForm');
function savedProfile(){try{return JSON.parse(localStorage.getItem('sbs-private-profile')||'{}')}catch{return {}}}
function fillProfile(){const data=savedProfile();['intro','area','work','travel'].forEach(key=>{meForm.elements[key].value=data[key]||''})}
$('#meButton').addEventListener('click',()=>{fillProfile();meSheet.classList.remove('hidden')});
$('#closeMe').onclick=()=>meSheet.classList.add('hidden');
meForm.addEventListener('submit',event=>{event.preventDefault();const data=Object.fromEntries(new FormData(meForm).entries());localStorage.setItem('sbs-private-profile',JSON.stringify(data));meSheet.classList.add('hidden');pop('내 정보와 여행 취향을 저장했어요')});
// 첫 가입에서 공개한 항목도 별도로 보관해, 향후 개인 정보 화면과 연결할 수 있게 합니다.
$('#profileForm').addEventListener('submit',()=>{const values=[...$('#inputs').querySelectorAll('input')].map(input=>input.value.trim());if(values.length===3&&values.every(Boolean))localStorage.setItem('sbs-public-profile',JSON.stringify(values))});
