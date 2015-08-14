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

