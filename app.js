const App = {

    async createTraining() {

        // Временно используем тестовый урок.
        // Позже здесь будет:
        // const lesson = await AI.generate(...);

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

        document.getElementById("setupScreen").classList.add("hidden");
        document.getElementById("playerScreen").classList.remove("hidden");

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