/*eslint global-strict:0, no-wrap-func:0, no-empty-class:0, no-extra-strict:0 */
var CribbageHand = require("./app/scripts/cribbage-hand.js");
var Deck = require("./app/scripts/deck.js");
var storage = require("node-persist");

var deck = new Deck();
var crib, crib1, crib2;
//storage.initSync();
var results = {};
for(var c1 = 0; c1 < deck.count() - 1; c1++){
    for(var c2 = c1 + 1; c2 < deck.count(); c2++){
        crib2 = deck.take(c2);
        crib1 = deck.take(c1);
        crib = [crib1, crib2];
        evaluateCrib(deck, crib);
        //results[crib1.shortName() + crib2.shortName()] = evaluateCrib(deck, crib);
        //storage.setItem("crib", results);
        deck.insert(crib1, c1);
        deck.insert(crib2, c2);

    }
}

function evaluateCrib(deck, crib){
    "use strict";
    var cards = deck.cards;
    var min = 9999, max = 0;
    var points, key;
    var index = [];

    //calculate points
    var c3, c4, t0;
    for(c3 = 0; c3 < cards.length - 1; c3++){
        for(c4 = c3 + 1; c4 < cards.length; c4++){
            crib[2] = cards[c3];
            crib[3] = cards[c4];
            var hand = new CribbageHand();
            hand.initialize(crib);
            for(t0 = 0; t0 < cards.length; t0++){
                if(t0 === c3 || t0 === c4){
                    continue;
                }
                points = hand.countPoints(cards[t0]);
                key = Math.pow(2, t0) + Math.pow(2, c3) + Math.pow(2, c4);
                index[key] = points;
            }
        }
    }

    var pointCount, handCount;
    for(var p1 = 0; p1 < cards.length - 3; p1++){
        for (var p2 = p1 + 1; p2 < cards.length - 2; p2++){
            for (var p3 = p2 + 1; p3 < cards.length - 1; p3++){
                for (var p4 = p3 + 1; p4 < cards.length; p4++){

                    pointCount = 0; handCount = 0;
                    for(c3 = 0; c3 < cards.length - 1; c3++){
                        if (c3 === p1 || c3 === p2 || c3 === p3 || c3 === p4){
                            continue;
                        }
                        for(c4 = c3 + 1; c4 < cards.length; c4++){
                            if (c4 === p1 || c4 === p2 || c4 === p3 || c4 === p4){
                                continue;
                            }
                            for(t0 = 0; t0 < cards.length; t0++){
                                if(t0 === c3 || t0 === c4){
                                    continue;
                                }
                                if (t0 === p1 || t0 === p2 || t0 === p3 || t0 === p4){
                                    continue;
                                }
                                pointCount += index[Math.pow(2, c3) + Math.pow(2, c4) + Math.pow(2, t0)];
                                handCount++;
                            }
                        }
                    }
                    points = pointCount / handCount;
                    if(points < min){
                        min = points;
                    }
                    if(points > max){
                        max = points;
                    }
                    console.log(min + "/" + max);
                }
            }
        }
    }
    console.log({
        min: min,
        max: max
    });

}


    /*
    var min = 999, max = 0;
    var pullCount = 0, evalCount, pointCount, points;
    for(var p1 = 0; p1 < cards.length - 3; p1++){
        for (var p2 = p1 + 1; p2 < cards.length - 2; p2++){
            for (var p3 = p2 + 1; p3 < cards.length - 1; p3++){
                for (var p4 = p3 + 1; p4 < cards.length; p4++){
                    pullCount++;
                    pointCount = 0; evalCount = 0;
                    for(var c0 = 0; c0 < cards.length - 1; c0++){
                        if(c0 === p1 || c0 === p2 || c0 === p3 || c0 === p4){
                            continue;
                        }
                        for(var c1 = c0 + 1; c1 < cards.length; c1++){
                            if(c1 === p1 || c1 === p2 || c1 === p3 || c1 === p4){
                                continue;
                            }
                            crib[2] = cards[c0];
                            crib[3] = cards[c1];
                            var hand = new CribbageHand();
                            hand.initialize(crib);

                            for(var t0 = 0; t0 < cards.length; t0++){
                                if(t0 === p1 || t0 === p2 || t0 === p3 || t0 === p4){
                                    continue;
                                }
                                if(t0 === c0 || t0 === c1){
                                    continue;
                                }
                                pointCount += hand.countPoints(cards[t0]);
                                evalCount++;
                            }

                        }
                    }
                    points = pointCount / evalCount;
                    if(points < min){
                        min = points;
                    }
                    if(points > max){
                        max = points;
                    }

                }
            }
        }
    }*/
