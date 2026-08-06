const createBtn = document.getElementById("createBtn");

const setupScreen = document.getElementById("setupScreen");
const playerScreen = document.getElementById("playerScreen");

createBtn.onclick = () => {

    setupScreen.classList.add("hidden");

    playerScreen.classList.remove("hidden");

};