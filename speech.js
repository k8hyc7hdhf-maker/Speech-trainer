const Speech = {

    voices: [],

    russianVoice: null,
    englishVoice: null,

    init() {

        this.voices = speechSynthesis.getVoices();

        this.selectVoices();

    },



    selectVoices() {

        this.russianVoice = this.findVoice(
            ["Milena", "Yuri"],
            "ru"
        );

        this.englishVoice = this.findVoice(
            ["Samantha", "Daniel", "Ava", "Karen", "Alex"],
            "en"
        );

    },



    findVoice(preferredNames, language) {

        for (const name of preferredNames) {

            const voice = this.voices.find(v => v.name === name);

            if (voice) {

                return voice;

            }

        }

        return this.voices.find(v =>

            v.lang.toLowerCase().startsWith(language)

        ) || null;

    },



    async sayRussian(text) {

        return this.say(

            text,

            this.russianVoice,

            "ru-RU"

        );

    },



    async sayEnglish(text) {

        return this.say(

            text,

            this.englishVoice,

            "en-US"

        );

    },



    say(text, voice, lang) {

        return new Promise(resolve => {

            speechSynthesis.cancel();

            const utterance =
                new SpeechSynthesisUtterance(text);

            utterance.lang = lang;

            utterance.rate = Settings.speechRate;

            if (voice) {

                utterance.voice = voice;

            }

            utterance.onend = () => {

                resolve();

            };

            utterance.onerror = () => {

                resolve();

            };

            speechSynthesis.speak(utterance);

        });

    },



    stop() {

        speechSynthesis.cancel();

    },



    setRate(rate) {

        this.rate = rate;

    }

};



speechSynthesis.onvoiceschanged = () => {

    Speech.init();

};

Speech.init();