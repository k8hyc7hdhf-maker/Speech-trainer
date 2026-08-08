const Trainer = {

    playing: false,
    paused: false,

    russianText: document.getElementById("ruText"),
    englishText: document.getElementById("enText"),

    async start() {

        if (this.playing) {
            this.stop();
        }

        if (Lesson.count() === 0) {
            return;
        }

        this.playing = true;
        this.paused = false;

        Lesson.restart();

        this.updatePauseButton();

        while (this.playing) {

            await this.waitWhilePaused();

            if (!this.playing) break;

            const sentence = Lesson.current();

            this.showRussian(sentence);

            //await Speech.sayRussian(sentence.russian);
            await Speech.sayRussian("Приветик. Это тест.");

            await this.wait(Settings.russianPause);

            if (!this.playing) break;

            await this.waitWhilePaused();

            if (!this.playing) break;

            this.showEnglish(sentence);

            await Speech.sayEnglish(sentence.english);

            await this.wait(Settings.englishPause);

            if (!this.playing) break;

            Lesson.next();

        }

        this.clearScreen();

    },

    stop() {

        this.playing = false;
        this.paused = false;

        Speech.stop();

        this.clearScreen();

        document.getElementById("playerScreen")
            .classList.add("hidden");

        document.getElementById("playerScreen")
            .classList.remove("active");

        document.getElementById("setupScreen")
            .classList.remove("hidden");

        this.updatePauseButton();

    },

    togglePause() {

        this.paused = !this.paused;

        this.updatePauseButton();

    },

    updatePauseButton() {

        const button = document.getElementById("pauseBtn");

        if (!button) return;

        button.textContent = this.paused
            ? "▶ Resume"
            : "⏸ Pause";

    },

    previous() {

        Speech.stop();

        Lesson.previous();

        const sentence = Lesson.current();

        this.showRussian(sentence);

        Speech.sayRussian(sentence.russian);

    },

    showRussian(sentence) {

        this.russianText.textContent = sentence.russian;

        this.englishText.textContent = "";
        this.englishText.style.visibility = "hidden";

    },

    showEnglish(sentence) {

        this.englishText.textContent = sentence.english;

        this.englishText.style.visibility = "visible";

    },

    clearScreen() {

        this.russianText.textContent = "";
        this.englishText.textContent = "";
        this.englishText.style.visibility = "hidden";

    },

    wait(ms) {

        return new Promise(resolve => {

            setTimeout(resolve, ms);

        });

    },

    async waitWhilePaused() {

        while (this.paused && this.playing) {

            await this.wait(100);

        }

    }

};

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("prevBtn")
        .addEventListener("click", () => {

            Trainer.previous();

        });

    document.getElementById("pauseBtn")
        .addEventListener("click", () => {

            Trainer.togglePause();

        });

    document.getElementById("stopBtn")
        .addEventListener("click", () => {

            Trainer.stop();

        });


});