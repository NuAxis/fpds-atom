'use strict';

var nock = require('nock');

describe('FPDS', function() {
  var FPDS = require('../index');

  it('get items with vendor name', function(done) {
    var vendor = 'nuaxis';
    nock(FPDS.baseUrl)
        .get(FPDS.feedQuery + FPDS.queryParams.VENDOR_NAME + ':%22' + vendor + '%22')
        .replyWithFile(200, __dirname + '/fixtures/vendor_feed_result.xml');

    FPDS.getAwardsByVendor(vendor, function(err, results) {
      expect(err).toBeUndefined();
      expect(results).not.toBeUndefined();
      expect(results.length).toBe(10);
      done();
    });
  });

  it('get items with contract id', function(done) {
    var piid = 'DOLOPS15T00043';
    nock(FPDS.baseUrl)
        .get(FPDS.feedQuery + FPDS.queryParams.CONTRACT_ID + ':%22' + piid + '%22')
        .replyWithFile(200, __dirname + '/fixtures/piid_feed_result.xml');

    FPDS.getAwardsByContractID(piid, function(err, results) {
      expect(err).toBeUndefined();
      expect(results).not.toBeUndefined();
      expect(results.length).toBe(2);
      done();
    });
  });
});
