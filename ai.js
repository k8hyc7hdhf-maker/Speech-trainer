const AI = {

    // ==========================================
    // DEVELOPMENT MODE
    // USE_TEST_DATA
    // true  = тестовые данные
    // false = OpenAI API
    // ==========================================

    USE_TEST_DATA: false,

    MODEL: "gpt-5.5",
TEMPERATURE: 0.8,

    async generate(topic, count) {

        alert("AI.generate()");
        console.log("================================");
        console.log("Speech Trainer AI");
        console.log("Topic:", topic);
        console.log("Sentences:", count);
        console.log("DEV MODE:", this.USE_TEST_DATA);
        console.log("================================");

        if (this.USE_TEST_DATA) {

            return this.generateTestLesson(count);

        }

        try {

alert("Calling OpenAI...");

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

alert("generateOpenAI()");

    const apiKey = localStorage.getItem("openaiApiKey");

    if (!apiKey) {

        throw new Error(
            "Please enter your OpenAI API Key."
        );

    }

    const response = await fetch(

        "https://api.openai.com/v1/chat/completions",

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                "Authorization": `Bearer ${apiKey}`

            },

            body: JSON.stringify({

                model: this.MODEL,

                messages: [

                    {
                        role: "user",
                        content: "Say only: Hello!"
                    }

                ]

            })

        }

    );

    if (!response.ok) {

        const error = await response.text();

        throw new Error(error);

    }

    const data = await response.json();

    alert(data.choices[0].message.content);

    return this.generateTestLesson(count);

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