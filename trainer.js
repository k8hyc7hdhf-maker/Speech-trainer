const Trainer = {

    playing: false,
    paused: false,

    russianText: document.getElementById("ruText"),
    englishText: document.getElementById("enText"),

    async start() {

        if (this.playing) return;

        if (Lesson.count() === 0) return;

        this.playing = true;
        this.paused = false;

        Lesson.restart();

        while (this.playing) {

            await this.waitWhilePaused();

            if (!this.playing) break;

            const sentence = Lesson.current();

            this.showRussian(sentence);

            await Speech.sayRussian(sentence.russian);

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

    },

    pause() {

        this.paused = true;

    },

    resume() {

        this.paused = false;

    },

    next() {

        Lesson.next();

    },

    repeat() {

        // Реализуем позже

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