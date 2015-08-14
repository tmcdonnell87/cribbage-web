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
