const Speech = {

    voices: [],

    russianVoice: null,
    englishVoice: null,

    unlocked: false,

    //  ==========================================
    // INIT
    // ==========================================

    init() {

        this.voices =
            speechSynthesis.getVoices();

        this.selectVoices();

        console.log(
            "Speech voices:",
            this.voices.length
        );

        console.log(
            "Russian voice:",
            this.russianVoice
                ? this.russianVoice.name
                : "not found"
        );

        console.log(
            "English voice:",
            this.englishVoice
                ? this.englishVoice.name
                : "not found"
        );

    },


    // ==========================================
    // SELECT VOICES
    // ==========================================

    selectVoices() {

        this.russianVoice =
            this.findVoice(
                ["Milena", "Yuri"],
                "ru"
            );

        this.englishVoice =
            this.findVoice(
                [
                    "Samantha",
                    "Daniel",
                    "Ava",
                    "Karen",
                    "Alex"
                ],
                "en"
            );

    },


    // ==========================================
    // FIND VOICE
    // ==========================================

    findVoice(
        preferredNames,
        language
    ) {

        for (
            const name of preferredNames
        ) {

            const voice =
                this.voices.find(
                    v =>
                        v.name
                            .toLowerCase()
                            .includes(
                                name.toLowerCase()
                            )
                );

            if (voice) {
                return voice;
            }

        }

        return this.voices.find(
            v =>
                v.lang
                    .toLowerCase()
                    .startsWith(language)
        ) || null;

    },


    // ==========================================
    // UNLOCK
    //
    // Called directly from Create Training
    // ==========================================

    unlock() {

        console.log(
            "Speech unlock"
        );

        try {

            speechSynthesis.cancel();

            const utterance =
                new SpeechSynthesisUtterance("");

            utterance.volume = 0;

            utterance.lang = "en-US";

            speechSynthesis.speak(
                utterance
            );

            this.unlocked = true;

            console.log(
                "Speech unlocked"
            );

        }

        catch (error) {

            console.error(
                "Speech unlock error:",
                error
            );

        }

    },


    // ==========================================
    // RUSSIAN
    // ==========================================

    async sayRussian(text) {

        return this.say(
            text,
            this.russianVoice,
            "ru-RU"
        );

    },


    // ==========================================
    // ENGLISH
    // ==========================================

    async sayEnglish(text) {

        return this.say(
            text,
            this.englishVoice,
            "en-US"
        );

    },


    // ==========================================
    // SAY
    // ==========================================

    say(
        text,
        voice,
        lang
    ) {

        return new Promise(resolve => {

            let finished = false;

            let timeout = null;


            const finish = () => {

                if (finished) {
                    return;
                }

                finished = true;

                if (timeout) {
                    clearTimeout(timeout);
                }

                resolve();

            };


            if (
                typeof text !== "string" ||
                text.trim() === ""
            ) {

                finish();

                return;

            }


            console.log(
                "Speech:",
                lang,
                text
            );


            try {

                speechSynthesis.cancel();

            }

            catch (error) {

                console.error(
                    "Speech cancel error:",
                    error
                );

            }


            const utterance =
                new SpeechSynthesisUtterance(
                    text
                );


            utterance.lang = lang;

            utterance.rate =
                Settings.speechRate || 1;

            utterance.pitch = 1;


            if (voice) {

                utterance.voice = voice;

            }


            utterance.onstart = () => {

                console.log(
                    "Speech started:",
                    text
                );

            };


            utterance.onend = () => {

                console.log(
                    "Speech ended"
                );

                finish();

            };


            utterance.onerror = error => {

                console.error(
                    "Speech error:",
                    error
                );

                finish();

            };


            // Safety timeout

            timeout = setTimeout(() => {

                console.warn(
                    "Speech timeout"
                );

                try {

                    speechSynthesis.cancel();

                }

                catch (error) {}

                finish();

            }, Math.max(
                6000,
                text.length * 180
            ));


            try {

                speechSynthesis.speak(
                    utterance
                );

            }

            catch (error) {

                console.error(
                    "Speech speak error:",
                    error
                );

                finish();

            }

        });

    },


    // ==========================================
    // STOP
    // ==========================================

    stop() {

        try {

            speechSynthesis.cancel();

        }

        catch (error) {

            console.error(
                "Speech stop error:",
                error
            );

        }

    },


    // ==========================================
    // RATE
    // ==========================================

    setRate(rate) {

        Settings.speechRate = rate;

    }

};


// ==========================================
// VOICES CHANGED
// ==========================================

speechSynthesis.onvoiceschanged = () => {

    Speech.init();

};


// ==========================================
// INITIALIZE
// ==========================================

Speech.init();