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

    document
        .getElementById("createBtn")
        .addEventListener("click", () => {

            App.createTraining();

        });

});