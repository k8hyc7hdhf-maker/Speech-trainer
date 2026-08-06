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

        // Сохраняем настройки
        Settings.russianPause = pauseSeconds * 1000;

        // ==========================================
        // ВРЕМЕННО
        // Здесь позже будет:
        //
        // const lesson = await AI.generate(
        //     topic,
        //     sentenceCount
        // );
        // ==========================================

        const lesson = [

            {
                russian: "Я раньше жил в деревне.",
                english: "I used to live in a village."
            },

            {
                russian: "Я привык вставать рано.",
                english: "I'm used to getting up early."
            },

            {
                russian: "Не откладывай это.",
                english: "Don't put it off."
            }

        ];

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

    document
        .getElementById("createBtn")
        .addEventListener("click", () => {

            App.createTraining();

        });

});