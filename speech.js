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

        this.runDiagnostics();


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
    // VOICE DIAGNOSTICS
    //
    // Temporary diagnostic tool.
    // We use it to find Milena Enhanced.
    // ==========================================

    runDiagnostics() {

        console.log(
            "================================"
        );

        console.log(
            "VOICE DIAGNOSTICS"
        );

        console.log(
            "================================"
        );


        const milenaVoices =
            this.voices.filter(
                voice =>
                    voice.name
                        .toLowerCase()
                        .includes("milena")
            );


        const enhancedVoices =
            this.voices.filter(
                voice =>
                    voice.name
                        .toLowerCase()
                        .includes("enhanced")
            );


        const russianVoices =
            this.getRussianVoices();


        console.log(
            "Milena voices:",
            milenaVoices
        );


        console.log(
            "Enhanced voices:",
            enhancedVoices
        );


        console.log(
            "Russian voices:",
            russianVoices
        );


        // --------------------------------------
        // Print every voice
        // --------------------------------------

        this.voices.forEach(
            (voice, index) => {

                console.log(
                    `[${index}]`,
                    {
                        name:
                            voice.name,

                        lang:
                            voice.lang,

                        voiceURI:
                            voice.voiceURI,

                        localService:
                            voice.localService
                    }
                );

            }
        );


        // --------------------------------------
        // Visible diagnostic panel
        // --------------------------------------

        this.createDiagnosticPanel();

    },


    // ==========================================
    // CREATE DIAGNOSTIC PANEL
    // ==========================================

    createDiagnosticPanel() {

        const setupScreen =
            document.getElementById(
                "setupScreen"
            );


        if (!setupScreen) {

            return;

        }


        let panel =
            document.getElementById(
                "voiceDiagnostics"
            );


        if (!panel) {

            panel =
                document.createElement("div");

            panel.id =
                "voiceDiagnostics";


            const createButton =
                document.getElementById(
                    "createBtn"
                );


            if (createButton) {

                setupScreen.insertBefore(
                    panel,
                    createButton
                );

            }

            else {

                setupScreen.appendChild(
                    panel
                );

            }


            const style =
                document.createElement(
                    "style"
                );


            style.id =
                "voiceDiagnosticsStyle";


            style.textContent = `

                #voiceDiagnostics {

                    margin-top: 20px;

                    margin-bottom: 15px;

                    padding: 18px;

                    border-radius: 18px;

                    background: #151515;

                    color: white;

                    font-size: 14px;

                    line-height: 1.5;

                    text-align: left;

                }


                #voiceDiagnosticsTitle {

                    font-size: 20px;

                    font-weight: bold;

                    margin-bottom: 12px;

                }


                .voiceDiagnosticFound {

                    color: #4cd964;

                    font-weight: bold;

                }


                .voiceDiagnosticNotFound {

                    color: #ff453a;

                    font-weight: bold;

                }


                .voiceDiagnosticSection {

                    margin-top: 12px;

                    font-weight: bold;

                }


                .voiceDiagnosticVoice {

                    padding: 4px 0;

                    color: #cccccc;

                    word-break: break-word;

                }

            `;


            document.head.appendChild(
                style
            );

        }


        const milena =
            this.voices.filter(
                voice =>
                    voice.name
                        .toLowerCase()
                        .includes("milena")
            );


        const milenaEnhanced =
            this.voices.filter(
                voice => {

                    const name =
                        voice.name
                            .toLowerCase();

                    return (
                        name.includes("milena") &&
                        name.includes("enhanced")
                    );

                }
            );


        const russianVoices =
            this.getRussianVoices();


        const statusMilena =
            milena.length > 0;


        const statusEnhanced =
            milenaEnhanced.length > 0;


        panel.innerHTML = `

            <div id="voiceDiagnosticsTitle">
                Voice Diagnostics
            </div>


            <div>
                Milena:
                <span class="${
                    statusMilena
                        ? "voiceDiagnosticFound"
                        : "voiceDiagnosticNotFound"
                }">

                    ${
                        statusMilena
                            ? "FOUND"
                            : "NOT FOUND"
                    }

                </span>
            </div>


            <div>
                Milena (Enhanced):
                <span class="${
                    statusEnhanced
                        ? "voiceDiagnosticFound"
                        : "voiceDiagnosticNotFound"
                }">

                    ${
                        statusEnhanced
                            ? "FOUND"
                            : "NOT FOUND"
                    }

                </span>
            </div>


            <div class="voiceDiagnosticSection">
                Russian voices:
            </div>


            ${
                russianVoices.length
                    ? russianVoices
                        .map(
                            voice => `
                                <div class="voiceDiagnosticVoice">
                                    ${voice.name}
                                    --
                                    ${voice.lang}
                                </div>
                            `
                        )
                        .join("")
                    : `
                        <div class="voiceDiagnosticVoice">
                            No Russian voices found.
                        </div>
                    `
            }


            <div class="voiceDiagnosticSection">
                All voices detected:
                ${this.voices.length}
            </div>

        `;

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


                utterance.lang =
                    lang;


                utterance.rate =
                    Settings.speechRate || 1;


                utterance.pitch =
                    1;


                if (voice) {

                    utterance.voice =
                        voice;

                }


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


// ==========================================
// iOS VOICE LOADING RETRIES
//
// iPhone/Safari sometimes provides voices
// asynchronously.
// ==========================================

setTimeout(
    () => Speech.init(),
    500
);

setTimeout(
    () => Speech.init(),
    1500
);

setTimeout(
    () => Speech.init(),
    3000
);