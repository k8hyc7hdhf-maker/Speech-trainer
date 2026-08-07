const App = {

    async createTraining() {

        const topic = document
            .getElementById("topicInput")
            .value
            .trim();

        const sentenceCount = parseInt(
            document.getElementById("countInput").value,
            10
        ) || 20;

        const pauseSeconds = parseInt(
            document.getElementById("pauseInput").value,
            10
        ) || 5;

        Settings.russianPause = pauseSeconds * 1000;

        // API Key

        const apiKey = document
            .getElementById("apiKeyInput")
            .value
            .trim();

        localStorage.setItem(
            "openaiApiKey",
            apiKey
        );
        
        console.log(
    "Saved:",
    localStorage.getItem("openaiApiKey")
);

        const lesson = await AI.generate(

            topic,

            sentenceCount

        );

        Lesson.load(lesson);

        document
            .getElementById("setupScreen")
            .classList.add("hidden");

        const playerScreen =
            document.getElementById("playerScreen");

        playerScreen.classList.remove("hidden");
        playerScreen.classList.add("active");

        Trainer.start();

    }

};

document.addEventListener("DOMContentLoaded", () => {

    // Загружаем API Key

    const savedKey =
    localStorage.getItem("openaiApiKey");

console.log("Loaded:", savedKey);

document.getElementById("apiKeyInput").value =
    savedKey || "";

    // Create Training

    document
        .getElementById("createBtn")
        .addEventListener("click", () => {

            App.createTraining();

        });

    // Показать / скрыть API Key

    const input =
        document.getElementById("apiKeyInput");

    const button =
        document.getElementById("toggleApiKey");

    button.addEventListener("click", () => {

        if (input.type === "password") {

            input.type = "text";
            button.textContent = "🙈";

        } else {

            input.type = "password";
            button.textContent = "👁️";

        }

    });

});