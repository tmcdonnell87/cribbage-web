function Card(rank, suit) {
    "use strict";

    this.rank = rank;
    this.suit = suit;

    //PRIVATE FIELDS

    var isFaceUp = false;

    //PUBLIC FUNCTIONS

    /**
    * suit getter method
    * returns String suit
    */
    this.getSuit = function () {
        return suit;
    };

    /**
     * Returns "r" if the card is red (hearts or diamonds) and "B"
     * otherwise.
     */
    this.getColor = function () {
        return (suit === "H" || suit === "D") ? "R" : "B";
    };

    /**
    * Returns whether the card is face up or not.
    */
    this.isFaceUp = function () {
        return isFaceUp;
    };

    /**
    * Sets whether the card is face up--true means it is.
    */
    this.setFaceUp = function (flag) {
        isFaceUp = flag;
    };

    /**
    * rank getter method
    * returns int rank
    */
    this.getRank = function () {
        return rank;
    };


    this.toString = function () {
        return Card.RANKS[rank] + " of " + Card.SUITS[suit];
    };

    this.shortName = function() {
        return rank + suit;
    };
}


Card.RANKS = {
    "A": "Ace",
    "2": "Two",
    "3": "Three",
    "4": "Four",
    "5": "Five",
    "6": "Six",
    "7": "Seven",
    "8": "Eight",
    "9": "Nine",
    "10": "Ten",
    "J": "Jack",
    "Q": "Queen",
    "K": "King"
};

Card.SUITS = {
    "S": "Spades",
    "D": "Diamonds",
    "C": "Clubs",
    "H": "Hearts"
};

Card.getRanks = function () {
    "use strict";
    return ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
};

Card.getSuits = function () {
    "use strict";
    return ["C", "D", "H", "S"];
};

module.exports = Card;
/*
(function (){
    "use strict";
    var root = typeof self === "object" && self.self === self && self ||
            typeof global === "object" && global.global === global && global ||
            this;
    // Node.js
    if (typeof module === "object" && module.exports) {
        module.exports = Card;
    }
    // AMD / RequireJS
    else if (typeof define === "function" && define.amd) {
        define([], function () {
            return Card;
        });
    }
    // included directly via <script> tag
    else {
        root.Card = Card;
    }
})();
*/
