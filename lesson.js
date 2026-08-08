const Lesson = {


    sentences: [],
    order: [],
    index: 0,
    random: false,

    load(data) {

        this.sentences = data;
        this.index = 0;

        this.createOrder();

    },

    createOrder() {

        this.order = [];

        for (let i = 0; i < this.sentences.length; i++) {

            this.order.push(i);

        }

        if (this.random) {

            this.shuffle();

        }

    },

    shuffle() {

        for (let i = this.order.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [this.order[i], this.order[j]] =
                [this.order[j], this.order[i]];

        }

    },

    current() {

        if (this.sentences.length === 0) {

            return null;

        }

        return this.sentences[
            this.order[this.index]
        ];

    },

    next() {

        if (this.sentences.length === 0) {

            return null;

        }

        this.index++;

        if (this.index >= this.order.length) {

            this.index = 0;

            if (this.random) {

                this.shuffle();

            }

        }

        return this.current();

    },

    previous() {

        if (this.sentences.length === 0) {

            return null;

        }

        this.index--;

        if (this.index < 0) {

            this.index = this.order.length - 1;

        }

        return this.current();

    },

    restart() {

        this.index = 0;

    },

    setRandom(enabled) {

        this.random = enabled;

        this.restart();

        this.createOrder();

    },

    count() {

        return this.sentences.length;

    }

};