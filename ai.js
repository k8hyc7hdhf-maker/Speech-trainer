
const AI = {

    async generate(topic, count) {

        console.log("Topic:", topic);
        console.log("Sentences:", count);

        // ==========================================
        // ВРЕМЕННО
        // Позже здесь будет запрос к OpenAI API.
        // ==========================================

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

        // Если пользователь запросил больше предложений,
        // пока просто повторяем существующие.

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

    }

};