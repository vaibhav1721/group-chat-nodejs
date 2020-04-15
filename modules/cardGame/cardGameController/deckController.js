    // generates a deck of cards
    module.exports.generate_deck = function (deck ) {

        // creates card generator function
        let card = (suit, value) => {
            let name = value + ' of ' + suit;
            //returns key and values into each instance of the this.deck array
            return {'name': name, 'suit': suit, 'value':value}
        }

        let values = ['2', '3','4','5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
        let suits = ['Clubs', 'Diamonds', 'Spades', 'Hearts']

        for ( let s = 0; s < suits.length; s++ ) {
            for ( let v = 0; v < values.length; v++ ) {
                deck.push(card(suits[s], values[v]))
            }
        }
        return deck;
    }

    // prints the deck of card objects
    module.exports.print_deck = function (deck) {
        if (deck.length === 0) {
            console.log('Deck has not been generated. Call generate_deck() on deck object before continuing.')
        }
        else {
            for ( let c = 0; c < deck.length; c++ ) {
                console.log(deck[c])
            }
        }
        return deck
    }

    // shuffle the deck
    module.exports.shuffle =  function  (deck) {
        for( let c = deck.length -1; c >= 0; c--){
            let tempval = deck[c];
            let randomindex = Math.floor(Math.random() * deck.length);

            //ensures that the randome index isn't the same as the current index. It runs the function again if this returns as true
            while(randomindex == c){ randomindex = Math.floor(Math.random() * deck.length)}
            deck[c] = deck[randomindex];
            deck[randomindex] = tempval;
        }
        return deck;
    }

    // deal a number cards
    module.exports.deal = function (deck, num_cards) {

        let cards = []

        for ( let c = 0; c < num_cards; c++ ) {
            let dealt_card = deck.shift()
            cards.push(dealt_card)
        }

        return cards
    }

    module.exports.replace = function (deck, dealt_cards) {
        deck.unshift(dealt_cards.shift())
        return deck;
    }