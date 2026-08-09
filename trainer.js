const Trainer = {

    playing: false,
    paused: false,

    // Номер текущего запуска воспроизведения.
    // Помогает не допускать наложения нескольких циклов.
    playbackId: 0,

    russianText: document.getElementById("ruText"),
    englishText: document.getElementById("enText"),


    async start() {

        // Новый запуск воспроизведения
        const id = ++this.playbackId;

        if (this.playing) {
            this.stop();
            return;
        }

        if (Lesson.count() === 0) {
            return;
        }

        this.playing = true;
        this.paused = false;

        // ==========================================
        // MEDIA SESSION
        // ==========================================

        if ("mediaSession" in navigator) {

            navigator.mediaSession.playbackState =
                "playing";

        }

        Lesson.restart();

        this.updatePauseButton();


        while (
            this.playing &&
            id === this.playbackId
        ) {

            await this.waitWhilePaused();

            if (
                !this.playing ||
                id !== this.playbackId
            ) {
                break;
            }


            const sentence =
                Lesson.current();


            // ======================================
            // RUSSIAN
            // ======================================

            this.showRussian(sentence);

            await Speech.sayRussian(
                sentence.russian
            );


            if (
                !this.playing ||
                id !== this.playbackId
            ) {
                break;
            }


            await this.wait(
                Settings.russianPause
            );


            if (
                !this.playing ||
                id !== this.playbackId
            ) {
                break;
            }


            await this.waitWhilePaused();


            if (
                !this.playing ||
                id !== this.playbackId
            ) {
                break;
            }


            // ======================================
            // ENGLISH
            // ======================================

            this.showEnglish(sentence);

            await Speech.sayEnglish(
                sentence.english
            );


            if (
                !this.playing ||
                id !== this.playbackId
            ) {
                break;
            }


            await this.wait(
                Settings.englishPause
            );


            if (
                !this.playing ||
                id !== this.playbackId
            ) {
                break;
            }


            // ======================================
            // NEXT SENTENCE
            // ======================================

            Lesson.next();

        }


        if (id === this.playbackId) {

            this.clearScreen();

        }

    },


    // ==========================================
    // STOP
    // ==========================================

    stop() {

        this.playbackId++;

        this.playing = false;
        this.paused = false;

        // ==========================================
        // MEDIA SESSION
        // ==========================================

        if ("mediaSession" in navigator) {

            navigator.mediaSession.playbackState =
                "none";

        }

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

        this.paused = !this.paused;

        this.updatePauseButton();

        // ==========================================
        // MEDIA SESSION
        // ==========================================

        if ("mediaSession" in navigator) {

            navigator.mediaSession.playbackState =
                this.paused
                    ? "paused"
                    : "playing";

        }


        // ==========================================
        // STOP CURRENT SPEECH WHEN PAUSED
        // ==========================================

        if (this.paused) {

            Speech.stop();

        }

    },


    updatePauseButton() {

        const button =
            document.getElementById("pauseBtn");

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

        if (Lesson.count() === 0) {
            return;
        }


        // Останавливаем старый цикл,
        // чтобы он не мешал Previous.
        this.playbackId++;

        const id = this.playbackId;

        this.playing = false;
        this.paused = false;

        Speech.stop();


        // Переходим к предыдущему предложению
        const sentence =
            Lesson.previous();


        if (!sentence) {
            return;
        }


        // ======================================
        // RUSSIAN
        // ======================================

        this.showRussian(sentence);

        await Speech.sayRussian(
            sentence.russian
        );


        if (id !== this.playbackId) {
            return;
        }


        await this.wait(
            Settings.russianPause
        );


        if (id !== this.playbackId) {
            return;
        }


        // ======================================
        // ENGLISH
        // ======================================

        this.showEnglish(sentence);

        await Speech.sayEnglish(
            sentence.english
        );


        if (id !== this.playbackId) {
            return;
        }


        // ======================================
        // PAUSE AFTER ENGLISH
        // ======================================

        await this.wait(
            Settings.englishPause
        );


        if (id !== this.playbackId) {
            return;
        }


        // ======================================
        // CONTINUE NORMAL CYCLE
        // ======================================

        // Previous sentence уже закончено.
        // Поэтому переходим к следующему.
        Lesson.next();


        this.playing = true;
        this.paused = false;

        // ==========================================
        // MEDIA SESSION
        // ==========================================

        if ("mediaSession" in navigator) {

            navigator.mediaSession.playbackState =
                "playing";

        }

        this.updatePauseButton();


        // Продолжаем с текущего предложения
        await this.continueFromCurrent(id);

    },


    // ==========================================
    // CONTINUE FROM CURRENT SENTENCE
    // ==========================================

    async continueFromCurrent(id) {

        while (
            this.playing &&
            id === this.playbackId
        ) {

            await this.waitWhilePaused();

            if (
                !this.playing ||
                id !== this.playbackId
            ) {
                break;
            }


            const sentence =
                Lesson.current();


            // ======================================
            // RUSSIAN
            // ======================================

            this.showRussian(sentence);

            await Speech.sayRussian(
                sentence.russian
            );


            if (
                !this.playing ||
                id !== this.playbackId
            ) {
                break;
            }


            await this.wait(
                Settings.russianPause
            );


            if (
                !this.playing ||
                id !== this.playbackId
            ) {
                break;
            }


            await this.waitWhilePaused();


            if (
                !this.playing ||
                id !== this.playbackId
            ) {
                break;
            }


            // ======================================
            // ENGLISH
            // ======================================

            this.showEnglish(sentence);

            await Speech.sayEnglish(
                sentence.english
            );


            if (
                !this.playing ||
                id !== this.playbackId
            ) {
                break;
            }


            await this.wait(
                Settings.englishPause
            );


            if (
                !this.playing ||
                id !== this.playbackId
            ) {
                break;
            }


            Lesson.next();

        }

    },


    // ==========================================
    // DISPLAY RUSSIAN
    // ==========================================

    showRussian(sentence) {

        this.russianText.textContent =
            sentence.russian;

        this.englishText.textContent = "";

        this.englishText.style.visibility =
            "hidden";

    },


    // ==========================================
    // DISPLAY ENGLISH
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

        this.russianText.textContent = "";

        this.englishText.textContent = "";

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
// MEDIA SESSION -- STEERING WHEEL CONTROLS
// ==========================================

if ("mediaSession" in navigator) {

    try {

        navigator.mediaSession.setActionHandler(
            "pause",
            () => {

                console.log(
                    "Media Session: PAUSE"
                );

                if (!Trainer.playing) {
                    return;
                }

                Trainer.paused = true;

                Trainer.updatePauseButton();

                navigator.mediaSession.playbackState =
                    "paused";

                Speech.stop();

            }
        );


        navigator.mediaSession.setActionHandler(
            "play",
            () => {

                console.log(
                    "Media Session: PLAY"
                );

                if (!Trainer.playing) {
                    return;
                }

                Trainer.paused = false;

                Trainer.updatePauseButton();

                navigator.mediaSession.playbackState =
                    "playing";

            }
        );


        console.log(
            "Media Session controls registered"
        );

    }

    catch (error) {

        console.error(
            "Media Session error:",
            error
        );

    }

}


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