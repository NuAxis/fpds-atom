'use strict';
var FPDS = require('../index');
var contractID = 'DOLOPS15T00043';

FPDS.getAwardsByContractID(contractID, function(error, awards) {
  if(!error && awards.length > 0) {
    awards.forEach(function(award, index) {
      console.log((index + 1) + ' of ' + awards.length + '------');
      console.log('Vendor:' + award.vendor.vendorName);
      console.log('Contract ID:' + award.awardID.awardContractID.PIID);
      console.log('Mod:' + award.awardID.awardContractID.modNumber);
      console.log('Effective Date: ' + award.relevantContractDates.effectiveDate);
    });
  } else {
    console.log(error);
  }
});
