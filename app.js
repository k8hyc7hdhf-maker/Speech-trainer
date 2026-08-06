const lesson = [

{

ru:"Я раньше жил в деревне.",

en:"I used to live in a village."

},

{

ru:"Я привык вставать рано.",

en:"I'm used to getting up early."

},

{

ru:"Не откладывай это на завтра.",

en:"Don't put it off until tomorrow."

}

];



const setupScreen=document.getElementById("setupScreen");

const playerScreen=document.getElementById("playerScreen");

const createBtn=document.getElementById("createBtn");

const ruText=document.getElementById("ruText");

const enText=document.getElementById("enText");



let index=0;



createBtn.onclick=()=>{

setupScreen.classList.add("hidden");

playerScreen.classList.remove("hidden");

playerScreen.classList.add("active");

startPlayer();

};



function startPlayer(){

showSentence();

}



function showSentence(){

const item=lesson[index];

ruText.textContent=item.ru;

enText.textContent=item.en;

enText.style.visibility="hidden";

setTimeout(()=>{

enText.style.visibility="visible";

},5000);

setTimeout(()=>{

index++;

if(index>=lesson.length){

index=0;

}

showSentence();

},7000);

}