# fpds-atom
JavaScript library for nodejs to search through FPDS.GOV  ATOM Feed

    npm install fpds-atom

# Interfaces
```javascript
var FPDS = require('fpds-atom');

FPDS.getAwardsByVendor('vendor', function(error, awards) {});
FPDS.getAwardsByContractID('contractID', function(error, awards) {});
FPDS.getAwards('param:value', function(error, awards) {});
```

# Example Usage
```javascript
var FPDS = require('fpds-atom');
var contractID = 'DOLOPS15T00043';

FPDS.getAwardsByContractID(contractID, function(error, awards) {
  if(!error && awards.length > 0) {
    awards.forEach(function(award) {
      console.log('Contract ID:' + award.awardID.awardContractID.PIID);
      console.log('Vendor:' + award.vendor.vendorName);
      console.log('Mod:' + award.awardID.awardContractID.modNumber);
      console.log('Effective Date: ' + award.relevantContractDates.effectiveDate);
    });
  } else {
    console.log(error);
  }
});
```
# Build

    npm test
