const Speech = {

    voices: [],

    russianVoice: null,
    englishVoice: null,


    // ==========================================
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
                [
                    "Milena",
                    "Yuri"
                ],
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

        // First try preferred voices

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


        // Otherwise use any voice
        // with the requested language

        return this.voices.find(
            v =>
                v.lang
                    .toLowerCase()
                    .startsWith(language)
        ) || null;

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


            // ----------------------------------
            // Finish safely
            // ----------------------------------

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


            // ----------------------------------
            // Validate text
            // ----------------------------------

            if (
                typeof text !== "string" ||
                text.trim() === ""
            ) {

                console.warn(
                    "Speech: empty text"
                );

                finish();

                return;

            }


            console.log(
                "Speech:",
                lang,
                text
            );


            // ----------------------------------
            // Stop previous speech
            // ----------------------------------

            try {

                speechSynthesis.cancel();

            }

            catch (error) {

                console.error(
                    "Speech cancel error:",
                    error
                );

            }


            // ----------------------------------
            // Create utterance
            // ----------------------------------

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


            // ----------------------------------
            // START
            // ----------------------------------

            utterance.onstart = () => {

                console.log(
                    "Speech started:",
                    text
                );

            };


            // ----------------------------------
            // END
            // ----------------------------------

            utterance.onend = () => {

                console.log(
                    "Speech ended:",
                    text
                );

                finish();

            };


            // ----------------------------------
            // ERROR
            // ----------------------------------

            utterance.onerror = error => {

                console.error(
                    "Speech error:",
                    error
                );

                finish();

            };


            // ----------------------------------
            // SAFETY TIMEOUT
            //
            // Safari/iPhone sometimes fails
            // to fire onend.
            // ----------------------------------

            const estimatedTime =
                Math.max(
                    5000,
                    text.length * 150
                );


            timeout = setTimeout(() => {

                if (finished) {
                    return;
                }


                console.warn(
                    "Speech timeout. Continuing..."
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


                finish();

            }, estimatedTime);


            // ----------------------------------
            // START SPEAKING
            // ----------------------------------

            setTimeout(() => {

                if (finished) {
                    return;
                }


                try {

                    speechSynthesis.speak(
                        utterance
                    );

                }

                catch (error) {

                    console.error(
                        "Speech speak() error:",
                        error
                    );

                    finish();

                }

            }, 100);

        });

    },


    // ==========================================
    // STOP
    // ==========================================

    stop() {

        console.log(
            "Speech.stop()"
        );


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


// ==============================================
// VOICES CHANGED
// ==============================================

speechSynthesis.onvoiceschanged = () => {

    console.log(
        "voiceschanged"
    );

    Speech.init();

};


// ==============================================
// INITIALIZE
// ==============================================

Speech.init();

setTimeout(() => {

    console.log("=== SPEECH TEST ===");

    const test =
        new SpeechSynthesisUtterance(
            "Приветик. Это тест."
        );

    test.lang = "ru-RU";
    test.rate = 1;

    test.onstart = () => {
        console.log("TEST: START");
    };

    test.onend = () => {
        console.log("TEST: END");
    };

    test.onerror = error => {
        console.log("TEST: ERROR", error);
    };

    console.log(
        "TEST voices:",
        speechSynthesis.getVoices()
    );

    console.log(
        "TEST speaking before:",
        speechSynthesis.speaking
    );

    speechSynthesis.speak(test);

}, 2000);