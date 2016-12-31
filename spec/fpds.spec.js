'use strict';

describe('FPDS', function() {
  var lib = require('../index');

  it('test hello world', function() {
    expect(lib.FPDS.getTrue()).toBe(true);
  });
});
