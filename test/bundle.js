(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
/* exported CribbageHand */
/*eslint global-strict:0, no-wrap-func:0, no-empty-class:0, no-extra-strict:0 */

var Hand = require("./hand.js");

function CribbageHand(){
    "use strict";
    this.cards = [];
}

CribbageHand.prototype = Object.create(Hand.prototype);

CribbageHand.prototype.numFifteens = function(){
    "use strict";
    if(this.cards.length < 2){
        return 0;
    }
    var values = [];
    this.cards.forEach(function(card){
        switch(card.rank){
            case "A":
                values.push(1);
                break;
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                values.push(parseInt(card.rank));
                break;
            case "10":
            case "J":
            case "Q":
            case "K":
                values.push(10);
        }
    });
    return this.findComponentSums(15, values.sort());
};

CribbageHand.prototype.countPoints = function(turn){
    "use strict";
    var points = 0;
    //console.log(this.cards);
    var isFlush = this.isFlush();
    if(turn){
        this.cards.forEach(function(card){
            if(card.rank === "J" && card.suit === turn.suit){
                points++;
            }
        });
        if(isFlush)
        {
            if(turn.suit === this.cards[0].suit)
            {
                points += this.cards.length + 1;
            }
            else{
                points += this.cards.length;
            }
        }
        this.cards.push(turn);
    }else if(isFlush){
        points += this.cards.length;
    }
    //console.log(points);
    var runs = this.getRuns();
    var runLength, runLimit;
    for(runLength in runs){
        if(runs.hasOwnProperty(runLength) && runLength >= 3){
            for(runLimit in runs[runLength]){
                points += runLength * runs[runLength][runLimit];
            }
        }
    }
    //console.log(points);
    var ranks = this.getRanks();
    var cardRank, num;
    for (cardRank in ranks){
        num = ranks[cardRank];

        if(num > 1){
            points += num * (num - 1);
        }
    }
    //console.log(points);
    points += this.numFifteens() * 2;
    this.cards.pop();
    return points;
};

module.exports = CribbageHand;

/*
(function (){
    "use strict";
    var root = typeof self === "object" && self.self === self && self ||
            typeof global === "object" && global.global === global && global ||
            this;
    // Node.js
    if (typeof module === "object" && module.exports) {
        module.exports = CribbageHand;
    }
    // AMD / RequireJS
    else if (typeof define === "function" && define.amd) {
        define([], function () {
            return CribbageHand;
        });
    }
    // included directly via <script> tag
    else {
        root.CribbageHand = CribbageHand;
    }
})();
*/

},{"./hand.js":4}],3:[function(require,module,exports){
/*jshint plusplus: false*/
/* exported Deck */
/*eslint global-strict:0, no-wrap-func:0, no-empty-class:0, no-extra-strict:0 */
var Card = require("./card.js");

function Deck() {  //eslint-disable-line no-unused-vars
    "use strict";
    //var rank, suit;
    var cards = [];

    Card.getSuits().forEach(function(suit){
        Card.getRanks().forEach(function(rank){
            cards.push(new Card(rank, suit));
        });
    });

    this.cards = cards;

    this.shuffle = function (n) {
        if (!n) {
            n = 7;
        }
        var len = this.cards.length,
            i, j, r, tmp;

        for (i = 0; i < n; i++) {
            for (j = 0; j < len; j++) {
                r = Math.floor(Math.random() * len);
                tmp = this.cards[j];
                this.cards[j] = this.cards[r];
                this.cards[r] = tmp;
            }
        }
    };

    this.count = function () {
        return this.cards.length;
    };

    this.deal = function () {
        return this.cards.length > 0 ? this.cards.pop() : null;
    };

    this.draw = function (n) {
        if (!n) {
            n = 1;
        }
        return this.cards.splice(0, n - 1);
    };

    this.peek = function (n) {
        return this.cards.length > n ? this.cards[n] : null;
    };

    this.take = function (n) {
        return this.cards.length > n ? this.cards.splice(n, 1)[0] : null;
    };

    this.insert = function (card, pos){
        if (card === null){
            return;
        }
        var i;
        for (i = 0; i < this.cards.length; i++) {
            if (card === this.cards[i]) {
                this.cards.splice(i, 1);
            }
        }
        if (pos > this.cards.length) {
            this.cards.push(card);
            return;
        }
        this.cards.splice(pos, 0, card);
    };

    this.addTop = function (card) {
        if(card === null){
            return;
        }
        this.insert(card, 0);
    };

    this.addBottom = function (card) {
        this.insert(card, this.cards.length - 1);
    };

    this.find = function (cardRank, cardSuit) {
        var i, card;
        for (i = 0; i < this.cards.length; i++){
            card = this.cards[i];
            if (card.rank === cardRank && card.suit === cardSuit) {
                return i;
            }
        }
        return -1;
    };

    this.pull = function (cardRank, cardSuit) {
        var idx = this.find(cardRank, cardSuit);
        return idx >= 0 ? this.take(idx) : null;
    };

}

module.exports = Deck;
/*
(function (){
    "use strict";
    var root = typeof self === "object" && self.self === self && self ||
            typeof global === "object" && global.global === global && global ||
            this;
    // Node.js
    if (typeof module === "object" && module.exports) {
        module.exports = Deck;
    }
    // AMD / RequireJS
    else if (typeof define === "function" && define.amd) {
        define([], function () {
            return Deck;
        });
    }
    // included directly via <script> tag
    else {
        root.Deck = Deck;
    }
})();
*/

},{"./card.js":1}],4:[function(require,module,exports){
/* exported Hand */
/*eslint global-strict:0, no-wrap-func:0, no-empty-class:0, no-extra-strict:0 */
var Card = require("./card.js");


function Hand(){
    "use strict";
    this.cards = [];
}

Hand.prototype.initialize = function(newCards){
    "use strict";
    for(var i = 0; i < newCards.length; i++){
        this.cards.push(newCards[i]);
    }
};


Hand.prototype.addCard = function(card){
    "use strict";
    this.cards.push(card);
};

Hand.prototype.count = function() {
    "use strict";
    return this.cards.length;
};

Hand.prototype.getCards = function(){
    "use strict";
    return this.cards;
};

Hand.prototype.isFlush = function (){
    "use strict";
    if (this.cards.length < 1) {
        return false;
    }
    var suit = this.cards[0].suit;
    for (var i = 1; i < this.cards.length; i++){
        if(suit !== this.cards[i].suit){
            return false;
        }
    }
    return true;
};


Hand.prototype.getRanks = function() {
    "use strict";
    var i;
    var ranks = [];
    if(!this.cards){
        return ranks;
    }

    for (i = 0; i < this.cards.length; i++){
        var rank = this.cards[i].getRank();
        if(!ranks[rank]){
            ranks[rank] = 1;
        }else{
            ranks[rank]++;
        }
    }
    return ranks;
};

Hand.prototype.getRuns = function(){
    "use strict";
    var runLength = 0, runCount = 1, lastRank;  //eslint-disable-line no-unused-vars
    var ranks = this.getRanks();
    var runs = [];
    if(ranks.length === 0){
        return runs;
    }

    //TODO: Flexible ace value
    Card.getRanks().forEach(function (rank) {
        //in a run, save info
        if(ranks[rank]){
            runLength++;
            runCount *= ranks[rank];
        }
        else{
            //save the run
            if(runLength > 0){
                if(!runs[runLength])
                {
                    runs[runLength] = {};
                }
                runs[runLength][lastRank] = runCount;
                runLength = 0; runCount = 1;
            }
        }
        lastRank = rank;
    });

    //save any run that tops out
    if(runLength > 0){
        if(!runs[runLength])
        {
            runs[runLength] = [];
        }
        runs[runLength][lastRank] = runCount;
        runLength = 0; runCount = 1;
    }
    return runs;
};

Hand.prototype.findComponentSums = function(target, values){
    "use strict";
    return this.findComponentSumsRecursive(target, values, 0);
};

Hand.prototype.findComponentSumsRecursive = function(target, values, start){
    "use strict";
    var sums = 0;
    var val, i;
    for(i = start; i < values.length; i++){
        val = values[i];
        if(val > target) {
            return sums;
        }else if(val === target) {
            sums++;
        }else {
            sums += this.findComponentSumsRecursive(target - val, values, i + 1);
        }
    }
    return sums;
};

Hand.prototype.toString = function(){
    "use strict";
    return this.cards.map(function(card){ return card.shortName(); }).toString();
};

module.exports = Hand;
/*
(function (){
    "use strict";
    var root = typeof self === "object" && self.self === self && self ||
            typeof global === "object" && global.global === global && global ||
            this;
    // Node.js
    if (typeof module === "object" && module.exports) {
        module.exports = Hand;
    }
    // AMD / RequireJS
    else if (typeof define === "function" && define.amd) {
        define([], function () {
            return Hand;
        });
    }
    // included directly via <script> tag
    else {
        root.Hand = Hand;
    }
})();
*/

},{"./card.js":1}],5:[function(require,module,exports){
/*eslint-env mocha */
/*eslint global-strict:0, no-wrap-func:0, no-empty-class:0, no-extra-strict:0 */
/* global Card, Deck, CribbageHand, should */

/*
define(function(require) {
    var Card = require("scripts/card.js");
    var Deck = require("scripts/deck.js");
    console.log("Hello world!");
});*/

var Card = require("../../app/scripts/card.js");
var Deck = require("../../app/scripts/deck.js");
var CribbageHand = require("../../app/scripts/cribbage-hand.js");

(function () {
    "use strict";
    describe("Cards", function () {
        it("should have the correct rank order", function(){
            var rankList = Card.getRanks();
            rankList[0].should.equal("A");
            rankList[1].should.equal("2");
            rankList[2].should.equal("3");
            rankList[3].should.equal("4");
            rankList[4].should.equal("5");
            rankList[5].should.equal("6");
            rankList[6].should.equal("7");
            rankList[7].should.equal("8");
            rankList[8].should.equal("9");
            rankList[9].should.equal("T");
            rankList[10].should.equal("J");
            rankList[11].should.equal("Q");
            rankList[12].should.equal("K");
        });
        it("should have the correct suit order", function(){
            var suitList = Card.getSuits();
            suitList[0].should.equal("C");
            suitList[1].should.equal("D");
            suitList[2].should.equal("H");
            suitList[3].should.equal("S");
        });
    });

    describe("Deck", function () {

        describe("Basic", function () {
            var deck = new Deck();
            it("should have 52 cards", function () {
                deck.count().should.equal(52);
            });
            it("should start with the Ace of Clubs", function () {
                deck.peek(0).shortName().should.equal("AC");
            });
        });
        describe("Taking a card", function () {
            var deck = new Deck();
            var card = deck.take(34);
            it("should have the 35th card be the Nine of Hearts", function () {
                card.should.not.equal(null);
                card.shortName().should.equal("9H");
            });
            it("should be 51 cards after removing the 35th card", function () {
                deck.count().should.equal(51);
            });
            it("should be possible to put the Nine of Hearts back in the 18th position in the deck", function () {
                deck.insert(card, 17);
                deck.peek(17).shortName().should.equal("9H");
            });
            it("should be 52 cards after adding the card", function () {
                deck.count().should.equal(52);
            });
            it("should move a card when re-adding the same card", function () {
                deck.insert(card, 34);
                deck.count().should.equal(52);
                deck.peek(17).shortName().should.equal("5D");
                deck.peek(34).shortName().should.equal("9H");
            });
        });
        describe("Pulling a card", function () {
            var card;
            var deck = new Deck();
            it("The Two of Diamonds should be the 15th card", function () {
                deck.find("2", "D").should.equal(14);
            });
            it("should be possible to remove the Three of Clubs", function () {
                card = deck.pull("3", "C");
            });
            it("should be 51 cards after removing the Three of Clubs", function () {
                deck.count().should.equal(51);
            });
            it("should not be possible to remove the Three of Clubs again", function () {
                should.not.exist(deck.pull("3", "C"));
            });
            it("should be possible add the Three of Clubs to the top of the deck", function () {
                deck.addTop(card);
                deck.count().should.equal(52);
            });
        });

        describe("Shuffling", function () {
            var deck = new Deck();
            it("should be the same number of cards after shuffling", function () {
                deck.shuffle();
                deck.count().should.equal(52);
            });
        });
    });

    describe("Hands", function () {
        describe("AH, AC, AD, KS, KD", function () {
            var deck = new Deck();
            var hand = new CribbageHand();
            hand.addCard(deck.pull("A", "H"));
            hand.addCard(deck.pull("A", "C"));
            hand.addCard(deck.pull("A", "D"));
            hand.addCard(deck.pull("K", "S"));
            hand.addCard(deck.pull("K", "D"));
            var ranks = hand.getRanks();

            it("should have five cards", function(){
                hand.count().should.equal(5);
            });
            it("should have 3 aces and 2 kings", function(){
                ranks.should.have.keys("A", "K");
                ranks.A.should.equal(3);
                ranks.K.should.equal(2);
            });
            it("should have no fifteens", function(){
                hand.numFifteens().should.equal(0);
            });
            it("should have eight points", function(){
                hand.countPoints().should.equal(8);
            });
        });

        describe("2H, 3C, 3D, 4S, 7D", function () {
            var deck = new Deck();
            var hand = new CribbageHand();
            hand.addCard(deck.pull("2", "H"));
            hand.addCard(deck.pull("3", "C"));
            hand.addCard(deck.pull("3", "D"));
            hand.addCard(deck.pull("4", "S"));
            hand.addCard(deck.pull("7", "D"));

            var runs = hand.getRuns();
            it("should have runs of length 3 and 1", function(){
                runs.should.have.keys("3", "1");
            });
            it("should have the runs of three terminate at 4 and the runs of one terminate at 7", function(){
                runs[3].should.have.keys("4");
                runs[3][4].should.equal(2);
                runs[1].should.have.keys("7");
                runs[1][7].should.equal(1);
            });
            it("should have one fifteen", function(){
                hand.numFifteens().should.equal(1);
            });
            it("should have ten points", function(){
                hand.countPoints().should.equal(10);
            });

        });

       describe("4H, 5C, 5D, 6S, 6H", function () {
            var deck = new Deck();
            var hand = new CribbageHand();
            hand.addCard(deck.pull("4", "H"));
            hand.addCard(deck.pull("5", "C"));
            hand.addCard(deck.pull("5", "D"));
            hand.addCard(deck.pull("6", "S"));
            hand.addCard(deck.pull("6", "H"));

            var runs = hand.getRuns();

            it("should have four runs of length 3", function(){
                runs.should.have.keys("3");
                runs[3].should.have.keys("6");
                runs[3][6].should.equal(4);
            });

            it("should not be a flush", function(){
               hand.isFlush().should.equal(false);
            });
            it("should have four fifteens", function(){
                hand.numFifteens().should.equal(4);
            });
            it("should have 24 points", function(){
                hand.countPoints().should.equal(24);
            });
        });

        describe("2H, 4H, 5H, 7H, AH", function () {
            var deck = new Deck();
            var hand = new CribbageHand();
            hand.addCard(deck.pull("2", "H"));
            hand.addCard(deck.pull("4", "H"));
            hand.addCard(deck.pull("5", "H"));
            hand.addCard(deck.pull("7", "H"));
            hand.addCard(deck.pull("A", "H"));

            it("should be a flush", function(){
                hand.isFlush().should.equal(true);
            });
            it("should have one fifteen", function(){
                hand.numFifteens().should.equal(1);
            });
            it("should have seven points", function(){
                hand.countPoints().should.equal(7);
            });
        });

        describe("2H, 4H, 5H, 6H; turn: 9H", function (){
            var deck = new Deck();
            var hand = new CribbageHand();
            hand.addCard(deck.pull("2", "H"));
            hand.addCard(deck.pull("4", "H"));
            hand.addCard(deck.pull("5", "H"));
            hand.addCard(deck.pull("6", "H"));
            it("should be 14 points", function(){
                hand.countPoints(deck.pull("9", "H")).should.equal(14);
            });
        });

        describe("2H, JH, KH, 3S; turn: 3H", function (){
            var deck = new Deck();
            var hand = new CribbageHand();
            hand.addCard(deck.pull("2", "H"));
            hand.addCard(deck.pull("J", "H"));
            hand.addCard(deck.pull("K", "H"));
            hand.addCard(deck.pull("3", "S"));
            it("should be 7 points", function(){
                hand.countPoints(deck.pull("3", "H")).should.equal(7);
            });
        });
    });
/*
    describe("Cribbage", function () {
        describe("AH, AC, AD, KS, KD, QS", function () {
            var deck = new Deck();
            var deal = new CribbageDeal([
                deck.pull("A", "H"),
                deck.pull("A", "C"),
                deck.pull("A", "D"),
                deck.pull("K", "S"),
                deck.pull("K", "D"),
                deck.pull("Q", "Q")
            ]);
            it("should be a deal", function (){
                deal.handPoints();
            });
        });
    });
*/
})();


},{"../../app/scripts/card.js":1,"../../app/scripts/cribbage-hand.js":2,"../../app/scripts/deck.js":3}]},{},[5]);
