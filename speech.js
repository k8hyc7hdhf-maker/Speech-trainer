const Speech = {

    voices: [],

    russianVoice: null,
    englishVoice: null,

    unlocked: false,


    // ==========================================
    // STORAGE KEYS
    // ==========================================

    RUSSIAN_VOICE_KEY:
        "speechTrainerRussianVoice",

    ENGLISH_VOICE_KEY:
        "speechTrainerEnglishVoice",


    // ==========================================
    // INIT
    // ==========================================

    init() {

        this.voices =
            speechSynthesis.getVoices();

        console.log(
            "Speech voices:",
            this.voices.length
        );


        this.selectSavedVoices();

        this.createVoiceSelectors();


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
    // SELECT SAVED VOICES
    // ==========================================

    selectSavedVoices() {

        const savedRussian =
            localStorage.getItem(
                this.RUSSIAN_VOICE_KEY
            );

        const savedEnglish =
            localStorage.getItem(
                this.ENGLISH_VOICE_KEY
            );


        // --------------------------------------
        // RUSSIAN
        // --------------------------------------

        if (savedRussian) {

            this.russianVoice =
                this.voices.find(
                    voice =>
                        this.getVoiceId(voice) ===
                        savedRussian
                );

        }


        // --------------------------------------
        // ENGLISH
        // --------------------------------------

        if (savedEnglish) {

            this.englishVoice =
                this.voices.find(
                    voice =>
                        this.getVoiceId(voice) ===
                        savedEnglish
                );

        }


        // --------------------------------------
        // FALLBACK
        // --------------------------------------

        if (!this.russianVoice) {

            this.russianVoice =
                this.findVoice(
                    [
                        "Milena",
                        "Yuri",
                        "Elena"
                    ],
                    "ru"
                );

        }


        if (!this.englishVoice) {

            this.englishVoice =
                this.findVoice(
                    [
                        "Samantha",
                        "Ava",
                        "Daniel",
                        "Karen",
                        "Alex"
                    ],
                    "en"
                );

        }

    },


    // ==========================================
    // FIND VOICE
    // ==========================================

    findVoice(
        preferredNames,
        language
    ) {

        // --------------------------------------
        // First: preferred names
        // --------------------------------------

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


        // --------------------------------------
        // Second: language
        // --------------------------------------

        return this.voices.find(
            v =>
                v.lang
                    .toLowerCase()
                    .startsWith(language)
        ) || null;

    },


    // ==========================================
    // VOICE ID
    // ==========================================

    getVoiceId(voice) {

        if (!voice) {

            return "";

        }

        return (
            voice.voiceURI ||
            voice.name + "|" + voice.lang
        );

    },


    // ==========================================
    // GET RUSSIAN VOICES
    // ==========================================

    getRussianVoices() {

        return this.voices
            .filter(
                voice =>
                    voice.lang
                        .toLowerCase()
                        .startsWith("ru")
            )
            .sort(
                (a, b) =>
                    a.name.localeCompare(
                        b.name
                    )
            );

    },


    // ==========================================
    // GET ENGLISH VOICES
    // ==========================================

    getEnglishVoices() {

        return this.voices
            .filter(
                voice =>
                    voice.lang
                        .toLowerCase()
                        .startsWith("en")
            )
            .sort(
                (a, b) =>
                    a.name.localeCompare(
                        b.name
                    )
            );

    },


    // ==========================================
    // CREATE VOICE SELECTORS
    // ==========================================

    createVoiceSelectors() {

        const setupScreen =
            document.getElementById(
                "setupScreen"
            );


        if (!setupScreen) {

            return;

        }


        let container =
            document.getElementById(
                "voiceSettings"
            );


        // --------------------------------------
        // Create container once
        // --------------------------------------

        if (!container) {

            container =
                document.createElement("div");

            container.id =
                "voiceSettings";

            container.innerHTML = `

                <div class="voiceSettingsTitle">
                    Voice settings
                </div>

                <label
                    for="russianVoiceSelect"
                >
                    Russian voice
                </label>

                <select
                    id="russianVoiceSelect"
                ></select>

                <label
                    for="englishVoiceSelect"
                >
                    English voice
                </label>

                <select
                    id="englishVoiceSelect"
                ></select>

            `;


            // Put voice settings
            // before Create Training button

            const createButton =
                document.getElementById(
                    "createBtn"
                );


            if (createButton) {

                setupScreen.insertBefore(
                    container,
                    createButton
                );

            }

            else {

                setupScreen.appendChild(
                    container
                );

            }


            // ----------------------------------
            // Basic styles
            // ----------------------------------

            const style =
                document.createElement(
                    "style"
                );

            style.id =
                "speechVoiceSettingsStyle";

            style.textContent = `

                #voiceSettings {

                    margin-top: 25px;
                    margin-bottom: 10px;

                    padding: 20px;

                    border-radius: 20px;

                    background: #1d1d1d;

                }


                .voiceSettingsTitle {

                    font-size: 24px;

                    font-weight: bold;

                    margin-bottom: 15px;

                }


                #voiceSettings label {

                    font-size: 20px;

                    margin-top: 15px;

                    margin-bottom: 8px;

                }


                #voiceSettings select {

                    width: 100%;

                    box-sizing: border-box;

                    padding: 14px;

                    font-size: 18px;

                    border: none;

                    border-radius: 14px;

                    background: #252525;

                    color: white;

                }

            `;

            document.head.appendChild(
                style
            );


            // ----------------------------------
            // Change events
            // ----------------------------------

            document
                .getElementById(
                    "russianVoiceSelect"
                )
                .addEventListener(
                    "change",
                    event => {

                        this.setRussianVoice(
                            event.target.value
                        );

                    }
                );


            document
                .getElementById(
                    "englishVoiceSelect"
                )
                .addEventListener(
                    "change",
                    event => {

                        this.setEnglishVoice(
                            event.target.value
                        );

                    }
                );

        }


        this.updateVoiceSelectors();

    },


    // ==========================================
    // UPDATE SELECTORS
    // ==========================================

    updateVoiceSelectors() {

        const russianSelect =
            document.getElementById(
                "russianVoiceSelect"
            );

        const englishSelect =
            document.getElementById(
                "englishVoiceSelect"
            );


        if (
            !russianSelect ||
            !englishSelect
        ) {

            return;

        }


        // --------------------------------------
        // Russian voices
        // --------------------------------------

        russianSelect.innerHTML = "";


        const russianVoices =
            this.getRussianVoices();


        russianVoices.forEach(
            voice => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    this.getVoiceId(voice);

                option.textContent =
                    voice.name +
                    " -- " +
                    voice.lang;


                russianSelect.appendChild(
                    option
                );

            }
        );


        // --------------------------------------
        // English voices
        // --------------------------------------

        englishSelect.innerHTML = "";


        const englishVoices =
            this.getEnglishVoices();


        englishVoices.forEach(
            voice => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    this.getVoiceId(voice);

                option.textContent =
                    voice.name +
                    " -- " +
                    voice.lang;


                englishSelect.appendChild(
                    option
                );

            }
        );


        // --------------------------------------
        // Select current voices
        // --------------------------------------

        if (this.russianVoice) {

            russianSelect.value =
                this.getVoiceId(
                    this.russianVoice
                );

        }


        if (this.englishVoice) {

            englishSelect.value =
                this.getVoiceId(
                    this.englishVoice
                );

        }

    },


    // ==========================================
    // SET RUSSIAN VOICE
    // ==========================================

    setRussianVoice(id) {

        const voice =
            this.voices.find(
                v =>
                    this.getVoiceId(v) === id
            );


        if (!voice) {

            return;

        }


        this.russianVoice =
            voice;


        localStorage.setItem(
            this.RUSSIAN_VOICE_KEY,
            id
        );


        console.log(
            "Russian voice selected:",
            voice.name,
            voice.lang
        );

    },


    // ==========================================
    // SET ENGLISH VOICE
    // ==========================================

    setEnglishVoice(id) {

        const voice =
            this.voices.find(
                v =>
                    this.getVoiceId(v) === id
            );


        if (!voice) {

            return;

        }


        this.englishVoice =
            voice;


        localStorage.setItem(
            this.ENGLISH_VOICE_KEY,
            id
        );


        console.log(
            "English voice selected:",
            voice.name,
            voice.lang
        );

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
                new SpeechSynthesisUtterance(
                    ""
                );


            utterance.volume = 0;

            utterance.lang =
                "en-US";


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

        return new Promise(
            resolve => {

                let finished = false;

                let timeout = null;


                const finish = () => {

                    if (finished) {

                        return;

                    }


                    finished = true;


                    if (timeout) {

                        clearTimeout(
                            timeout
                        );

                    }


                    resolve();

                };


                // --------------------------------
                // Invalid text
                // --------------------------------

                if (
                    typeof text !==
                        "string" ||

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


                // --------------------------------
                // Cancel previous speech
                // --------------------------------

                try {

                    speechSynthesis.cancel();

                }

                catch (error) {

                    console.error(
                        "Speech cancel error:",
                        error
                    );

                }


                // --------------------------------
                // Create utterance
                // --------------------------------

                const utterance =
                    new SpeechSynthesisUtterance(
                        text
                    );


                utterance.lang =
                    lang;


                utterance.rate =
                    Settings.speechRate || 1;


                utterance.pitch =
                    1;


                // --------------------------------
                // Set voice
                // --------------------------------

                if (voice) {

                    utterance.voice =
                        voice;

                }


                // --------------------------------
                // Events
                // --------------------------------

                utterance.onstart =
                    () => {

                        console.log(
                            "Speech started:",
                            text
                        );

                    };


                utterance.onend =
                    () => {

                        console.log(
                            "Speech ended"
                        );

                        finish();

                    };


                utterance.onerror =
                    error => {

                        console.error(
                            "Speech error:",
                            error
                        );

                        finish();

                    };


                // --------------------------------
                // Safety timeout
                // --------------------------------

                timeout =
                    setTimeout(
                        () => {

                            console.warn(
                                "Speech timeout"
                            );


                            try {

                                speechSynthesis.cancel();

                            }

                            catch (error) {}


                            finish();

                        },

                        Math.max(
                            6000,
                            text.length * 180
                        )
                    );


                // --------------------------------
                // Speak
                // --------------------------------

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

            }
        );

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

        Settings.speechRate =
            rate;

    }

};


// ==========================================
// VOICES CHANGED
// ==========================================

speechSynthesis.onvoiceschanged =
    () => {

        Speech.init();

    };


// ==========================================
// INITIALIZE
// ==========================================

Speech.init();