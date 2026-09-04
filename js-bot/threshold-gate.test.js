'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { accountAgeDays, safeCodeMatch } = require('./threshold-gate');

test('safeCodeMatch accepts the configured code without case sensitivity', () => {
  assert.equal(safeCodeMatch(' Violet-123 ', 'violet-123'), true);
});

test('safeCodeMatch rejects missing and incorrect codes', () => {
  assert.equal(safeCodeMatch('', 'expected'), false);
  assert.equal(safeCodeMatch('wrong', 'expected'), false);
  assert.equal(safeCodeMatch('expected-extra', 'expected'), false);
});

test('accountAgeDays returns whole elapsed days', () => {
  const now = Date.now();
  const user = { createdTimestamp: now - (31 * 24 * 60 * 60 * 1000) };
  const days = accountAgeDays(user);
  assert.ok(days >= 30 && days <= 31);
});
