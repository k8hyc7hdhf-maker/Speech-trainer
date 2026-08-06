const Player = {

    lesson: [],
    index: 0,

    ruText: document.getElementById("ruText"),
    enText: document.getElementById("enText"),

    start(lesson) {

        this.lesson = lesson;
        this.index = 0;

        this.show();

    },

    show() {

        const item = this.lesson[this.index];

        this.ruText.textContent = item.ru;

        this.enText.style.visibility = "hidden";
        this.enText.textContent = "";

        Speech.sayRussian(item.ru);

        setTimeout(() => {

            this.enText.textContent = item.en;
            this.enText.style.visibility = "visible";

            Speech.sayEnglish(item.en);

        }, 5000);

        setTimeout(() => {

            this.next();

        }, 7000);

    },

    next() {

        this.index++;

        if (this.index >= this.lesson.length) {

            this.index = 0;

        }

        this.show();

    }

};