const App = {

    async createTraining() {

        alert("createTraining()");

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

        // Сохраняем паузу
        Settings.russianPause =
            pauseSeconds * 1000;

        console.log("================================");
        console.log("Creating training");
        console.log("Topic:", topic);
        console.log("Sentences:", sentenceCount);
        console.log("Pause:", pauseSeconds);
        console.log("================================");

        try {

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

        catch (error) {

            console.error(
                "Training error:",
                error
            );

            alert(
                "Could not create training.\n\n" +
                error.message
            );

        }

    }

};


document.addEventListener(
    "DOMContentLoaded",
    () => {

        // ------------------------------------------
        // Create Training
        // ------------------------------------------

        document
            .getElementById("createBtn")
            .addEventListener(
                "click",
                () => {

                    App.createTraining();

                }
            );

    }
);