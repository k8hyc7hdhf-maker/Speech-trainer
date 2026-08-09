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

            console.error(
                "Worker error:",
                data
            );

            const details =
                data.details
                    ? JSON.stringify(
                        data.details,
                        null,
                        2
                    )
                    : "";

            throw new Error(
                (data.error || "Worker error") +
                "\n\n" +
                details
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

The student wants to practice the following
English target expressions:

${topic}


IMPORTANT RULES ABOUT TARGET EXPRESSIONS:

1. Treat EACH LINE of the user's input as ONE complete target expression.

2. NEVER split a multi-word expression into separate words.

3. For example:
   "put off" is ONE expression.
   "used to" is ONE expression.
   "get used to" is ONE expression.
   "be used to" is ONE expression.

4. Keep every multi-word expression exactly as a complete phrase.

5. Do NOT treat individual words inside a phrasal verb,
   idiom, or multi-word expression as separate targets.


SENTENCE DISTRIBUTION:

6. Randomly distribute the target expressions throughout
   the lesson.

7. DO NOT follow the order in which the expressions
   were provided by the student.

8. Each sentence should normally focus on ONE target
   expression.

9. Do NOT force several target expressions into the same
   sentence unless doing so sounds completely natural
   in everyday English.

10. Make sure the target expressions are distributed
    across the whole lesson.

11. If there are fewer target expressions than sentences,
    some expressions may be used more than once.

12. Do not make consecutive sentences use the same
    target expression unless necessary.


ENGLISH STYLE:

13. English must sound natural and conversational,
    like everyday speech between native speakers.

14. Avoid formal, academic, literary, or textbook-style
    English.

15. Use different everyday situations and vocabulary.

16. Use natural conversational contractions when appropriate,
    such as "I'm", "don't", "I've", "can't", "we're", etc.

17. Use a natural mixture of common conversational tenses
    when appropriate, including:
    - present simple
    - present continuous
    - past simple
    - past continuous
    - present perfect
    - present perfect continuous when natural
    - future with "will"
    - "be going to"

18. Do NOT deliberately force different tenses into every
    sentence. Use the tense that sounds natural for the
    situation.

19. Include different types of sentences naturally:
    - statements
    - questions
    - negative sentences
    - exclamations
    - conversational/emotional phrases

20. Use natural conversational emphasis when appropriate,
    for example:
    "I really wanted to go."
    "Did you actually do that?"
    "I just can't believe it!"

21. Avoid repetitive sentence structures.

22. Keep the sentences useful for speaking practice.

23. Keep the difficulty around A2-B1 unless the target
    expressions require slightly more advanced English.


RUSSIAN:

24. The Russian sentence should be a natural Russian
    translation/prompt for the English sentence.

25. The Russian should sound natural, not like a literal
    machine translation.


OUTPUT:

26. Create exactly ${count} sentences.

27. Return ONLY valid JSON.

28. No markdown.

29. No explanations.

30. No comments.

31. No text outside the JSON.


Required format:

[
  {
    "russian": "...",
    "english": "..."
  }
]

`;

    }

};