const App = {

    async createTraining() {

        alert("Create training()");


        // ==========================================
        // UNLOCK SPEECH IMMEDIATELY
        //
        // This must happen before any await.
        // Important for iPhone.
        // ==========================================

        Speech.unlock();


        // ==========================================
        // TOPIC
        // ==========================================

        const topic =
            document
                .getElementById("topicInput")
                .value
                .trim();


        // ==========================================
        // SENTENCE COUNT
        // ==========================================

        const sentenceCount =
            parseInt(
                document
                    .getElementById("countInput")
                    .value,
                10
            ) || 20;


        // ==========================================
        // PAUSE
        // ==========================================

        const pauseSeconds =
            parseInt(
                document
                    .getElementById("pauseInput")
                    .value,
                10
            ) || 5;


        Settings.russianPause =
            pauseSeconds * 1000;


        // ==========================================
        // GENERATE LESSON
        // ==========================================

        try {

            console.log(
                "Starting AI generation..."
            );


            const lesson =
                await AI.generate(
                    topic,
                    sentenceCount
                );


            console.log(
                "Lesson received:",
                lesson
            );


            if (
                !Array.isArray(lesson) ||
                lesson.length === 0
            ) {

                throw new Error(
                    "AI returned an empty lesson."
                );

            }


            // ======================================
            // LOAD LESSON
            // ======================================

            Lesson.load(
                lesson
            );


            // ======================================
            // SHOW PLAYER
            // ======================================

            document
                .getElementById("setupScreen")
                .classList.add("hidden");


            const playerScreen =
                document.getElementById(
                    "playerScreen"
                );


            playerScreen.classList.remove(
                "hidden"
            );


            playerScreen.classList.add(
                "active"
            );


            // ======================================
            // START TRAINER
            // ======================================

            Trainer.start();

        }


        catch (error) {

            console.error(
                "Could not create training:",
                error
            );


            alert(
                "Could not create training.\n\n" +
                error.message
            );

        }

    }

};


// ==========================================
// DOM READY
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {


        // ======================================
        // CREATE TRAINING
        // ======================================

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