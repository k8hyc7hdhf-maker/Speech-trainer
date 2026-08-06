const lesson = [
    {
        ru: "Я раньше жил в деревне.",
        en: "I used to live in a village."
    },
    {
        ru: "Я привык вставать рано.",
        en: "I'm used to getting up early."
    },
    {
        ru: "Не откладывай это на завтра.",
        en: "Don't put it off until tomorrow."
    }
];

const setupScreen = document.getElementById("setupScreen");
const playerScreen = document.getElementById("playerScreen");
const createBtn = document.getElementById("createBtn");

createBtn.onclick = () => {

    setupScreen.classList.add("hidden");

    playerScreen.classList.remove("hidden");
    playerScreen.classList.add("active");

    Player.start(lesson);

};