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
