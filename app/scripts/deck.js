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
