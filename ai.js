const AI = {

    // ==========================================
    // SETTINGS
    // ==========================================

    USE_TEST_DATA: false,

    WORKER_URL:
        "https://speech-trainer-api.5h5ztzff24.workers.dev/",


    // ==========================================
    // MAIN
    // ==========================================

    async generate(topic, count) {

        console.log("================================");
        console.log("Speech Trainer AI");
        console.log("Input:", topic);
        console.log("Sentences:", count);
        console.log("================================");


        if (this.USE_TEST_DATA) {

            return this.generateTestLesson(count);

        }


        try {

            return await this.generateOpenAI(
                topic,
                count
            );

        }

        catch (error) {

            console.error(
                "AI generation error:",
                error
            );

            alert(
                "AI error:\n\n" +
                error.message
            );

            return this.generateTestLesson(count);

        }

    },


    // ==========================================
    // OPENAI THROUGH CLOUDFLARE WORKER
    // ==========================================

    async generateOpenAI(topic, count) {

        /*
            Разбираем введённые пользователем
            выражения.

            Например:

            used to
            be used to
            get used to
            put off

            превращается в отдельные targets.
        */

        const targets = this.parseTargets(topic);


        if (targets.length === 0) {

            throw new Error(
                "Please enter at least one target expression."
            );

        }


        console.log(
            "Target expressions:",
            targets
        );


        const prompt =
            this.buildPrompt(
                targets,
                count
            );


        console.log(
            "Sending request to Worker..."
        );


        const response = await fetch(
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


        const responseText =
            await response.text();


        console.log(
            "Worker status:",
            response.status
        );


        console.log(
            "Worker response:",
            responseText
        );


        let data;


        try {

            data =
                JSON.parse(responseText);

        }

        catch (error) {

            throw new Error(
                "Worker returned invalid JSON:\n" +
                responseText
            );

        }


        if (!response.ok) {

            throw new Error(
                data.error ||
                data.message ||
                JSON.stringify(data)
            );

        }


        /*
            Worker должен вернуть:

            {
                ok: true,
                reply: "..."
            }
        */

        if (!data.reply) {

            throw new Error(
                "Worker returned no AI reply."
            );

        }


        let lesson;


        try {

            lesson =
                this.parseAIResponse(
                    data.reply
                );

        }

        catch (error) {

            throw new Error(
                "AI returned invalid lesson data.\n\n" +
                error.message
            );

        }


        if (!Array.isArray(lesson)) {

            throw new Error(
                "AI response is not an array."
            );

        }


        if (lesson.length === 0) {

            throw new Error(
                "AI returned an empty lesson."
            );

        }


        /*
            Очищаем текст перед озвучиванием.
        */

        lesson.forEach(sentence => {

            sentence.russian =
                this.cleanSpeechText(
                    sentence.russian
                );

            sentence.english =
                this.cleanSpeechText(
                    sentence.english
                );

        });


        return lesson;

    },


    // ==========================================
    // PARSE TARGET EXPRESSIONS
    // ==========================================

    parseTargets(topic) {

        return topic

            .split(/\n|,/)

            .map(item =>
                item
                    .trim()
                    .replace(/\s+/g, " ")
            )

            .filter(Boolean);

    },


    // ==========================================
    // BUILD PROMPT
    // ==========================================

    buildPrompt(targets, count) {

        const targetList =
            targets
                .map(
                    (target, index) =>
                        `${index + 1}. ${target}`
                )
                .join("\n");


        return `

You are creating an English speaking-practice lesson.

The learner provided several TARGET EXPRESSIONS.

Each target expression is a separate learning target.

TARGET EXPRESSIONS:

${targetList}


IMPORTANT RULES:

1. Create exactly ${count} sentences.

2. Treat each target expression separately.

3. Do NOT combine multiple target expressions in the same sentence unless absolutely natural and necessary.

4. Distribute the sentences as evenly as possible among the target expressions.

5. Every sentence must clearly demonstrate one of the target expressions.

6. Use natural, everyday conversational English.

7. Write sentences that a native speaker would realistically say.

8. Do NOT make the sentences sound like textbook examples.

9. Use a natural variety of common conversational grammar and tenses.

10. Useful everyday tenses include:
    - Present Simple
    - Present Continuous
    - Past Simple
    - Past Continuous
    - Present Perfect
    - Past Perfect when naturally appropriate
    - will
    - be going to
    - Present Continuous for future arrangements

11. Do NOT force rare, formal, literary, academic, or unusual tenses just to create variety.

12. Naturalness is more important than grammatical variety.

13. Mix different sentence types naturally:
    - statements
    - questions
    - negative sentences
    - exclamations

14. Use natural conversational emphasis when appropriate:
    really, actually, just, still, definitely, honestly,
    seriously, ever, never, even, at all, probably, maybe

15. Do NOT put these words into every sentence.
    Use them only when they sound natural.

16. Sentences should have different situations and contexts.

17. Avoid repeating the same sentence pattern.

18. The Russian translation must sound natural in Russian.

19. The English sentence must be a natural spoken-English sentence.

20. Return ONLY valid JSON.

21. Do NOT use Markdown.

22. Do NOT add explanations.

23. Do NOT add comments.

24. The JSON format must be exactly:

[
  {
    "russian": "...",
    "english": "..."
  }
]

Return exactly ${count} objects.

`;
    },


    // ==========================================
    // PARSE AI RESPONSE
    // ==========================================

    parseAIResponse(text) {

        let cleaned =
            text.trim();


        /*
            Иногда модель может случайно
            оставить ```json ... ```
        */

        cleaned =
            cleaned
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/\s*```$/i, "")
                .trim();


        const firstBracket =
            cleaned.indexOf("[");


        const lastBracket =
            cleaned.lastIndexOf("]");


        if (
            firstBracket === -1 ||
            lastBracket === -1
        ) {

            throw new Error(
                "No JSON array found in AI response."
            );

        }


        cleaned =
            cleaned.substring(
                firstBracket,
                lastBracket + 1
            );


        return JSON.parse(cleaned);

    },


    // ==========================================
    // CLEAN TEXT FOR SPEECH
    // ==========================================

    cleanSpeechText(text) {

        if (
            typeof text !== "string"
        ) {

            return "";

        }


        return text

            // Убираем управляющие символы
            .replace(
                /[\u0000-\u001F\u007F-\u009F]/g,
                " "
            )

            // Убираем Markdown
            .replace(
                /[*_#`]/g,
                ""
            )

            // Заменяем необычные кавычки
            .replace(
                /[""«»]/g,
                '"'
            )

            // Заменяем необычные апострофы
            .replace(
                /[‘’]/g,
                "'"
            )

            // Заменяем длинные тире
            .replace(
                /[–--]/g,
                "-"
            )

            // Заменяем многоточие
            .replace(
                /…/g,
                "..."
            )

            // Убираем лишние пробелы
            .replace(
                /\s+/g,
                " "
            )

            .trim();

    },


    // ==========================================
    // TEST MODE
    // ==========================================

    generateTestLesson(count) {

        const lesson = [

            {
                russian:
                    "Раньше я каждое утро бегал.",
                english:
                    "I used to go running every morning."
            },

            {
                russian:
                    "Ты уже привык работать ночью?",
                english:
                    "Are you used to working at night yet?"
            },

            {
                russian:
                    "Я действительно не могу к этому привыкнуть!",
                english:
                    "I really can't get used to this!"
            },

            {
                russian:
                    "Почему ты опять это откладываешь?",
                english:
                    "Why are you putting it off again?"
            }

        ];


        const result = [];


        while (
            result.length < count
        ) {

            for (
                const sentence of lesson
            ) {

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

    }

};