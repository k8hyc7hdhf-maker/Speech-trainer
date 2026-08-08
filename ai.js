const AI = {

    // ==========================================
    // MODE
    //
    // true  = тестовые данные
    // false = Cloudflare Worker → OpenAI
    // ==========================================

    USE_TEST_DATA: false,

    // ==========================================
    // Cloudflare Worker
    // ==========================================

    WORKER_URL:
        "https://speech-trainer-api.5h5ztzff24.workers.dev/",

    // ==========================================
    // OpenAI model
    // ==========================================

    MODEL: "gpt-5-mini",

    TEMPERATURE: 0.8,


    // ==========================================
    // MAIN
    // ==========================================

    async generate(topic, count) {

        alert("AI.generate()");

        console.log("================================");
        console.log("Speech Trainer AI");
        console.log("Topic:", topic);
        console.log("Sentences:", count);
        console.log("TEST DATA:", this.USE_TEST_DATA);
        console.log("================================");


        // ------------------------------------------
        // TEST MODE
        // ------------------------------------------

        if (this.USE_TEST_DATA) {

            console.log(
                "Using test lesson."
            );

            return this.generateTestLesson(
                count
            );

        }


        // ------------------------------------------
        // OPENAI MODE
        // ------------------------------------------

        try {

            alert(
                "Calling Cloudflare Worker..."
            );

            return await this.generateOpenAI(
                topic,
                count
            );

        }

        catch (error) {

            console.error(
                "AI error:",
                error
            );

            alert(
                "AI error.\n\n" +
                error.message
            );

            throw error;

        }

    },


    // ==========================================
    // TEST MODE
    // ==========================================

    generateTestLesson(count) {

        const lesson = [

            {
                russian:
                    "Я раньше жил в деревне.",

                english:
                    "I used to live in a village."
            },

            {
                russian:
                    "Я привык вставать рано.",

                english:
                    "I'm used to getting up early."
            },

            {
                russian:
                    "Не откладывай это.",

                english:
                    "Don't put it off."
            },

            {
                russian:
                    "Мне нужно к этому привыкнуть.",

                english:
                    "I need to get used to it."
            },

            {
                russian:
                    "Она раньше много путешествовала.",

                english:
                    "She used to travel a lot."
            }

        ];


        const result = [];


        while (result.length < count) {

            for (const sentence of lesson) {

                if (
                    result.length >= count
                ) {
                    break;
                }

                result.push({
                    russian:
                        sentence.russian,

                    english:
                        sentence.english
                });

            }

        }


        return result;

    },


    // ==========================================
    // CLOUDFLARE WORKER → OPENAI
    // ==========================================

    async generateOpenAI(
        topic,
        count
    ) {

        alert(
            "generateOpenAI()"
        );


        const prompt =
            this.buildPrompt(
                topic,
                count
            );


        console.log(
            "Sending prompt to Worker..."
        );


        const response =
            await fetch(
                this.WORKER_URL,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        text: prompt

                    })

                }
            );


        console.log(
            "Worker status:",
            response.status
        );


        // ------------------------------------------
        // Read response
        // ------------------------------------------

        const data =
            await response.json();


        console.log(
            "Worker response:",
            data
        );


        // ------------------------------------------
        // Worker error
        // ------------------------------------------

        if (!response.ok) {

            throw new Error(

                data.error ||

                "Cloudflare Worker error."

            );

        }


        // ------------------------------------------
        // Get AI text
        // ------------------------------------------

        const text =
            data.reply ||
            data.output_text ||
            data.text;


        if (!text) {

            throw new Error(
                "AI returned an empty response."
            );

        }


        console.log(
            "AI response:",
            text
        );


        // ------------------------------------------
        // Parse JSON
        // ------------------------------------------

        return this.parseLesson(
            text,
            count
        );

    },


    // ==========================================
    // PARSE AI RESPONSE
    // ==========================================

    parseLesson(
        text,
        count
    ) {

        let cleanText =
            text.trim();


        // Remove markdown code fences
        cleanText =
            cleanText
                .replace(
                    /^```json\s*/i,
                    ""
                )
                .replace(
                    /^```\s*/i,
                    ""
                )
                .replace(
                    /\s*```$/i,
                    ""
                )
                .trim();


        let lesson;


        try {

            lesson =
                JSON.parse(
                    cleanText
                );

        }

        catch (error) {

            console.error(
                "JSON parse error:",
                error
            );

            console.error(
                "AI returned:",
                text
            );

            throw new Error(
                "AI returned invalid lesson data."
            );

        }


        if (
            !Array.isArray(lesson)
        ) {

            throw new Error(
                "AI lesson is not an array."
            );

        }


        // ------------------------------------------
        // Validate sentences
        // ------------------------------------------

        const validLesson =
            lesson.filter(
                item =>

                    item &&

                    typeof item.russian ===
                        "string" &&

                    typeof item.english ===
                        "string"
            );


        if (
            validLesson.length === 0
        ) {

            throw new Error(
                "AI returned no valid sentences."
            );

        }


        console.log(
            "Valid sentences:",
            validLesson.length
        );


        return validLesson;

    },


    // ==========================================
    // PROMPT
    // ==========================================

    buildPrompt(
        topic,
        count
    ) {

        return `

Create ${count} English learning sentences.

The student wants to practice this topic:

${topic}

Requirements:

1. Create exactly ${count} sentences.
2. The Russian sentence should be a natural translation/prompt.
3. The English sentence should sound natural in everyday conversational English.
4. Focus specifically on the requested topic.
5. Use different situations and vocabulary.
6. Keep sentences suitable for English speaking practice.

Return ONLY valid JSON.

Format:

[
  {
    "russian": "...",
    "english": "..."
  }
]

No markdown.
No explanations.
No comments.
No text outside the JSON.

`;

    }

};