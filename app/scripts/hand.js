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
