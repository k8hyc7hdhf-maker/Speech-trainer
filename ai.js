const AI = {

    // ==========================================
    // DEVELOPMENT MODE
    // true  = тестовые данные
    // false = OpenAI API
    // ==========================================

    DEV_MODE: true,

    MODEL: "gpt-5.5",

    async generate(topic, count) {

        console.log("================================");
        console.log("Speech Trainer AI");
        console.log("Topic:", topic);
        console.log("Sentences:", count);
        console.log("DEV MODE:", this.DEV_MODE);
        console.log("================================");

        if (this.DEV_MODE) {

            return this.generateTestLesson(count);

        }

        try {

            return await this.generateOpenAI(topic, count);

        }

        catch (error) {

            console.error(error);

            alert(
                "OpenAI error.\n\n" +
                "Using test lesson instead."
            );

            return this.generateTestLesson(count);

        }

    },

    //------------------------------------------------
    // TEST MODE
    //------------------------------------------------

    generateTestLesson(count) {

        const lesson = [

            {
                russian: "Я раньше жил в деревне.",
                english: "I used to live in a village."
            },

            {
                russian: "Я привык вставать рано.",
                english: "I'm used to getting up early."
            },

            {
                russian: "Не откладывай это.",
                english: "Don't put it off."
            }

        ];

        const result = [];

        while (result.length < count) {

            for (const sentence of lesson) {

                if (result.length >= count) {

                    break;

                }

                result.push(sentence);

            }

        }

        return result;

    },

    //------------------------------------------------
    // OPENAI
    //------------------------------------------------

    async generateOpenAI(topic, count) {

        const prompt = this.buildPrompt(topic, count);

        const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    "Authorization":
                        `Bearer ${CONFIG.apiKey}`

                },

                body: JSON.stringify({

                    model: this.MODEL,

                    messages: [

                        {
                            role: "user",
                            content: prompt
                        }

                    ],

                    temperature: 0.8

                })

            }

        );

        if (!response.ok) {

            throw new Error(
                "HTTP " + response.status
            );

        }

        const data = await response.json();

        const text =
            data.choices[0].message.content;

        return JSON.parse(text);

    },

    //------------------------------------------------
    // PROMPT
    //------------------------------------------------

    buildPrompt(topic, count) {

        return `

Create ${count} English learning sentences.

Topic:

${topic}

Return ONLY valid JSON.

Format:

[
  {
    "russian":"...",
    "english":"..."
  }
]

No markdown.

No explanations.

No comments.

`;

    }

};