import assert from "node:assert/strict";
import test from "node:test";
import { MENU, SPECIAL_PACKS, bestMix } from "../src/data/menu.ts";

const greenhouse = MENU.find((category) => category.id === "greenhouse");
const outdoor = MENU.find((category) => category.id === "outdoor");

assert.ok(greenhouse, "Greenhouse category must exist");
assert.ok(outdoor, "Outdoor category must exist");

const cents = (amount) => Math.round(amount * 100);

function checkMix(category, budget) {
  const mix = bestMix(category.items, budget);
  const totalGrams = mix.lines.reduce((sum, { item, qty }) => sum + item.grams * qty, 0);
  const totalSpent = mix.lines.reduce((sum, { item, qty }) => sum + item.price * qty, 0);
  assert.ok(Math.abs(mix.grams - totalGrams) < 0.011, "Jar grams should match its item weights");
  assert.equal(cents(mix.spent), cents(totalSpent), "Jar spend should equal line subtotals");
  assert.ok(mix.spent <= budget + 0.001, "Do not exceed the selected budget");
  assert.ok(mix.lines.every(({ item, qty }) => category.items.some((candidate) => candidate.id === item.id) && Number.isInteger(qty) && qty > 0));
  return mix;
}

test("greenhouse primary packs are 2g/R60 and 4g/R120", () => {
  assert.ok(greenhouse.items.some(({ grams, price }) => grams === 2 && price === 60));
  assert.ok(greenhouse.items.some(({ grams, price }) => grams === 4 && price === 120));
  assert.equal(greenhouse.items.some(({ grams }) => grams === 1.67 || grams === 3.33), false);
  assert.deepEqual(new Set(SPECIAL_PACKS.map(({ id }) => id)), new Set(["gh-forbidos-167", "gh-jungle-167"]));
});

test("new greenhouse packs drive both jar totals and displayed line prices", () => {
  for (const [budget, expectedGrams, expectedProduct] of [
    [60, 2, "gh-60"],
    [120, 4, "gh-120"],
  ]) {
    const mix = checkMix(greenhouse, budget);
    assert.equal(mix.grams, expectedGrams);
    assert.equal(mix.spent, budget);
    assert.equal(mix.lines.length, 1);
    assert.equal(mix.lines[0].item.id, expectedProduct);
    assert.equal(mix.lines[0].qty, 1);
  }
  const mix = checkMix(greenhouse, 150);
  assert.equal(mix.grams, 5);
  assert.equal(mix.spent, 150);
  assert.equal(mix.lines.reduce((sum, { qty }) => sum + qty, 0), 2);
});

test("outdoor jar stays correct for changing budgets", () => {
  for (const budget of [20, 50, 60, 100, 120, 150, 500]) checkMix(outdoor, budget);
  const mix = checkMix(outdoor, 50);
  assert.equal(mix.grams, 4);
  assert.equal(mix.spent, 50);
});

test("mixer remains variable when new menu prices are introduced", () => {
  const custom = [
    { id: "a", label: "Pack A", weight: "3g", grams: 3, price: 65 },
    { id: "b", label: "Pack B", weight: "4g", grams: 4, price: 90 },
    { id: "c", label: "Pre-Roll", weight: "1g", grams: 1, price: 30 },
  ];
  assert.equal(bestMix(custom, 65).grams, 3);
  assert.equal(bestMix(custom, 90).grams, 4);
  assert.equal(bestMix(custom, 130).grams, 6);
  assert.equal(bestMix(custom, 130).spent, 130);
  const fractional = [
    { id: "f", label: "Sample", weight: "2g", grams: 2, price: 12.50 },
    { id: "g", label: "Sample", weight: "1g", grams: 1, price: 7.25 },
  ];
  assert.equal(bestMix(fractional, 25).grams, 4);
  assert.equal(bestMix([], 100).grams, 0);
  assert.equal(bestMix(custom, 0).spent, 0);
});

test("all catalogue items have unique IDs and valid pricing", () => {
  const products = [...MENU.flatMap((category) => category.items), ...SPECIAL_PACKS];
  assert.equal(new Set(products.map(({ id }) => id)).size, products.length);
  assert.ok(products.every(({ price, grams }) => Number.isFinite(price) && price > 0 && Number.isFinite(grams) && grams > 0));
});
