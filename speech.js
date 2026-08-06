const Speech = {

    russianVoice: null,
    englishVoice: null,

    init() {

        const voices = speechSynthesis.getVoices();

        this.russianVoice =
            voices.find(v => v.lang.startsWith("ru"));

        this.englishVoice =
            voices.find(v => v.lang.startsWith("en"));

    },

    sayRussian(text) {

        speechSynthesis.cancel();

        const u = new SpeechSynthesisUtterance(text);

        u.lang = "ru-RU";

        if (this.russianVoice)
            u.voice = this.russianVoice;

        u.rate = 0.95;

        speechSynthesis.speak(u);

    },

    sayEnglish(text) {

        speechSynthesis.cancel();

        const u = new SpeechSynthesisUtterance(text);

        u.lang = "en-US";

        if (this.englishVoice)
            u.voice = this.englishVoice;

        u.rate = 0.9;

        speechSynthesis.speak(u);

    }

};

speechSynthesis.onvoiceschanged = () => {

    Speech.init();

};

Speech.init();