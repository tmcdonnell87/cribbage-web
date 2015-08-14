(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
(function (global){
/* exported CribbageDeal */
/*eslint global-strict:0, no-wrap-func:0, no-empty-class:0, no-extra-strict:0 */
var CribbageHand = require("./cribbage-hand.js");

function CribbageDeal(cards) {
    "use strict";
    if(cards.length !== 6){
        throw new Error("Cribbage deals must be six cards");
    }
    this.cards = cards;
}

CribbageDeal.prototype.handPoints = function(){
    "use strict";
    var crib;
    for(var p1 = 0; p1 < this.cards.length - 1; p1++){
        for (var p2 = p1 + 1; p2 < this.cards.length; p2++){
            crib = [this.cards.splice(p2, 1)[0], this.cards.splice(p1, 1)[0]];
            var hand = new CribbageHand();
            hand.initialize(this.cards);
            console.log(hand.toString());
            this.cards.splice(p1, 0, crib[1]);
            this.cards.splice(p2, 0, crib[0]);
        }
    }
};

(function (){
    "use strict";
    var root = typeof self === "object" && self.self === self && self ||
            typeof global === "object" && global.global === global && global ||
            this;
    // Node.js
    if (typeof module === "object" && module.exports) {
        module.exports = CribbageDeal;
    }
    // AMD / RequireJS
    else if (typeof define === "function" && define.amd) {
        define([], function () {
            return CribbageDeal;
        });
    }
    // included directly via <script> tag
    else {
        root.CribbageDeal = CribbageDeal;
    }
})();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./cribbage-hand.js":3}],3:[function(require,module,exports){
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

},{"./hand.js":5}],4:[function(require,module,exports){
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

},{"./card.js":1}],5:[function(require,module,exports){
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

},{"./card.js":1}],6:[function(require,module,exports){
/*eslint-env mocha */
/*eslint global-strict:0, no-wrap-func:0, no-empty-class:0, no-extra-strict:0 */
/* global should */

/*
define(function(require) {
    var Card = require("scripts/card.js");
    var Deck = require("scripts/deck.js");
    console.log("Hello world!");
});*/

var Card = require("card.js");
var Deck = require("deck.js");
var CribbageHand = require("cribbage-hand.js");
var CribbageDeal = require("cribbage-deal.js");

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

    describe("Cribbage", function () {
        describe("AH, AC, AD, KS, KD, QS", function () {
            var deck = new Deck();
            var deal = new CribbageDeal([
                deck.pull("A", "H"),
                deck.pull("A", "C"),
                deck.pull("A", "D"),
                deck.pull("K", "S"),
                deck.pull("K", "D"),
                deck.pull("Q", "S")
            ]);

            deal.handPoints();
            it("should be a deal", function (){
                
            });
        });
    });

})();


},{"card.js":1,"cribbage-deal.js":2,"cribbage-hand.js":3,"deck.js":4}]},{},[6])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc2NyaXB0cy9jYXJkLmpzIiwiYXBwL3NjcmlwdHMvY3JpYmJhZ2UtZGVhbC5qcyIsImFwcC9zY3JpcHRzL2NyaWJiYWdlLWhhbmQuanMiLCJhcHAvc2NyaXB0cy9kZWNrLmpzIiwiYXBwL3NjcmlwdHMvaGFuZC5qcyIsInRlc3Qvc3BlYy90ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImZ1bmN0aW9uIENhcmQocmFuaywgc3VpdCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdGhpcy5yYW5rID0gcmFuaztcclxuICAgIHRoaXMuc3VpdCA9IHN1aXQ7XHJcblxyXG4gICAgLy9QUklWQVRFIEZJRUxEU1xyXG5cclxuICAgIHZhciBpc0ZhY2VVcCA9IGZhbHNlO1xyXG5cclxuICAgIC8vUFVCTElDIEZVTkNUSU9OU1xyXG5cclxuICAgIC8qKlxyXG4gICAgKiBzdWl0IGdldHRlciBtZXRob2RcclxuICAgICogcmV0dXJucyBTdHJpbmcgc3VpdFxyXG4gICAgKi9cclxuICAgIHRoaXMuZ2V0U3VpdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gc3VpdDtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIFwiclwiIGlmIHRoZSBjYXJkIGlzIHJlZCAoaGVhcnRzIG9yIGRpYW1vbmRzKSBhbmQgXCJCXCJcclxuICAgICAqIG90aGVyd2lzZS5cclxuICAgICAqL1xyXG4gICAgdGhpcy5nZXRDb2xvciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gKHN1aXQgPT09IFwiSFwiIHx8IHN1aXQgPT09IFwiRFwiKSA/IFwiUlwiIDogXCJCXCI7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgKiBSZXR1cm5zIHdoZXRoZXIgdGhlIGNhcmQgaXMgZmFjZSB1cCBvciBub3QuXHJcbiAgICAqL1xyXG4gICAgdGhpcy5pc0ZhY2VVcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gaXNGYWNlVXA7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgKiBTZXRzIHdoZXRoZXIgdGhlIGNhcmQgaXMgZmFjZSB1cC0tdHJ1ZSBtZWFucyBpdCBpcy5cclxuICAgICovXHJcbiAgICB0aGlzLnNldEZhY2VVcCA9IGZ1bmN0aW9uIChmbGFnKSB7XHJcbiAgICAgICAgaXNGYWNlVXAgPSBmbGFnO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICogcmFuayBnZXR0ZXIgbWV0aG9kXHJcbiAgICAqIHJldHVybnMgaW50IHJhbmtcclxuICAgICovXHJcbiAgICB0aGlzLmdldFJhbmsgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHJhbms7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICB0aGlzLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBDYXJkLlJBTktTW3JhbmtdICsgXCIgb2YgXCIgKyBDYXJkLlNVSVRTW3N1aXRdO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNob3J0TmFtZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiByYW5rICsgc3VpdDtcclxuICAgIH07XHJcbn1cclxuXHJcblxyXG5DYXJkLlJBTktTID0ge1xyXG4gICAgXCJBXCI6IFwiQWNlXCIsXHJcbiAgICBcIjJcIjogXCJUd29cIixcclxuICAgIFwiM1wiOiBcIlRocmVlXCIsXHJcbiAgICBcIjRcIjogXCJGb3VyXCIsXHJcbiAgICBcIjVcIjogXCJGaXZlXCIsXHJcbiAgICBcIjZcIjogXCJTaXhcIixcclxuICAgIFwiN1wiOiBcIlNldmVuXCIsXHJcbiAgICBcIjhcIjogXCJFaWdodFwiLFxyXG4gICAgXCI5XCI6IFwiTmluZVwiLFxyXG4gICAgXCIxMFwiOiBcIlRlblwiLFxyXG4gICAgXCJKXCI6IFwiSmFja1wiLFxyXG4gICAgXCJRXCI6IFwiUXVlZW5cIixcclxuICAgIFwiS1wiOiBcIktpbmdcIlxyXG59O1xyXG5cclxuQ2FyZC5TVUlUUyA9IHtcclxuICAgIFwiU1wiOiBcIlNwYWRlc1wiLFxyXG4gICAgXCJEXCI6IFwiRGlhbW9uZHNcIixcclxuICAgIFwiQ1wiOiBcIkNsdWJzXCIsXHJcbiAgICBcIkhcIjogXCJIZWFydHNcIlxyXG59O1xyXG5cclxuQ2FyZC5nZXRSYW5rcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgcmV0dXJuIFtcIkFcIiwgXCIyXCIsIFwiM1wiLCBcIjRcIiwgXCI1XCIsIFwiNlwiLCBcIjdcIiwgXCI4XCIsIFwiOVwiLCBcIlRcIiwgXCJKXCIsIFwiUVwiLCBcIktcIl07XHJcbn07XHJcblxyXG5DYXJkLmdldFN1aXRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICByZXR1cm4gW1wiQ1wiLCBcIkRcIiwgXCJIXCIsIFwiU1wiXTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FyZDtcclxuLypcclxuKGZ1bmN0aW9uICgpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgcm9vdCA9IHR5cGVvZiBzZWxmID09PSBcIm9iamVjdFwiICYmIHNlbGYuc2VsZiA9PT0gc2VsZiAmJiBzZWxmIHx8XHJcbiAgICAgICAgICAgIHR5cGVvZiBnbG9iYWwgPT09IFwib2JqZWN0XCIgJiYgZ2xvYmFsLmdsb2JhbCA9PT0gZ2xvYmFsICYmIGdsb2JhbCB8fFxyXG4gICAgICAgICAgICB0aGlzO1xyXG4gICAgLy8gTm9kZS5qc1xyXG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgJiYgbW9kdWxlLmV4cG9ydHMpIHtcclxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IENhcmQ7XHJcbiAgICB9XHJcbiAgICAvLyBBTUQgLyBSZXF1aXJlSlNcclxuICAgIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICAgICAgZGVmaW5lKFtdLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDYXJkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLy8gaW5jbHVkZWQgZGlyZWN0bHkgdmlhIDxzY3JpcHQ+IHRhZ1xyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcm9vdC5DYXJkID0gQ2FyZDtcclxuICAgIH1cclxufSkoKTtcclxuKi9cclxuIiwiLyogZXhwb3J0ZWQgQ3JpYmJhZ2VEZWFsICovXHJcbi8qZXNsaW50IGdsb2JhbC1zdHJpY3Q6MCwgbm8td3JhcC1mdW5jOjAsIG5vLWVtcHR5LWNsYXNzOjAsIG5vLWV4dHJhLXN0cmljdDowICovXHJcbnZhciBDcmliYmFnZUhhbmQgPSByZXF1aXJlKFwiLi9jcmliYmFnZS1oYW5kLmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gQ3JpYmJhZ2VEZWFsKGNhcmRzKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGlmKGNhcmRzLmxlbmd0aCAhPT0gNil7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ3JpYmJhZ2UgZGVhbHMgbXVzdCBiZSBzaXggY2FyZHNcIik7XHJcbiAgICB9XHJcbiAgICB0aGlzLmNhcmRzID0gY2FyZHM7XHJcbn1cclxuXHJcbkNyaWJiYWdlRGVhbC5wcm90b3R5cGUuaGFuZFBvaW50cyA9IGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBjcmliO1xyXG4gICAgZm9yKHZhciBwMSA9IDA7IHAxIDwgdGhpcy5jYXJkcy5sZW5ndGggLSAxOyBwMSsrKXtcclxuICAgICAgICBmb3IgKHZhciBwMiA9IHAxICsgMTsgcDIgPCB0aGlzLmNhcmRzLmxlbmd0aDsgcDIrKyl7XHJcbiAgICAgICAgICAgIGNyaWIgPSBbdGhpcy5jYXJkcy5zcGxpY2UocDIsIDEpWzBdLCB0aGlzLmNhcmRzLnNwbGljZShwMSwgMSlbMF1dO1xyXG4gICAgICAgICAgICB2YXIgaGFuZCA9IG5ldyBDcmliYmFnZUhhbmQoKTtcclxuICAgICAgICAgICAgaGFuZC5pbml0aWFsaXplKHRoaXMuY2FyZHMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhoYW5kLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB0aGlzLmNhcmRzLnNwbGljZShwMSwgMCwgY3JpYlsxXSk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FyZHMuc3BsaWNlKHAyLCAwLCBjcmliWzBdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG4oZnVuY3Rpb24gKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciByb290ID0gdHlwZW9mIHNlbGYgPT09IFwib2JqZWN0XCIgJiYgc2VsZi5zZWxmID09PSBzZWxmICYmIHNlbGYgfHxcclxuICAgICAgICAgICAgdHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIiAmJiBnbG9iYWwuZ2xvYmFsID09PSBnbG9iYWwgJiYgZ2xvYmFsIHx8XHJcbiAgICAgICAgICAgIHRoaXM7XHJcbiAgICAvLyBOb2RlLmpzXHJcbiAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiBtb2R1bGUuZXhwb3J0cykge1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gQ3JpYmJhZ2VEZWFsO1xyXG4gICAgfVxyXG4gICAgLy8gQU1EIC8gUmVxdWlyZUpTXHJcbiAgICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgICAgIGRlZmluZShbXSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gQ3JpYmJhZ2VEZWFsO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLy8gaW5jbHVkZWQgZGlyZWN0bHkgdmlhIDxzY3JpcHQ+IHRhZ1xyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcm9vdC5DcmliYmFnZURlYWwgPSBDcmliYmFnZURlYWw7XHJcbiAgICB9XHJcbn0pKCk7XHJcbiIsIi8qIGV4cG9ydGVkIENyaWJiYWdlSGFuZCAqL1xyXG4vKmVzbGludCBnbG9iYWwtc3RyaWN0OjAsIG5vLXdyYXAtZnVuYzowLCBuby1lbXB0eS1jbGFzczowLCBuby1leHRyYS1zdHJpY3Q6MCAqL1xyXG5cclxudmFyIEhhbmQgPSByZXF1aXJlKFwiLi9oYW5kLmpzXCIpO1xyXG5cclxuZnVuY3Rpb24gQ3JpYmJhZ2VIYW5kKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuY2FyZHMgPSBbXTtcclxufVxyXG5cclxuQ3JpYmJhZ2VIYW5kLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSGFuZC5wcm90b3R5cGUpO1xyXG5cclxuQ3JpYmJhZ2VIYW5kLnByb3RvdHlwZS5udW1GaWZ0ZWVucyA9IGZ1bmN0aW9uKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGlmKHRoaXMuY2FyZHMubGVuZ3RoIDwgMil7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcbiAgICB2YXIgdmFsdWVzID0gW107XHJcbiAgICB0aGlzLmNhcmRzLmZvckVhY2goZnVuY3Rpb24oY2FyZCl7XHJcbiAgICAgICAgc3dpdGNoKGNhcmQucmFuayl7XHJcbiAgICAgICAgICAgIGNhc2UgXCJBXCI6XHJcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaCgxKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiMlwiOlxyXG4gICAgICAgICAgICBjYXNlIFwiM1wiOlxyXG4gICAgICAgICAgICBjYXNlIFwiNFwiOlxyXG4gICAgICAgICAgICBjYXNlIFwiNVwiOlxyXG4gICAgICAgICAgICBjYXNlIFwiNlwiOlxyXG4gICAgICAgICAgICBjYXNlIFwiN1wiOlxyXG4gICAgICAgICAgICBjYXNlIFwiOFwiOlxyXG4gICAgICAgICAgICBjYXNlIFwiOVwiOlxyXG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2gocGFyc2VJbnQoY2FyZC5yYW5rKSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIjEwXCI6XHJcbiAgICAgICAgICAgIGNhc2UgXCJKXCI6XHJcbiAgICAgICAgICAgIGNhc2UgXCJRXCI6XHJcbiAgICAgICAgICAgIGNhc2UgXCJLXCI6XHJcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaCgxMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdGhpcy5maW5kQ29tcG9uZW50U3VtcygxNSwgdmFsdWVzLnNvcnQoKSk7XHJcbn07XHJcblxyXG5DcmliYmFnZUhhbmQucHJvdG90eXBlLmNvdW50UG9pbnRzID0gZnVuY3Rpb24odHVybil7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBwb2ludHMgPSAwO1xyXG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLmNhcmRzKTtcclxuICAgIHZhciBpc0ZsdXNoID0gdGhpcy5pc0ZsdXNoKCk7XHJcbiAgICBpZih0dXJuKXtcclxuICAgICAgICB0aGlzLmNhcmRzLmZvckVhY2goZnVuY3Rpb24oY2FyZCl7XHJcbiAgICAgICAgICAgIGlmKGNhcmQucmFuayA9PT0gXCJKXCIgJiYgY2FyZC5zdWl0ID09PSB0dXJuLnN1aXQpe1xyXG4gICAgICAgICAgICAgICAgcG9pbnRzKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBpZihpc0ZsdXNoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodHVybi5zdWl0ID09PSB0aGlzLmNhcmRzWzBdLnN1aXQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHBvaW50cyArPSB0aGlzLmNhcmRzLmxlbmd0aCArIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgIHBvaW50cyArPSB0aGlzLmNhcmRzLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNhcmRzLnB1c2godHVybik7XHJcbiAgICB9ZWxzZSBpZihpc0ZsdXNoKXtcclxuICAgICAgICBwb2ludHMgKz0gdGhpcy5jYXJkcy5sZW5ndGg7XHJcbiAgICB9XHJcbiAgICAvL2NvbnNvbGUubG9nKHBvaW50cyk7XHJcbiAgICB2YXIgcnVucyA9IHRoaXMuZ2V0UnVucygpO1xyXG4gICAgdmFyIHJ1bkxlbmd0aCwgcnVuTGltaXQ7XHJcbiAgICBmb3IocnVuTGVuZ3RoIGluIHJ1bnMpe1xyXG4gICAgICAgIGlmKHJ1bnMuaGFzT3duUHJvcGVydHkocnVuTGVuZ3RoKSAmJiBydW5MZW5ndGggPj0gMyl7XHJcbiAgICAgICAgICAgIGZvcihydW5MaW1pdCBpbiBydW5zW3J1bkxlbmd0aF0pe1xyXG4gICAgICAgICAgICAgICAgcG9pbnRzICs9IHJ1bkxlbmd0aCAqIHJ1bnNbcnVuTGVuZ3RoXVtydW5MaW1pdF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvL2NvbnNvbGUubG9nKHBvaW50cyk7XHJcbiAgICB2YXIgcmFua3MgPSB0aGlzLmdldFJhbmtzKCk7XHJcbiAgICB2YXIgY2FyZFJhbmssIG51bTtcclxuICAgIGZvciAoY2FyZFJhbmsgaW4gcmFua3Mpe1xyXG4gICAgICAgIG51bSA9IHJhbmtzW2NhcmRSYW5rXTtcclxuXHJcbiAgICAgICAgaWYobnVtID4gMSl7XHJcbiAgICAgICAgICAgIHBvaW50cyArPSBudW0gKiAobnVtIC0gMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy9jb25zb2xlLmxvZyhwb2ludHMpO1xyXG4gICAgcG9pbnRzICs9IHRoaXMubnVtRmlmdGVlbnMoKSAqIDI7XHJcbiAgICB0aGlzLmNhcmRzLnBvcCgpO1xyXG4gICAgcmV0dXJuIHBvaW50cztcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ3JpYmJhZ2VIYW5kO1xyXG5cclxuLypcclxuKGZ1bmN0aW9uICgpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgcm9vdCA9IHR5cGVvZiBzZWxmID09PSBcIm9iamVjdFwiICYmIHNlbGYuc2VsZiA9PT0gc2VsZiAmJiBzZWxmIHx8XHJcbiAgICAgICAgICAgIHR5cGVvZiBnbG9iYWwgPT09IFwib2JqZWN0XCIgJiYgZ2xvYmFsLmdsb2JhbCA9PT0gZ2xvYmFsICYmIGdsb2JhbCB8fFxyXG4gICAgICAgICAgICB0aGlzO1xyXG4gICAgLy8gTm9kZS5qc1xyXG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgJiYgbW9kdWxlLmV4cG9ydHMpIHtcclxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IENyaWJiYWdlSGFuZDtcclxuICAgIH1cclxuICAgIC8vIEFNRCAvIFJlcXVpcmVKU1xyXG4gICAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcclxuICAgICAgICBkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIENyaWJiYWdlSGFuZDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8vIGluY2x1ZGVkIGRpcmVjdGx5IHZpYSA8c2NyaXB0PiB0YWdcclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJvb3QuQ3JpYmJhZ2VIYW5kID0gQ3JpYmJhZ2VIYW5kO1xyXG4gICAgfVxyXG59KSgpO1xyXG4qL1xyXG4iLCIvKmpzaGludCBwbHVzcGx1czogZmFsc2UqL1xyXG4vKiBleHBvcnRlZCBEZWNrICovXHJcbi8qZXNsaW50IGdsb2JhbC1zdHJpY3Q6MCwgbm8td3JhcC1mdW5jOjAsIG5vLWVtcHR5LWNsYXNzOjAsIG5vLWV4dHJhLXN0cmljdDowICovXHJcbnZhciBDYXJkID0gcmVxdWlyZShcIi4vY2FyZC5qc1wiKTtcclxuXHJcbmZ1bmN0aW9uIERlY2soKSB7ICAvL2VzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgLy92YXIgcmFuaywgc3VpdDtcclxuICAgIHZhciBjYXJkcyA9IFtdO1xyXG5cclxuICAgIENhcmQuZ2V0U3VpdHMoKS5mb3JFYWNoKGZ1bmN0aW9uKHN1aXQpe1xyXG4gICAgICAgIENhcmQuZ2V0UmFua3MoKS5mb3JFYWNoKGZ1bmN0aW9uKHJhbmspe1xyXG4gICAgICAgICAgICBjYXJkcy5wdXNoKG5ldyBDYXJkKHJhbmssIHN1aXQpKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuY2FyZHMgPSBjYXJkcztcclxuXHJcbiAgICB0aGlzLnNodWZmbGUgPSBmdW5jdGlvbiAobikge1xyXG4gICAgICAgIGlmICghbikge1xyXG4gICAgICAgICAgICBuID0gNztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGxlbiA9IHRoaXMuY2FyZHMubGVuZ3RoLFxyXG4gICAgICAgICAgICBpLCBqLCByLCB0bXA7XHJcblxyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGxlbjsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICByID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbGVuKTtcclxuICAgICAgICAgICAgICAgIHRtcCA9IHRoaXMuY2FyZHNbal07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhcmRzW2pdID0gdGhpcy5jYXJkc1tyXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FyZHNbcl0gPSB0bXA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuY291bnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FyZHMubGVuZ3RoO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmRlYWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FyZHMubGVuZ3RoID4gMCA/IHRoaXMuY2FyZHMucG9wKCkgOiBudWxsO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmRyYXcgPSBmdW5jdGlvbiAobikge1xyXG4gICAgICAgIGlmICghbikge1xyXG4gICAgICAgICAgICBuID0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FyZHMuc3BsaWNlKDAsIG4gLSAxKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5wZWVrID0gZnVuY3Rpb24gKG4pIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jYXJkcy5sZW5ndGggPiBuID8gdGhpcy5jYXJkc1tuXSA6IG51bGw7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMudGFrZSA9IGZ1bmN0aW9uIChuKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FyZHMubGVuZ3RoID4gbiA/IHRoaXMuY2FyZHMuc3BsaWNlKG4sIDEpWzBdIDogbnVsbDtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5pbnNlcnQgPSBmdW5jdGlvbiAoY2FyZCwgcG9zKXtcclxuICAgICAgICBpZiAoY2FyZCA9PT0gbnVsbCl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGk7XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGNhcmQgPT09IHRoaXMuY2FyZHNbaV0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FyZHMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwb3MgPiB0aGlzLmNhcmRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmNhcmRzLnB1c2goY2FyZCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jYXJkcy5zcGxpY2UocG9zLCAwLCBjYXJkKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5hZGRUb3AgPSBmdW5jdGlvbiAoY2FyZCkge1xyXG4gICAgICAgIGlmKGNhcmQgPT09IG51bGwpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW5zZXJ0KGNhcmQsIDApO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmFkZEJvdHRvbSA9IGZ1bmN0aW9uIChjYXJkKSB7XHJcbiAgICAgICAgdGhpcy5pbnNlcnQoY2FyZCwgdGhpcy5jYXJkcy5sZW5ndGggLSAxKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5maW5kID0gZnVuY3Rpb24gKGNhcmRSYW5rLCBjYXJkU3VpdCkge1xyXG4gICAgICAgIHZhciBpLCBjYXJkO1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgY2FyZCA9IHRoaXMuY2FyZHNbaV07XHJcbiAgICAgICAgICAgIGlmIChjYXJkLnJhbmsgPT09IGNhcmRSYW5rICYmIGNhcmQuc3VpdCA9PT0gY2FyZFN1aXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5wdWxsID0gZnVuY3Rpb24gKGNhcmRSYW5rLCBjYXJkU3VpdCkge1xyXG4gICAgICAgIHZhciBpZHggPSB0aGlzLmZpbmQoY2FyZFJhbmssIGNhcmRTdWl0KTtcclxuICAgICAgICByZXR1cm4gaWR4ID49IDAgPyB0aGlzLnRha2UoaWR4KSA6IG51bGw7XHJcbiAgICB9O1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEZWNrO1xyXG4vKlxyXG4oZnVuY3Rpb24gKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciByb290ID0gdHlwZW9mIHNlbGYgPT09IFwib2JqZWN0XCIgJiYgc2VsZi5zZWxmID09PSBzZWxmICYmIHNlbGYgfHxcclxuICAgICAgICAgICAgdHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIiAmJiBnbG9iYWwuZ2xvYmFsID09PSBnbG9iYWwgJiYgZ2xvYmFsIHx8XHJcbiAgICAgICAgICAgIHRoaXM7XHJcbiAgICAvLyBOb2RlLmpzXHJcbiAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiBtb2R1bGUuZXhwb3J0cykge1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gRGVjaztcclxuICAgIH1cclxuICAgIC8vIEFNRCAvIFJlcXVpcmVKU1xyXG4gICAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcclxuICAgICAgICBkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIERlY2s7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvLyBpbmNsdWRlZCBkaXJlY3RseSB2aWEgPHNjcmlwdD4gdGFnXHJcbiAgICBlbHNlIHtcclxuICAgICAgICByb290LkRlY2sgPSBEZWNrO1xyXG4gICAgfVxyXG59KSgpO1xyXG4qL1xyXG4iLCIvKiBleHBvcnRlZCBIYW5kICovXHJcbi8qZXNsaW50IGdsb2JhbC1zdHJpY3Q6MCwgbm8td3JhcC1mdW5jOjAsIG5vLWVtcHR5LWNsYXNzOjAsIG5vLWV4dHJhLXN0cmljdDowICovXHJcbnZhciBDYXJkID0gcmVxdWlyZShcIi4vY2FyZC5qc1wiKTtcclxuXHJcblxyXG5mdW5jdGlvbiBIYW5kKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHRoaXMuY2FyZHMgPSBbXTtcclxufVxyXG5cclxuSGFuZC5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKG5ld0NhcmRzKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IG5ld0NhcmRzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICB0aGlzLmNhcmRzLnB1c2gobmV3Q2FyZHNbaV0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcbkhhbmQucHJvdG90eXBlLmFkZENhcmQgPSBmdW5jdGlvbihjYXJkKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdGhpcy5jYXJkcy5wdXNoKGNhcmQpO1xyXG59O1xyXG5cclxuSGFuZC5wcm90b3R5cGUuY291bnQgPSBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgcmV0dXJuIHRoaXMuY2FyZHMubGVuZ3RoO1xyXG59O1xyXG5cclxuSGFuZC5wcm90b3R5cGUuZ2V0Q2FyZHMgPSBmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICByZXR1cm4gdGhpcy5jYXJkcztcclxufTtcclxuXHJcbkhhbmQucHJvdG90eXBlLmlzRmx1c2ggPSBmdW5jdGlvbiAoKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgaWYgKHRoaXMuY2FyZHMubGVuZ3RoIDwgMSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHZhciBzdWl0ID0gdGhpcy5jYXJkc1swXS5zdWl0O1xyXG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICBpZihzdWl0ICE9PSB0aGlzLmNhcmRzW2ldLnN1aXQpe1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG5cclxuSGFuZC5wcm90b3R5cGUuZ2V0UmFua3MgPSBmdW5jdGlvbigpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgdmFyIGk7XHJcbiAgICB2YXIgcmFua3MgPSBbXTtcclxuICAgIGlmKCF0aGlzLmNhcmRzKXtcclxuICAgICAgICByZXR1cm4gcmFua3M7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIHZhciByYW5rID0gdGhpcy5jYXJkc1tpXS5nZXRSYW5rKCk7XHJcbiAgICAgICAgaWYoIXJhbmtzW3JhbmtdKXtcclxuICAgICAgICAgICAgcmFua3NbcmFua10gPSAxO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByYW5rc1tyYW5rXSsrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByYW5rcztcclxufTtcclxuXHJcbkhhbmQucHJvdG90eXBlLmdldFJ1bnMgPSBmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgcnVuTGVuZ3RoID0gMCwgcnVuQ291bnQgPSAxLCBsYXN0UmFuazsgIC8vZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gICAgdmFyIHJhbmtzID0gdGhpcy5nZXRSYW5rcygpO1xyXG4gICAgdmFyIHJ1bnMgPSBbXTtcclxuICAgIGlmKHJhbmtzLmxlbmd0aCA9PT0gMCl7XHJcbiAgICAgICAgcmV0dXJuIHJ1bnM7XHJcbiAgICB9XHJcblxyXG4gICAgLy9UT0RPOiBGbGV4aWJsZSBhY2UgdmFsdWVcclxuICAgIENhcmQuZ2V0UmFua3MoKS5mb3JFYWNoKGZ1bmN0aW9uIChyYW5rKSB7XHJcbiAgICAgICAgLy9pbiBhIHJ1biwgc2F2ZSBpbmZvXHJcbiAgICAgICAgaWYocmFua3NbcmFua10pe1xyXG4gICAgICAgICAgICBydW5MZW5ndGgrKztcclxuICAgICAgICAgICAgcnVuQ291bnQgKj0gcmFua3NbcmFua107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIC8vc2F2ZSB0aGUgcnVuXHJcbiAgICAgICAgICAgIGlmKHJ1bkxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICAgICAgaWYoIXJ1bnNbcnVuTGVuZ3RoXSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBydW5zW3J1bkxlbmd0aF0gPSB7fTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJ1bnNbcnVuTGVuZ3RoXVtsYXN0UmFua10gPSBydW5Db3VudDtcclxuICAgICAgICAgICAgICAgIHJ1bkxlbmd0aCA9IDA7IHJ1bkNvdW50ID0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBsYXN0UmFuayA9IHJhbms7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvL3NhdmUgYW55IHJ1biB0aGF0IHRvcHMgb3V0XHJcbiAgICBpZihydW5MZW5ndGggPiAwKXtcclxuICAgICAgICBpZighcnVuc1tydW5MZW5ndGhdKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcnVuc1tydW5MZW5ndGhdID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJ1bnNbcnVuTGVuZ3RoXVtsYXN0UmFua10gPSBydW5Db3VudDtcclxuICAgICAgICBydW5MZW5ndGggPSAwOyBydW5Db3VudCA9IDE7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcnVucztcclxufTtcclxuXHJcbkhhbmQucHJvdG90eXBlLmZpbmRDb21wb25lbnRTdW1zID0gZnVuY3Rpb24odGFyZ2V0LCB2YWx1ZXMpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICByZXR1cm4gdGhpcy5maW5kQ29tcG9uZW50U3Vtc1JlY3Vyc2l2ZSh0YXJnZXQsIHZhbHVlcywgMCk7XHJcbn07XHJcblxyXG5IYW5kLnByb3RvdHlwZS5maW5kQ29tcG9uZW50U3Vtc1JlY3Vyc2l2ZSA9IGZ1bmN0aW9uKHRhcmdldCwgdmFsdWVzLCBzdGFydCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBzdW1zID0gMDtcclxuICAgIHZhciB2YWwsIGk7XHJcbiAgICBmb3IoaSA9IHN0YXJ0OyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICB2YWwgPSB2YWx1ZXNbaV07XHJcbiAgICAgICAgaWYodmFsID4gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdW1zO1xyXG4gICAgICAgIH1lbHNlIGlmKHZhbCA9PT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHN1bXMrKztcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIHN1bXMgKz0gdGhpcy5maW5kQ29tcG9uZW50U3Vtc1JlY3Vyc2l2ZSh0YXJnZXQgLSB2YWwsIHZhbHVlcywgaSArIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBzdW1zO1xyXG59O1xyXG5cclxuSGFuZC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICByZXR1cm4gdGhpcy5jYXJkcy5tYXAoZnVuY3Rpb24oY2FyZCl7IHJldHVybiBjYXJkLnNob3J0TmFtZSgpOyB9KS50b1N0cmluZygpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIYW5kO1xyXG4vKlxyXG4oZnVuY3Rpb24gKCl7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciByb290ID0gdHlwZW9mIHNlbGYgPT09IFwib2JqZWN0XCIgJiYgc2VsZi5zZWxmID09PSBzZWxmICYmIHNlbGYgfHxcclxuICAgICAgICAgICAgdHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIiAmJiBnbG9iYWwuZ2xvYmFsID09PSBnbG9iYWwgJiYgZ2xvYmFsIHx8XHJcbiAgICAgICAgICAgIHRoaXM7XHJcbiAgICAvLyBOb2RlLmpzXHJcbiAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiBtb2R1bGUuZXhwb3J0cykge1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gSGFuZDtcclxuICAgIH1cclxuICAgIC8vIEFNRCAvIFJlcXVpcmVKU1xyXG4gICAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcclxuICAgICAgICBkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEhhbmQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvLyBpbmNsdWRlZCBkaXJlY3RseSB2aWEgPHNjcmlwdD4gdGFnXHJcbiAgICBlbHNlIHtcclxuICAgICAgICByb290LkhhbmQgPSBIYW5kO1xyXG4gICAgfVxyXG59KSgpO1xyXG4qL1xyXG4iLCIvKmVzbGludC1lbnYgbW9jaGEgKi9cbi8qZXNsaW50IGdsb2JhbC1zdHJpY3Q6MCwgbm8td3JhcC1mdW5jOjAsIG5vLWVtcHR5LWNsYXNzOjAsIG5vLWV4dHJhLXN0cmljdDowICovXG4vKiBnbG9iYWwgc2hvdWxkICovXG5cbi8qXG5kZWZpbmUoZnVuY3Rpb24ocmVxdWlyZSkge1xuICAgIHZhciBDYXJkID0gcmVxdWlyZShcInNjcmlwdHMvY2FyZC5qc1wiKTtcbiAgICB2YXIgRGVjayA9IHJlcXVpcmUoXCJzY3JpcHRzL2RlY2suanNcIik7XG4gICAgY29uc29sZS5sb2coXCJIZWxsbyB3b3JsZCFcIik7XG59KTsqL1xuXG52YXIgQ2FyZCA9IHJlcXVpcmUoXCJjYXJkLmpzXCIpO1xudmFyIERlY2sgPSByZXF1aXJlKFwiZGVjay5qc1wiKTtcbnZhciBDcmliYmFnZUhhbmQgPSByZXF1aXJlKFwiY3JpYmJhZ2UtaGFuZC5qc1wiKTtcbnZhciBDcmliYmFnZURlYWwgPSByZXF1aXJlKFwiY3JpYmJhZ2UtZGVhbC5qc1wiKTtcblxuKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBkZXNjcmliZShcIkNhcmRzXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaXQoXCJzaG91bGQgaGF2ZSB0aGUgY29ycmVjdCByYW5rIG9yZGVyXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgcmFua0xpc3QgPSBDYXJkLmdldFJhbmtzKCk7XG4gICAgICAgICAgICByYW5rTGlzdFswXS5zaG91bGQuZXF1YWwoXCJBXCIpO1xuICAgICAgICAgICAgcmFua0xpc3RbMV0uc2hvdWxkLmVxdWFsKFwiMlwiKTtcbiAgICAgICAgICAgIHJhbmtMaXN0WzJdLnNob3VsZC5lcXVhbChcIjNcIik7XG4gICAgICAgICAgICByYW5rTGlzdFszXS5zaG91bGQuZXF1YWwoXCI0XCIpO1xuICAgICAgICAgICAgcmFua0xpc3RbNF0uc2hvdWxkLmVxdWFsKFwiNVwiKTtcbiAgICAgICAgICAgIHJhbmtMaXN0WzVdLnNob3VsZC5lcXVhbChcIjZcIik7XG4gICAgICAgICAgICByYW5rTGlzdFs2XS5zaG91bGQuZXF1YWwoXCI3XCIpO1xuICAgICAgICAgICAgcmFua0xpc3RbN10uc2hvdWxkLmVxdWFsKFwiOFwiKTtcbiAgICAgICAgICAgIHJhbmtMaXN0WzhdLnNob3VsZC5lcXVhbChcIjlcIik7XG4gICAgICAgICAgICByYW5rTGlzdFs5XS5zaG91bGQuZXF1YWwoXCJUXCIpO1xuICAgICAgICAgICAgcmFua0xpc3RbMTBdLnNob3VsZC5lcXVhbChcIkpcIik7XG4gICAgICAgICAgICByYW5rTGlzdFsxMV0uc2hvdWxkLmVxdWFsKFwiUVwiKTtcbiAgICAgICAgICAgIHJhbmtMaXN0WzEyXS5zaG91bGQuZXF1YWwoXCJLXCIpO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoXCJzaG91bGQgaGF2ZSB0aGUgY29ycmVjdCBzdWl0IG9yZGVyXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgc3VpdExpc3QgPSBDYXJkLmdldFN1aXRzKCk7XG4gICAgICAgICAgICBzdWl0TGlzdFswXS5zaG91bGQuZXF1YWwoXCJDXCIpO1xuICAgICAgICAgICAgc3VpdExpc3RbMV0uc2hvdWxkLmVxdWFsKFwiRFwiKTtcbiAgICAgICAgICAgIHN1aXRMaXN0WzJdLnNob3VsZC5lcXVhbChcIkhcIik7XG4gICAgICAgICAgICBzdWl0TGlzdFszXS5zaG91bGQuZXF1YWwoXCJTXCIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiRGVja1wiLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgZGVzY3JpYmUoXCJCYXNpY1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVjayA9IG5ldyBEZWNrKCk7XG4gICAgICAgICAgICBpdChcInNob3VsZCBoYXZlIDUyIGNhcmRzXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBkZWNrLmNvdW50KCkuc2hvdWxkLmVxdWFsKDUyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaXQoXCJzaG91bGQgc3RhcnQgd2l0aCB0aGUgQWNlIG9mIENsdWJzXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBkZWNrLnBlZWsoMCkuc2hvcnROYW1lKCkuc2hvdWxkLmVxdWFsKFwiQUNcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRlc2NyaWJlKFwiVGFraW5nIGEgY2FyZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGVjayA9IG5ldyBEZWNrKCk7XG4gICAgICAgICAgICB2YXIgY2FyZCA9IGRlY2sudGFrZSgzNCk7XG4gICAgICAgICAgICBpdChcInNob3VsZCBoYXZlIHRoZSAzNXRoIGNhcmQgYmUgdGhlIE5pbmUgb2YgSGVhcnRzXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjYXJkLnNob3VsZC5ub3QuZXF1YWwobnVsbCk7XG4gICAgICAgICAgICAgICAgY2FyZC5zaG9ydE5hbWUoKS5zaG91bGQuZXF1YWwoXCI5SFwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaXQoXCJzaG91bGQgYmUgNTEgY2FyZHMgYWZ0ZXIgcmVtb3ZpbmcgdGhlIDM1dGggY2FyZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZGVjay5jb3VudCgpLnNob3VsZC5lcXVhbCg1MSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGl0KFwic2hvdWxkIGJlIHBvc3NpYmxlIHRvIHB1dCB0aGUgTmluZSBvZiBIZWFydHMgYmFjayBpbiB0aGUgMTh0aCBwb3NpdGlvbiBpbiB0aGUgZGVja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZGVjay5pbnNlcnQoY2FyZCwgMTcpO1xuICAgICAgICAgICAgICAgIGRlY2sucGVlaygxNykuc2hvcnROYW1lKCkuc2hvdWxkLmVxdWFsKFwiOUhcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGl0KFwic2hvdWxkIGJlIDUyIGNhcmRzIGFmdGVyIGFkZGluZyB0aGUgY2FyZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZGVjay5jb3VudCgpLnNob3VsZC5lcXVhbCg1Mik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGl0KFwic2hvdWxkIG1vdmUgYSBjYXJkIHdoZW4gcmUtYWRkaW5nIHRoZSBzYW1lIGNhcmRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGRlY2suaW5zZXJ0KGNhcmQsIDM0KTtcbiAgICAgICAgICAgICAgICBkZWNrLmNvdW50KCkuc2hvdWxkLmVxdWFsKDUyKTtcbiAgICAgICAgICAgICAgICBkZWNrLnBlZWsoMTcpLnNob3J0TmFtZSgpLnNob3VsZC5lcXVhbChcIjVEXCIpO1xuICAgICAgICAgICAgICAgIGRlY2sucGVlaygzNCkuc2hvcnROYW1lKCkuc2hvdWxkLmVxdWFsKFwiOUhcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRlc2NyaWJlKFwiUHVsbGluZyBhIGNhcmRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNhcmQ7XG4gICAgICAgICAgICB2YXIgZGVjayA9IG5ldyBEZWNrKCk7XG4gICAgICAgICAgICBpdChcIlRoZSBUd28gb2YgRGlhbW9uZHMgc2hvdWxkIGJlIHRoZSAxNXRoIGNhcmRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGRlY2suZmluZChcIjJcIiwgXCJEXCIpLnNob3VsZC5lcXVhbCgxNCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGl0KFwic2hvdWxkIGJlIHBvc3NpYmxlIHRvIHJlbW92ZSB0aGUgVGhyZWUgb2YgQ2x1YnNcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNhcmQgPSBkZWNrLnB1bGwoXCIzXCIsIFwiQ1wiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaXQoXCJzaG91bGQgYmUgNTEgY2FyZHMgYWZ0ZXIgcmVtb3ZpbmcgdGhlIFRocmVlIG9mIENsdWJzXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBkZWNrLmNvdW50KCkuc2hvdWxkLmVxdWFsKDUxKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaXQoXCJzaG91bGQgbm90IGJlIHBvc3NpYmxlIHRvIHJlbW92ZSB0aGUgVGhyZWUgb2YgQ2x1YnMgYWdhaW5cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNob3VsZC5ub3QuZXhpc3QoZGVjay5wdWxsKFwiM1wiLCBcIkNcIikpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpdChcInNob3VsZCBiZSBwb3NzaWJsZSBhZGQgdGhlIFRocmVlIG9mIENsdWJzIHRvIHRoZSB0b3Agb2YgdGhlIGRlY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGRlY2suYWRkVG9wKGNhcmQpO1xuICAgICAgICAgICAgICAgIGRlY2suY291bnQoKS5zaG91bGQuZXF1YWwoNTIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKFwiU2h1ZmZsaW5nXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWNrID0gbmV3IERlY2soKTtcbiAgICAgICAgICAgIGl0KFwic2hvdWxkIGJlIHRoZSBzYW1lIG51bWJlciBvZiBjYXJkcyBhZnRlciBzaHVmZmxpbmdcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGRlY2suc2h1ZmZsZSgpO1xuICAgICAgICAgICAgICAgIGRlY2suY291bnQoKS5zaG91bGQuZXF1YWwoNTIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJIYW5kc1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRlc2NyaWJlKFwiQUgsIEFDLCBBRCwgS1MsIEtEXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWNrID0gbmV3IERlY2soKTtcbiAgICAgICAgICAgIHZhciBoYW5kID0gbmV3IENyaWJiYWdlSGFuZCgpO1xuICAgICAgICAgICAgaGFuZC5hZGRDYXJkKGRlY2sucHVsbChcIkFcIiwgXCJIXCIpKTtcbiAgICAgICAgICAgIGhhbmQuYWRkQ2FyZChkZWNrLnB1bGwoXCJBXCIsIFwiQ1wiKSk7XG4gICAgICAgICAgICBoYW5kLmFkZENhcmQoZGVjay5wdWxsKFwiQVwiLCBcIkRcIikpO1xuICAgICAgICAgICAgaGFuZC5hZGRDYXJkKGRlY2sucHVsbChcIktcIiwgXCJTXCIpKTtcbiAgICAgICAgICAgIGhhbmQuYWRkQ2FyZChkZWNrLnB1bGwoXCJLXCIsIFwiRFwiKSk7XG4gICAgICAgICAgICB2YXIgcmFua3MgPSBoYW5kLmdldFJhbmtzKCk7XG5cbiAgICAgICAgICAgIGl0KFwic2hvdWxkIGhhdmUgZml2ZSBjYXJkc1wiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGhhbmQuY291bnQoKS5zaG91bGQuZXF1YWwoNSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGl0KFwic2hvdWxkIGhhdmUgMyBhY2VzIGFuZCAyIGtpbmdzXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgcmFua3Muc2hvdWxkLmhhdmUua2V5cyhcIkFcIiwgXCJLXCIpO1xuICAgICAgICAgICAgICAgIHJhbmtzLkEuc2hvdWxkLmVxdWFsKDMpO1xuICAgICAgICAgICAgICAgIHJhbmtzLksuc2hvdWxkLmVxdWFsKDIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpdChcInNob3VsZCBoYXZlIG5vIGZpZnRlZW5zXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaGFuZC5udW1GaWZ0ZWVucygpLnNob3VsZC5lcXVhbCgwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaXQoXCJzaG91bGQgaGF2ZSBlaWdodCBwb2ludHNcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBoYW5kLmNvdW50UG9pbnRzKCkuc2hvdWxkLmVxdWFsKDgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKFwiMkgsIDNDLCAzRCwgNFMsIDdEXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWNrID0gbmV3IERlY2soKTtcbiAgICAgICAgICAgIHZhciBoYW5kID0gbmV3IENyaWJiYWdlSGFuZCgpO1xuICAgICAgICAgICAgaGFuZC5hZGRDYXJkKGRlY2sucHVsbChcIjJcIiwgXCJIXCIpKTtcbiAgICAgICAgICAgIGhhbmQuYWRkQ2FyZChkZWNrLnB1bGwoXCIzXCIsIFwiQ1wiKSk7XG4gICAgICAgICAgICBoYW5kLmFkZENhcmQoZGVjay5wdWxsKFwiM1wiLCBcIkRcIikpO1xuICAgICAgICAgICAgaGFuZC5hZGRDYXJkKGRlY2sucHVsbChcIjRcIiwgXCJTXCIpKTtcbiAgICAgICAgICAgIGhhbmQuYWRkQ2FyZChkZWNrLnB1bGwoXCI3XCIsIFwiRFwiKSk7XG5cbiAgICAgICAgICAgIHZhciBydW5zID0gaGFuZC5nZXRSdW5zKCk7XG4gICAgICAgICAgICBpdChcInNob3VsZCBoYXZlIHJ1bnMgb2YgbGVuZ3RoIDMgYW5kIDFcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBydW5zLnNob3VsZC5oYXZlLmtleXMoXCIzXCIsIFwiMVwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaXQoXCJzaG91bGQgaGF2ZSB0aGUgcnVucyBvZiB0aHJlZSB0ZXJtaW5hdGUgYXQgNCBhbmQgdGhlIHJ1bnMgb2Ygb25lIHRlcm1pbmF0ZSBhdCA3XCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgcnVuc1szXS5zaG91bGQuaGF2ZS5rZXlzKFwiNFwiKTtcbiAgICAgICAgICAgICAgICBydW5zWzNdWzRdLnNob3VsZC5lcXVhbCgyKTtcbiAgICAgICAgICAgICAgICBydW5zWzFdLnNob3VsZC5oYXZlLmtleXMoXCI3XCIpO1xuICAgICAgICAgICAgICAgIHJ1bnNbMV1bN10uc2hvdWxkLmVxdWFsKDEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpdChcInNob3VsZCBoYXZlIG9uZSBmaWZ0ZWVuXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaGFuZC5udW1GaWZ0ZWVucygpLnNob3VsZC5lcXVhbCgxKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaXQoXCJzaG91bGQgaGF2ZSB0ZW4gcG9pbnRzXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaGFuZC5jb3VudFBvaW50cygpLnNob3VsZC5lcXVhbCgxMCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgICAgIGRlc2NyaWJlKFwiNEgsIDVDLCA1RCwgNlMsIDZIXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWNrID0gbmV3IERlY2soKTtcbiAgICAgICAgICAgIHZhciBoYW5kID0gbmV3IENyaWJiYWdlSGFuZCgpO1xuICAgICAgICAgICAgaGFuZC5hZGRDYXJkKGRlY2sucHVsbChcIjRcIiwgXCJIXCIpKTtcbiAgICAgICAgICAgIGhhbmQuYWRkQ2FyZChkZWNrLnB1bGwoXCI1XCIsIFwiQ1wiKSk7XG4gICAgICAgICAgICBoYW5kLmFkZENhcmQoZGVjay5wdWxsKFwiNVwiLCBcIkRcIikpO1xuICAgICAgICAgICAgaGFuZC5hZGRDYXJkKGRlY2sucHVsbChcIjZcIiwgXCJTXCIpKTtcbiAgICAgICAgICAgIGhhbmQuYWRkQ2FyZChkZWNrLnB1bGwoXCI2XCIsIFwiSFwiKSk7XG5cbiAgICAgICAgICAgIHZhciBydW5zID0gaGFuZC5nZXRSdW5zKCk7XG5cbiAgICAgICAgICAgIGl0KFwic2hvdWxkIGhhdmUgZm91ciBydW5zIG9mIGxlbmd0aCAzXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgcnVucy5zaG91bGQuaGF2ZS5rZXlzKFwiM1wiKTtcbiAgICAgICAgICAgICAgICBydW5zWzNdLnNob3VsZC5oYXZlLmtleXMoXCI2XCIpO1xuICAgICAgICAgICAgICAgIHJ1bnNbM11bNl0uc2hvdWxkLmVxdWFsKDQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGl0KFwic2hvdWxkIG5vdCBiZSBhIGZsdXNoXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICBoYW5kLmlzRmx1c2goKS5zaG91bGQuZXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpdChcInNob3VsZCBoYXZlIGZvdXIgZmlmdGVlbnNcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBoYW5kLm51bUZpZnRlZW5zKCkuc2hvdWxkLmVxdWFsKDQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpdChcInNob3VsZCBoYXZlIDI0IHBvaW50c1wiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGhhbmQuY291bnRQb2ludHMoKS5zaG91bGQuZXF1YWwoMjQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKFwiMkgsIDRILCA1SCwgN0gsIEFIXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWNrID0gbmV3IERlY2soKTtcbiAgICAgICAgICAgIHZhciBoYW5kID0gbmV3IENyaWJiYWdlSGFuZCgpO1xuICAgICAgICAgICAgaGFuZC5hZGRDYXJkKGRlY2sucHVsbChcIjJcIiwgXCJIXCIpKTtcbiAgICAgICAgICAgIGhhbmQuYWRkQ2FyZChkZWNrLnB1bGwoXCI0XCIsIFwiSFwiKSk7XG4gICAgICAgICAgICBoYW5kLmFkZENhcmQoZGVjay5wdWxsKFwiNVwiLCBcIkhcIikpO1xuICAgICAgICAgICAgaGFuZC5hZGRDYXJkKGRlY2sucHVsbChcIjdcIiwgXCJIXCIpKTtcbiAgICAgICAgICAgIGhhbmQuYWRkQ2FyZChkZWNrLnB1bGwoXCJBXCIsIFwiSFwiKSk7XG5cbiAgICAgICAgICAgIGl0KFwic2hvdWxkIGJlIGEgZmx1c2hcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBoYW5kLmlzRmx1c2goKS5zaG91bGQuZXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGl0KFwic2hvdWxkIGhhdmUgb25lIGZpZnRlZW5cIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBoYW5kLm51bUZpZnRlZW5zKCkuc2hvdWxkLmVxdWFsKDEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpdChcInNob3VsZCBoYXZlIHNldmVuIHBvaW50c1wiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGhhbmQuY291bnRQb2ludHMoKS5zaG91bGQuZXF1YWwoNyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoXCIySCwgNEgsIDVILCA2SDsgdHVybjogOUhcIiwgZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICB2YXIgZGVjayA9IG5ldyBEZWNrKCk7XG4gICAgICAgICAgICB2YXIgaGFuZCA9IG5ldyBDcmliYmFnZUhhbmQoKTtcbiAgICAgICAgICAgIGhhbmQuYWRkQ2FyZChkZWNrLnB1bGwoXCIyXCIsIFwiSFwiKSk7XG4gICAgICAgICAgICBoYW5kLmFkZENhcmQoZGVjay5wdWxsKFwiNFwiLCBcIkhcIikpO1xuICAgICAgICAgICAgaGFuZC5hZGRDYXJkKGRlY2sucHVsbChcIjVcIiwgXCJIXCIpKTtcbiAgICAgICAgICAgIGhhbmQuYWRkQ2FyZChkZWNrLnB1bGwoXCI2XCIsIFwiSFwiKSk7XG4gICAgICAgICAgICBpdChcInNob3VsZCBiZSAxNCBwb2ludHNcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBoYW5kLmNvdW50UG9pbnRzKGRlY2sucHVsbChcIjlcIiwgXCJIXCIpKS5zaG91bGQuZXF1YWwoMTQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKFwiMkgsIEpILCBLSCwgM1M7IHR1cm46IDNIXCIsIGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgdmFyIGRlY2sgPSBuZXcgRGVjaygpO1xuICAgICAgICAgICAgdmFyIGhhbmQgPSBuZXcgQ3JpYmJhZ2VIYW5kKCk7XG4gICAgICAgICAgICBoYW5kLmFkZENhcmQoZGVjay5wdWxsKFwiMlwiLCBcIkhcIikpO1xuICAgICAgICAgICAgaGFuZC5hZGRDYXJkKGRlY2sucHVsbChcIkpcIiwgXCJIXCIpKTtcbiAgICAgICAgICAgIGhhbmQuYWRkQ2FyZChkZWNrLnB1bGwoXCJLXCIsIFwiSFwiKSk7XG4gICAgICAgICAgICBoYW5kLmFkZENhcmQoZGVjay5wdWxsKFwiM1wiLCBcIlNcIikpO1xuICAgICAgICAgICAgaXQoXCJzaG91bGQgYmUgNyBwb2ludHNcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBoYW5kLmNvdW50UG9pbnRzKGRlY2sucHVsbChcIjNcIiwgXCJIXCIpKS5zaG91bGQuZXF1YWwoNyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcIkNyaWJiYWdlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGVzY3JpYmUoXCJBSCwgQUMsIEFELCBLUywgS0QsIFFTXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWNrID0gbmV3IERlY2soKTtcbiAgICAgICAgICAgIHZhciBkZWFsID0gbmV3IENyaWJiYWdlRGVhbChbXG4gICAgICAgICAgICAgICAgZGVjay5wdWxsKFwiQVwiLCBcIkhcIiksXG4gICAgICAgICAgICAgICAgZGVjay5wdWxsKFwiQVwiLCBcIkNcIiksXG4gICAgICAgICAgICAgICAgZGVjay5wdWxsKFwiQVwiLCBcIkRcIiksXG4gICAgICAgICAgICAgICAgZGVjay5wdWxsKFwiS1wiLCBcIlNcIiksXG4gICAgICAgICAgICAgICAgZGVjay5wdWxsKFwiS1wiLCBcIkRcIiksXG4gICAgICAgICAgICAgICAgZGVjay5wdWxsKFwiUVwiLCBcIlNcIilcbiAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICBkZWFsLmhhbmRQb2ludHMoKTtcbiAgICAgICAgICAgIGl0KFwic2hvdWxkIGJlIGEgZGVhbFwiLCBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkoKTtcblxuIl19
