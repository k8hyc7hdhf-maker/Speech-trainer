const Trainer = {

    playing: false,
    paused: false,

    // ==========================================
    // RUN ID
    //
    // Every new training session gets a new ID.
    // This prevents old async loops from
    // continuing after a new lesson starts.
    // ==========================================

    runId: 0,


    russianText:
        document.getElementById("ruText"),

    englishText:
        document.getElementById("enText"),


    // ==========================================
    // START
    // ==========================================

    async start() {

        // Invalidate any previous Trainer loop

        this.runId++;

        const currentRun =
            this.runId;


        // Stop previous speech

        Speech.stop();


        if (Lesson.count() === 0) {

            return;

        }


        this.playing = true;
        this.paused = false;


        Lesson.restart();


        this.updatePauseButton();


        // ======================================
        // MAIN LOOP
        // ======================================

        while (
            this.playing &&
            this.runId === currentRun
        ) {


            // ----------------------------------
            // PAUSE
            // ----------------------------------

            await this.waitWhilePaused();


            if (
                !this.playing ||
                this.runId !== currentRun
            ) {
                break;
            }


            // ----------------------------------
            // CURRENT SENTENCE
            // ----------------------------------

            const sentence =
                Lesson.current();


            if (!sentence) {
                break;
            }


            // ----------------------------------
            // RUSSIAN
            // ----------------------------------

            this.showRussian(
                sentence
            );


            await Speech.sayRussian(
                sentence.russian
            );


            if (
                !this.playing ||
                this.runId !== currentRun
            ) {
                break;
            }


            // ----------------------------------
            // RUSSIAN PAUSE
            // ----------------------------------

            await this.wait(
                Settings.russianPause
            );


            if (
                !this.playing ||
                this.runId !== currentRun
            ) {
                break;
            }


            // ----------------------------------
            // PAUSE CHECK
            // ----------------------------------

            await this.waitWhilePaused();


            if (
                !this.playing ||
                this.runId !== currentRun
            ) {
                break;
            }


            // ----------------------------------
            // ENGLISH
            // ----------------------------------

            this.showEnglish(
                sentence
            );


            await Speech.sayEnglish(
                sentence.english
            );


            if (
                !this.playing ||
                this.runId !== currentRun
            ) {
                break;
            }


            // ----------------------------------
            // ENGLISH PAUSE
            // ----------------------------------

            await this.wait(
                Settings.englishPause
            );


            if (
                !this.playing ||
                this.runId !== currentRun
            ) {
                break;
            }


            // ----------------------------------
            // NEXT SENTENCE
            // ----------------------------------

            Lesson.next();

        }


        // Only the current Trainer run
        // is allowed to clear the screen.

        if (
            this.runId === currentRun
        ) {

            this.clearScreen();

        }

    },


    // ==========================================
    // STOP
    // ==========================================

    stop() {

        // Invalidate current async loop

        this.runId++;


        this.playing = false;
        this.paused = false;


        Speech.stop();


        this.clearScreen();


        document
            .getElementById("playerScreen")
            .classList.add("hidden");


        document
            .getElementById("playerScreen")
            .classList.remove("active");


        document
            .getElementById("setupScreen")
            .classList.remove("hidden");


        this.updatePauseButton();

    },


    // ==========================================
    // PAUSE
    // ==========================================

    togglePause() {

        this.paused =
            !this.paused;


        this.updatePauseButton();

    },


    updatePauseButton() {

        const button =
            document.getElementById(
                "pauseBtn"
            );


        if (!button) return;


        button.textContent =
            this.paused
                ? "▶ Resume"
                : "⏸ Pause";

    },


    // ==========================================
    // PREVIOUS
    // ==========================================

    async previous() {

        // Stop the current Trainer loop

        this.runId++;

        this.playing = false;
        this.paused = false;


        // Stop current speech

        Speech.stop();


        // Move to previous sentence

        const sentence =
            Lesson.previous();


        if (!sentence) {

            return;

        }


        // Show Russian

        this.showRussian(
            sentence
        );


        // Speak Russian

        await Speech.sayRussian(
            sentence.russian
        );


        // Show English

        this.showEnglish(
            sentence
        );


        // Speak English

        await Speech.sayEnglish(
            sentence.english
        );

    },


    // ==========================================
    // SHOW RUSSIAN
    // ==========================================

    showRussian(sentence) {

        this.russianText.textContent =
            sentence.russian;


        this.englishText.textContent =
            "";


        this.englishText.style.visibility =
            "hidden";

    },


    // ==========================================
    // SHOW ENGLISH
    // ==========================================

    showEnglish(sentence) {

        this.englishText.textContent =
            sentence.english;


        this.englishText.style.visibility =
            "visible";

    },


    // ==========================================
    // CLEAR SCREEN
    // ==========================================

    clearScreen() {

        this.russianText.textContent =
            "";


        this.englishText.textContent =
            "";


        this.englishText.style.visibility =
            "hidden";

    },


    // ==========================================
    // WAIT
    // ==========================================

    wait(ms) {

        return new Promise(
            resolve => {

                setTimeout(
                    resolve,
                    ms
                );

            }
        );

    },


    // ==========================================
    // WAIT WHILE PAUSED
    // ==========================================

    async waitWhilePaused() {

        while (
            this.paused &&
            this.playing
        ) {

            await this.wait(100);

        }

    }

};


// ==========================================
// DOM READY
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {


        document
            .getElementById("prevBtn")
            .addEventListener(
                "click",
                () => {

                    Trainer.previous();

                }
            );


        document
            .getElementById("pauseBtn")
            .addEventListener(
                "click",
                () => {

                    Trainer.togglePause();

                }
            );


        document
            .getElementById("stopBtn")
            .addEventListener(
                "click",
                () => {

                    Trainer.stop();

                }
            );

    }
);