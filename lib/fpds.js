'use strict';
var request = require('request');
var xml2js = require('xml2js');

var FEED = {
  baseUrl: 'https://www.fpds.gov/ezsearch/FEEDS/ATOM',
  feedQuery: '?FEEDNAME=PUBLIC&templateName=1.4.4&q=',
  queryParams: {
    VENDOR_NAME: 'VENDOR_NAME',
    CONTRACT_ID: 'PIID',
  },

  getAwards: function(params, callback) {
    var url = this.baseUrl + this.feedQuery + params;
    var options = {'url': url, 'json': true};

    this.makeApiCall(options, callback);
  },

  getAwardsByVendor: function(vendor, callback) {
    return this.getAwards(
      this.queryParams.VENDOR_NAME + ':"' + vendor + '"',
      callback
    );
  },

  getAwardsByContractID: function(contractID, callback) {
    return this.getAwards(
      this.queryParams.CONTRACT_ID + ':"' + contractID + '"',
      callback
    );
  },

  makeApiCall: function(options, callback, type) {
    /* istanbul ignore next */
    callback = callback || function() {};
    request.get(options, function(err, resp, body) {
      if (err) {
        throw callback(err);
      }

      if (resp.statusCode !== 200) {
        throw callback('Request failed with code ' + resp.statusCode);
      }

      var parser = new xml2js.Parser({
        explicitArray: false,
        stripPrefix: true,
      });
      // var total;
      var entries = [];
      parser.parseString(body, function(err, result) {
        /* total = result.feed.entry.length;
        result.feed.link.forEach(function(link) {
          if(link.$.rel === 'last') {
            total = parseInt(link.$.href.split('start=')[1], 10);
          }
        });*/
        result.feed.entry.forEach(function(entry) {
          var award = entry.content['ns1:award'];

          if(award) {
            var awardJS = {};
            var awardID = award['ns1:awardID'];
            var dates = award['ns1:relevantContractDates'];
            var dollarValues = award['ns1:dollarValues'];
            var totalDollarValues = award['ns1:totalDollarValues'];
            var purchaserInformation = award['ns1:purchaserInformation'];
            var vendor = award['ns1:vendor'];
            var placeOfPerformance = award['ns1:placeOfPerformance'];

            awardJS.awardID = {
              awardContractID: {
                agencyID: awardID['ns1:awardContractID']['ns1:agencyID']._,
                agencyName: awardID['ns1:awardContractID']['ns1:agencyID'].$.name,
                PIID: awardID['ns1:awardContractID']['ns1:PIID'],
                modNumber: awardID['ns1:awardContractID']['ns1:modNumber'],
              },
            };

            if(awardID['ns1:referencedIDVID']) {
              awardJS.awardID.referencedIDVID = {
                agencyID: awardID['ns1:referencedIDVID']['ns1:agencyID']._,
                agencyName: awardID['ns1:referencedIDVID']['ns1:agencyID'].$.name,
                PIID: awardID['ns1:referencedIDVID']['ns1:PIID'],
                modNumber: awardID['ns1:referencedIDVID']['ns1:modNumber'],
              };
            }

            if(dates) {
              awardJS.relevantContractDates = {
                signedDate: dates['ns1:signedDate'],
                effectiveDate: dates['ns1:effectiveDate'],
                currentCompletionDate: dates['ns1:currentCompletionDate'],
                ultimateCompletionDate: dates['ns1:ultimateCompletionDate'],
              };
            }

            if(dollarValues) {
              awardJS.dollarValues = {
                obligatedAmount: dollarValues['ns1:obligatedAmount'],
                baseAndExercisedOptionsValue: dollarValues['ns1:baseAndExercisedOptionsValue'],
                baseAndAllOptionsValue: dollarValues['ns1:baseAndAllOptionsValue'],
              };
            }

            if(totalDollarValues) {
              awardJS.totalDollarValues = {
                totalObligatedAmount: totalDollarValues['ns1:totalObligatedAmount'],
                totalBaseAndExercisedOptionsValue: totalDollarValues['ns1:totalObligatedAmount'],
                totalBaseAndAllOptionsValue: totalDollarValues['ns1:totalObligatedAmount'],
              };
            }

            if(purchaserInformation) {
              awardJS.purchaserInformation = {
                contractingOfficeAgencyID: purchaserInformation['ns1:contractingOfficeAgencyID']._,
                contractingOfficeAgencyName: purchaserInformation['ns1:contractingOfficeAgencyID'].$.name,
                contractingOfficeAgencyDepartmentID: purchaserInformation['ns1:contractingOfficeAgencyID'].$.departmentID,
                contractingOfficeAgencyDepartmentName: purchaserInformation['ns1:contractingOfficeAgencyID'].$.departmentName,
                contractingOfficeID: purchaserInformation['ns1:contractingOfficeID']._,
                contractingOfficeName: purchaserInformation['ns1:contractingOfficeID'].$.name,
              };
            }

            if(vendor) {
              awardJS.vendor = {
                vendorName: vendor['ns1:vendorHeader']['ns1:vendorName'],
                streetAddress: vendor['ns1:vendorSiteDetails']['ns1:vendorLocation']['ns1:streetAddress'],
                city: vendor['ns1:vendorSiteDetails']['ns1:vendorLocation']['ns1:city'],
                stateCode: vendor['ns1:vendorSiteDetails']['ns1:vendorLocation']['ns1:state']._,
                stateName: vendor['ns1:vendorSiteDetails']['ns1:vendorLocation']['ns1:state'].$.name,
                ZIPCode: vendor['ns1:vendorSiteDetails']['ns1:vendorLocation']['ns1:ZIPCode'],
                countryCode: vendor['ns1:vendorSiteDetails']['ns1:vendorLocation']['ns1:countryCode']._,
                phoneNo: vendor['ns1:vendorSiteDetails']['ns1:vendorLocation']['ns1:phoneNo'],
                faxNo: vendor['ns1:vendorSiteDetails']['ns1:vendorLocation']['ns1:faxNo'],
                congressionalDistrictCode: vendor['ns1:vendorSiteDetails']['ns1:vendorLocation']['ns1:congressionalDistrictCode'],
                DUNSNumber: vendor['ns1:vendorSiteDetails']['ns1:vendorDUNSInformation']['ns1:DUNSNumber'],
                globalParentDUNSNumber: vendor['ns1:vendorSiteDetails']['ns1:vendorDUNSInformation']['ns1:globalParentDUNSNumber'],
                globalParentDUNSName: vendor['ns1:vendorSiteDetails']['ns1:vendorDUNSInformation']['ns1:globalParentDUNSName'],
              };
            }

            if(placeOfPerformance) {
              awardJS.placeOfPerformance = {
                principalPlaceOfPerformance: {
                  stateCode: placeOfPerformance['ns1:principalPlaceOfPerformance']['ns1:stateCode']._,
                  stateName: placeOfPerformance['ns1:principalPlaceOfPerformance']['ns1:stateCode'].$.name,
                  countryCode: placeOfPerformance['ns1:principalPlaceOfPerformance']['ns1:countryCode']._,
                  countryName: placeOfPerformance['ns1:principalPlaceOfPerformance']['ns1:countryCode'].$.name,
                },
              };
            }
          }

          entries.push(awardJS);
        });

        callback(undefined, entries);
      });
    });
  },
};

module.exports = FEED;
