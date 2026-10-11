const test = require("node:test");
const assert = require("node:assert/strict");
const cards = require("../veiled-dominion-cards.js");

test("registry contains exactly 52 uniquely identified cards", () => {
  assert.equal(cards.length, 52);
  assert.equal(new Set(cards.map((card) => card.id)).size, 52);
});

test("each suit has four universal face cards and nine numbered cards", () => {
  for (const suit of ["Spades", "Hearts", "Diamonds", "Clubs"]) {
    const inSuit = cards.filter((card) => card.suit === suit);
    assert.equal(inSuit.length, 13, suit);
    assert.equal(inSuit.filter((card) => card.kind === "face").length, 4, suit);
    assert.deepEqual(
      inSuit.filter((card) => card.kind === "pip").map((card) => card.rank).sort((a, b) => a - b),
      [2, 3, 4, 5, 6, 7, 8, 9, 10],
      suit
    );
  }
});

test("face-card text is universal across all suits", () => {
  for (const rank of ["J", "Q", "K", "A"]) {
    const copies = cards.filter((card) => card.rank === rank);
    assert.equal(copies.length, 4, rank);
    assert.equal(new Set(copies.map((card) => card.name)).size, 1, rank);
    assert.equal(new Set(copies.map((card) => card.rulesText)).size, 1, rank);
  }
});

test("every record points back to the approved text database and has no executable effect", () => {
  for (const card of cards) {
    assert.equal(card.source, "CARD-TEXT-DATABASE.md");
    assert.equal(typeof card.rulesText, "string");
    assert.ok(card.rulesText.length > 0);
    assert.equal(Object.hasOwn(card, "resolve"), false);
    assert.equal(Object.hasOwn(card, "effectHandler"), false);
  }
});

test("critical card text preserves unresolved rules rather than assuming mechanics", () => {
  const get = (id) => cards.find((card) => card.id === id);
  assert.match(get("spades-6").rulesText, /block card must exceed this value, not just match it/);
  assert.match(get("clubs-10").rulesText, /Full block guaranteed regardless of attack value/);
  assert.match(get("spades-7").rulesText, /confirmation dice roll/);
  assert.match(get("hearts-10").rulesText, /from this phase/);
  assert.match(get("diamonds-6").rulesText, /hidden chess piece's location/);
});
