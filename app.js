const App = {

    // ==========================================
    // LAST GENERATED LESSON
    //  ==========================================

    lastLesson: null,
    lastTopic: null,
    lastCount: null,


    // ==========================================
    // LOADING UI
    // ==========================================

    showLoading() {

        let loading =
            document.getElementById("aiLoading");

        if (!loading) {

            loading =
                document.createElement("div");

            loading.id = "aiLoading";

            loading.innerHTML = `
                <div class="aiLoadingBox">

                    <div class="aiLoadingTitle">
                        Creating training
                    </div>

                    <div class="aiLoadingDots">
                        <span>●</span>
                        <span>●</span>
                        <span>●</span>
                    </div>

                    <div class="aiLoadingText">
                        Please wait...
                    </div>

                </div>
            `;

            document.body.appendChild(
                loading
            );


            // ==================================
            // LOADING STYLES
            // ==================================

            const style =
                document.createElement("style");

            style.id = "aiLoadingStyle";

            style.textContent = `

                #aiLoading {

                    position: fixed;

                    inset: 0;

                    z-index: 9999;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    background: rgba(0, 0, 0, 0.88);

                    color: white;

                }


                .aiLoadingBox {

                    text-align: center;

                    padding: 35px 30px;

                    border-radius: 24px;

                    background: #252525;

                    min-width: 260px;

                }


                .aiLoadingTitle {

                    font-size: 28px;

                    font-weight: bold;

                    margin-bottom: 25px;

                }


                .aiLoadingDots {

                    font-size: 24px;

                    letter-spacing: 8px;

                    color: #58A6FF;

                    margin-bottom: 20px;

                }


                .aiLoadingDots span {

                    display: inline-block;

                    animation: aiDot 1.4s infinite;

                }


                .aiLoadingDots span:nth-child(2) {

                    animation-delay: 0.2s;

                }


                .aiLoadingDots span:nth-child(3) {

                    animation-delay: 0.4s;

                }


                .aiLoadingText {

                    font-size: 20px;

                    color: #AAAAAA;

                }


                @keyframes aiDot {

                    0%,
                    60%,
                    100% {

                        opacity: 0.25;

                        transform: translateY(0);

                    }

                    30% {

                        opacity: 1;

                        transform: translateY(-6px);

                    }

                }

            `;

            document.head.appendChild(
                style
            );

        }


        loading.classList.remove(
            "hidden"
        );

    },


    hideLoading() {

        const loading =
            document.getElementById(
                "aiLoading"
            );

        if (!loading) return;

        loading.classList.add(
            "hidden"
        );

    },


    // ==========================================
    // CREATE TRAINING
    // ==========================================

    async createTraining() {

        const createButton =
            document.getElementById(
                "createBtn"
            );


        // ======================================
        // PREVENT DOUBLE CLICK
        // ======================================

        if (
            createButton &&
            createButton.disabled
        ) {

            return;

        }


        if (createButton) {

            createButton.disabled = true;

            createButton.dataset.originalText =
                createButton.textContent;

        }


        // ==========================================
        // UNLOCK SPEECH IMMEDIATELY
        //
        // IMPORTANT:
        // This must happen before any await.
        // Important for iPhone.
        // ==========================================

        Speech.unlock();


        // ==========================================
        // TOPIC
        // ==========================================

        const topic =
            document
                .getElementById("topicInput")
                .value
                .trim();


        // ==========================================
        // SENTENCE COUNT
        // ==========================================

        const sentenceCount =
            parseInt(
                document
                    .getElementById("countInput")
                    .value,
                10
            ) || 20;


        // ==========================================
        // PAUSE
        // ==========================================

        const pauseSeconds =
            parseInt(
                document
                    .getElementById("pauseInput")
                    .value,
                10
            ) || 5;


        Settings.russianPause =
            pauseSeconds * 1000;


        // ==========================================
        // REPEAT LAST LESSON
        //
        // If topic and sentence count are exactly
        // the same as the previous request,
        // use the existing lesson.
        //
        // No AI request.
        // ==========================================

        const sameRequest =
            this.lastLesson &&
            this.lastTopic === topic &&
            this.lastCount === sentenceCount;


        if (sameRequest) {

            console.log(
                "Repeating previous lesson. No AI request."
            );


            // Make a fresh copy so Trainer/Lesson
            // cannot accidentally modify our
            // saved lesson.

            const lesson =
                this.lastLesson.map(
                    sentence => ({
                        russian:
                            sentence.russian,

                        english:
                            sentence.english
                    })
                );


            Lesson.load(
                lesson
            );


            // ======================================
            // SHOW PLAYER
            // ======================================

            document
                .getElementById("setupScreen")
                .classList.add("hidden");


            const playerScreen =
                document.getElementById(
                    "playerScreen"
                );


            playerScreen.classList.remove(
                "hidden"
            );


            playerScreen.classList.add(
                "active"
            );


            // ======================================
            // START TRAINER
            // ======================================

            Trainer.start();


            // ======================================
            // ENABLE BUTTON AGAIN
            // ======================================

            if (createButton) {

                createButton.disabled = false;

                if (
                    createButton.dataset.originalText
                ) {

                    createButton.textContent =
                        createButton.dataset.originalText;

                }

            }


            return;

        }


        // ==========================================
        // GENERATE LESSON
        // ==========================================

        this.showLoading();


        try {

            console.log(
                "Starting AI generation..."
            );


            const lesson =
                await AI.generate(
                    topic,
                    sentenceCount
                );


            console.log(
                "Lesson received:",
                lesson
            );


            if (
                !Array.isArray(lesson) ||
                lesson.length === 0
            ) {

                throw new Error(
                    "AI returned an empty lesson."
                );

            }


            // ======================================
            // SAVE LAST GENERATED LESSON
            // ======================================

            this.lastLesson =
                lesson.map(
                    sentence => ({
                        russian:
                            sentence.russian,

                        english:
                            sentence.english
                    })
                );


            this.lastTopic =
                topic;


            this.lastCount =
                sentenceCount;


            console.log(
                "Lesson saved for repetition."
            );


            // ======================================
            // LOAD LESSON
            // ======================================

            Lesson.load(
                lesson
            );


            // ======================================
            // HIDE SETUP
            // ======================================

            document
                .getElementById("setupScreen")
                .classList.add("hidden");


            const playerScreen =
                document.getElementById(
                    "playerScreen"
                );


            playerScreen.classList.remove(
                "hidden"
            );


            playerScreen.classList.add(
                "active"
            );


            // ======================================
            // START TRAINER
            // ======================================

            Trainer.start();

        }


        catch (error) {

            console.error(
                "Could not create training:",
                error
            );


            // ======================================
            // REAL ERROR
            //
            // We KEEP this alert.
            //
            // This is important for errors such as:
            //
            // unsupported_country_region_territory
            // OpenAI API error
            // network errors
            // etc.
            // ======================================

            alert(
                "Could not create training.\n\n" +
                error.message
            );

        }


        finally {

            // ======================================
            // HIDE LOADING
            // ======================================

            this.hideLoading();


            // ======================================
            // ENABLE BUTTON AGAIN
            // ======================================

            if (createButton) {

                createButton.disabled = false;

                if (
                    createButton.dataset.originalText
                ) {

                    createButton.textContent =
                        createButton.dataset.originalText;

                }

            }

        }

    }

};


// ==========================================
// DOM READY
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        // ======================================
        // CREATE TRAINING
        // ======================================

        document
            .getElementById("createBtn")
            .addEventListener(
                "click",
                () => {

                    App.createTraining();

                }
            );

    }
);