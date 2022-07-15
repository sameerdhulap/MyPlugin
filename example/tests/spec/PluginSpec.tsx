/* eslint-disable no-undef */
'use strict';
import WoosmapGeofencing, {
  RegionType,
  GeofenceRegion,
  Region,
  Location,
  Poi,
  ProfileSource,
} from '@woosmap/react-native-plugin-geofencing';

export default function () {
  describe('', function () {
    const testObj = async () => {
      const _config = {
        trackingProfile: 'passiveTracking',
      };

      const returnObj = await WoosmapGeofencing.initialize(_config);
      expect(returnObj).toEqual('OK');
    };

    var locationWatchId = '';
    var regionWatchId = '';
    it('1. Should be defined', function () {
      expect(WoosmapGeofencing).toBeDefined();
    });
    it('2. getPermissionsStatus should be a function ', function () {
      expect(typeof WoosmapGeofencing.getPermissionsStatus).toEqual('function');
    });
    it('3. getPermissionsStatus Should check the permissions status', function (done) {
      WoosmapGeofencing.getPermissionsStatus()
        .then((result: string) => {
          expect(result).toBeDefined();
          done();
        })
        .catch(() => {
          expect(true).toEqual(false);
          done();
        });
    });
    it('4. requestPermissions should be a function ', function () {
      expect(typeof WoosmapGeofencing.requestPermissions).toEqual('function');
    });

    it('5. requestPermissions Should request background location permission', function (done) {
      WoosmapGeofencing.requestPermissions(true)
        .then((result: string) => {
          expect(result).toBeDefined();
          done();
        })
        .catch(() => {
          expect(true).toEqual(false);
          done();
        });
    });

    it('6. requestPermissions Should request foreground location permission', function (done) {
      WoosmapGeofencing.requestPermissions(false)
        .then((result: string) => {
          expect(result).toBeDefined();
          done();
        })
        .catch(() => {
          expect(true).toEqual(false);
          done();
        });
    });
    it('7. setWoosmapApiKey should be a function ', function () {
      expect(typeof WoosmapGeofencing.setWoosmapApiKey).toEqual('function');
    });

    it('8. setWoosmapApiKey should throw exception when empty API key is passed', function (done) {
      WoosmapGeofencing.setWoosmapApiKey('')
        .then((result: string) => {
          console.error('Invalid API key was accepted');
          expect(result).toEqual('false');
          done();
        })
        .catch((e) => {
          console.log(e.message);
          expect(e).toBeDefined();
          done();
        });
    });

    it('9. initialize should be a function ', function () {
      expect(typeof WoosmapGeofencing.initialize).toEqual('function');
    });

    it('10. initialize throw exception when invalid tracking profile is passed', function (done) {
      var _config = {
        trackingProfile: 'abc profile',
      };
      WoosmapGeofencing.initialize(_config)
        .then((result: string) => {
          console.error('Invalid tracking profile was accepted');
          expect(result).toEqual('false');
          done();
        })
        .catch((e) => {
          console.log(e.message);
          expect(e).toBeDefined();
          done();
        });
    });

    it('11. initialize Should initialize SDK when no config values are passed', function (done) {
      WoosmapGeofencing.initialize()
        .then((result: string) => {
          expect(result).toBeDefined();
          done();
        })
        .catch((e) => {
          console.error(e.message);
          expect(true).toEqual(false);
          done();
        });
    });
    testObj();
    it('12. setWoosmapApiKey should accept a non empty API key', function (done) {
      //WoosmapGeofencing.initialize().then(() => {
      WoosmapGeofencing.setWoosmapApiKey('3b705030-e85d-4bf0-a1be-5ac7372c91d5')
        .then((result: string) => {
          expect(result).toBeDefined();
          done();
        })
        .catch((e) => {
          console.error(e.message);
          expect(true).toEqual(false);
          done();
        });
      //});
    });

    it('13. watchLocation should be a function ', function () {
      expect(typeof WoosmapGeofencing.watchLocation).toEqual('function');
    });

    it('14. watchLocation should return a watch Id', function (done) {
      var win = function (location: any) {
        expect(location).toBeDefined();
        expect(location.latitude).toBeDefined();
        expect(location.longitude).toBeDefined();
        expect(location.locationid).toBeDefined();
        expect(location.locationdescription).toBeDefined();
        expect(location.date).toBeDefined();
        done();
      };
      var fail = function (e: any) {
        console.error(e.message);
        expect(true).toEqual(false);
        done();
      };
      WoosmapGeofencing.watchLocation(win, fail)
        .then((result: string) => {
          locationWatchId = result;
          expect(result).toBeDefined();
          done();
        })
        .catch((e) => {
          console.error(e.message);
          expect(true).toEqual(false);
          done();
        });
    });

    it('15. clearLocationWatch should be a function ', function () {
      expect(typeof WoosmapGeofencing.clearLocationWatch).toEqual('function');
    });

    it('16. clearLocationWatch should clear location watch', function (done) {
      WoosmapGeofencing.clearLocationWatch(locationWatchId);
      expect(true).toEqual(true);
      done();
    });

    it('17. watchRegions should be a function ', function () {
      expect(typeof WoosmapGeofencing.watchRegions).toEqual('function');
    });

    it('18. watchRegions should return a watch Id', function (done) {
      var win = function (_region: any) {};
      var fail = function (_e: any) {};
      WoosmapGeofencing.watchRegions(win, fail)
        .then((result) => (regionWatchId = result))
        .catch();
      expect(regionWatchId).toBeDefined();
      done();
    });

    it('19. clearRegionsWatch should be a function ', function () {
      expect(typeof WoosmapGeofencing.clearRegionsWatch).toEqual('function');
    });

    it('20. clearRegionsWatch should clear regions watch', function (done) {
      WoosmapGeofencing.clearRegionsWatch(regionWatchId);
      expect(true).toEqual(true);
      done();
    });

    it('21. startTracking should be a function ', function () {
      expect(typeof WoosmapGeofencing.startTracking).toEqual('function');
    });

    it('22. startTracking should throw exception if profile is empty', function (done) {
      WoosmapGeofencing.startTracking('')
        .then((_result: any) => {
          console.error('Tracking started without valid profile');
          expect(true).toEqual(false);
          done();
        })
        .catch((e: any) => {
          expect(e).toBeDefined();
          console.log(e.message);
          done();
        });
    });

    it('23. startTracking should throw exception if profile is invalid', function (done) {
      WoosmapGeofencing.startTracking('abc')
        .then((_result: any) => {
          console.error('Tracking started without valid profile');
          expect(true).toEqual(false);
          done();
        })
        .catch((e: any) => {
          expect(e).toBeDefined();
          console.log(e.message);
          done();
        });
    });

    it('24. startTracking should start if profile is valid', function (done) {
      WoosmapGeofencing.startTracking('liveTracking')
        .then((_result: any) => {
          expect(_result).toBeDefined();
          done();
        })
        .catch((e: any) => {
          console.error(e.message);
          expect(true).toEqual(false);
          done();
        });
    });

    it('27. setSFMCCredentials should be a function ', function () {
      expect(typeof WoosmapGeofencing.setSFMCCredentials).toEqual('function');
    });

    it('28. setSFMCCredentials should throw exception if authenticationBaseURI key is not passed ', function (done) {
      var sfmcCredentials = {
        authenticationBaseURI1:
          'https://mcdmfc5rbyc0pxgr4nlpqqy0j-x1.auth.marketingcloudapis.com',
        restBaseURI:
          'https://mcdmfc5rbyc0pxgr4nlpqqy0j-x1.rest.marketingcloudapis.com',
        client_id: 'xxxxxxxxxxxxxxx',
        client_secret: 'xxxxxxxxxxxxxxx',
        contactKey: 'ID001',
        regionEnteredEventDefinitionKey:
          'APIEvent-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        regionExitedEventDefinitionKey:
          'APIEvent-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      };
      WoosmapGeofencing.setSFMCCredentials(sfmcCredentials)
        .then((_result: any) => {
          console.error(
            'setSFMCCredentials passed without passing required key'
          );
          expect(true).toEqual(false);
          done();
        })
        .catch((e: any) => {
          expect(e).toBeDefined();
          console.log(e.message);
          done();
        });
    });

    it('29. setSFMCCredentials should throw exception if restBaseURI key is not passed ', function (done) {
      var sfmcCredentials = {
        authenticationBaseURI:
          'https://mcdmfc5rbyc0pxgr4nlpqqy0j-x1.auth.marketingcloudapis.com',
        restBaseURI1:
          'https://mcdmfc5rbyc0pxgr4nlpqqy0j-x1.rest.marketingcloudapis.com',
        client_id: 'xxxxxxxxxxxxxxx',
        client_secret: 'xxxxxxxxxxxxxxx',
        contactKey: 'ID001',
        regionEnteredEventDefinitionKey:
          'APIEvent-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        regionExitedEventDefinitionKey:
          'APIEvent-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      };
      WoosmapGeofencing.setSFMCCredentials(sfmcCredentials)
        .then((_result: any) => {
          console.error(
            'setSFMCCredentials passed without passing required key'
          );
          expect(true).toEqual(false);
          done();
        })
        .catch((e: any) => {
          expect(e).toBeDefined();
          console.log(e.message);
          done();
        });
    });

    it('30. setSFMCCredentials should throw exception if client_id key is not passed ', function (done) {
      var sfmcCredentials = {
        authenticationBaseURI:
          'https://mcdmfc5rbyc0pxgr4nlpqqy0j-x1.auth.marketingcloudapis.com',
        restBaseURI:
          'https://mcdmfc5rbyc0pxgr4nlpqqy0j-x1.rest.marketingcloudapis.com',
        client_id1: 'xxxxxxxxxxxxxxx',
        client_secret: 'xxxxxxxxxxxxxxx',
        contactKey: 'ID001',
        regionEnteredEventDefinitionKey:
          'APIEvent-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        regionExitedEventDefinitionKey:
          'APIEvent-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      };
      WoosmapGeofencing.setSFMCCredentials(sfmcCredentials)
        .then((_result: any) => {
          console.error(
            'setSFMCCredentials passed without passing required key'
          );
          expect(true).toEqual(false);
          done();
        })
        .catch((e: any) => {
          expect(e).toBeDefined();
          console.log(e.message);
          done();
        });
    });

    it('31. setSFMCCredentials should throw exception if client_secret key is not passed ', function (done) {
      var sfmcCredentials = {
        authenticationBaseURI:
          'https://mcdmfc5rbyc0pxgr4nlpqqy0j-x1.auth.marketingcloudapis.com',
        restBaseURI:
          'https://mcdmfc5rbyc0pxgr4nlpqqy0j-x1.rest.marketingcloudapis.com',
        client_id: 'xxxxxxxxxxxxxxx',
        client_secret1: 'xxxxxxxxxxxxxxx',
        contactKey: 'ID001',
        regionEnteredEventDefinitionKey:
          'APIEvent-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        regionExitedEventDefinitionKey:
          'APIEvent-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      };
      WoosmapGeofencing.setSFMCCredentials(sfmcCredentials)
        .then((_result: any) => {
          console.error(
            'setSFMCCredentials passed without passing required key'
          );
          expect(true).toEqual(false);
          done();
        })
        .catch((e: any) => {
          expect(e).toBeDefined();
          console.log(e.message);
          done();
        });
    });

    it('32. setSFMCCredentials should throw exception if contactKey key is not passed ', function (done) {
      var sfmcCredentials = {
        authenticationBaseURI:
          'https://mcdmfc5rbyc0pxgr4nlpqqy0j-x1.auth.marketingcloudapis.com',
        restBaseURI:
          'https://mcdmfc5rbyc0pxgr4nlpqqy0j-x1.rest.marketingcloudapis.com',
        client_id: 'xxxxxxxxxxxxxxx',
        client_secret: 'xxxxxxxxxxxxxxx',
        contactKey1: 'ID001',
        regionEnteredEventDefinitionKey:
          'APIEvent-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        regionExitedEventDefinitionKey:
          'APIEvent-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      };
      WoosmapGeofencing.setSFMCCredentials(sfmcCredentials)
        .then((_result: any) => {
          console.error(
            'setSFMCCredentials passed without passing required key'
          );
          expect(true).toEqual(false);
          done();
        })
        .catch((e: any) => {
          expect(e).toBeDefined();
          console.log(e.message);
          done();
        });
    });

    it('33. setSFMCCredentials should set credentials if all required keys are passed ', function (done) {
      var sfmcCredentials = {
        authenticationBaseURI:
          'https://mcdmfc5rbyc0pxgr4nlpqqy0j-x1.auth.marketingcloudapis.com',
        restBaseURI:
          'https://mcdmfc5rbyc0pxgr4nlpqqy0j-x1.rest.marketingcloudapis.com',
        client_id: 'xxxxxxxxxxxxxxx',
        client_secret: 'xxxxxxxxxxxxxxx',
        contactKey: 'ID001',
        regionEnteredEventDefinitionKey:
          'APIEvent-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        regionExitedEventDefinitionKey:
          'APIEvent-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      };
      WoosmapGeofencing.setSFMCCredentials(sfmcCredentials)
        .then((_result: any) => {
          expect(_result).toBeDefined();
          done();
        })
        .catch((e: any) => {
          console.error(e.message);
          expect(true).toEqual(false);
          done();
        });
    });

    it('34. setPoiRadius should be a function ', function () {
      expect(typeof WoosmapGeofencing.setPoiRadius).toEqual('function');
    });

    it('35. setPoiRadius should set radius to "radiusPOI"', function (done) {
      WoosmapGeofencing.setPoiRadius('radiusPOI')
        .then((_result: any) => {
          expect(true).toEqual(true);
          done();
        })
        .catch((e: any) => {
          expect(e).toBeDefined();
          console.log(e.message);
          done();
        });
    });

    it('36. setPoiRadius should set radius to 100', function (done) {
      WoosmapGeofencing.setPoiRadius('100')
        .then((_result: any) => {
          expect(true).toEqual(true);
          done();
        })
        .catch((e: any) => {
          expect(e).toBeDefined();
          console.log(e.message);
          done();
        });
    });

    it('37. setPoiRadius should set radius to  100.20', function (done) {
      WoosmapGeofencing.setPoiRadius('100.2')
        .then((_result: any) => {
          expect(true).toEqual(true);
          done();
        })
        .catch((e: any) => {
          expect(e).toBeDefined();
          console.log(e.message);
          done();
        });
    });

    it('38. addRegion should be a function ', function () {
      expect(typeof WoosmapGeofencing.addRegion).toEqual('function');
    });

    it('39. addRegion should throw exception if different region type  info is passed other than circle and isochrone', function (done) {
      var regionData: GeofenceRegion = {
        lat: 51.50998,
        lng: -0.1337,
        regionId: '7F91369E-467C-4CBD-8D41-6509815C4780',
        radius: 10,
        type: 'abc' as RegionType,
      };
      WoosmapGeofencing.addRegion(regionData)
        .then((_result: string) => {
          console.error('invalid type accepted.');
          expect(true).toEqual(false);
          done();
        })
        .catch((e: any) => {
          expect(e).toBeDefined();
          console.log(e.message);
          done();
        });
    });

    it('40.1. Remove All Region', function (done) {
      WoosmapGeofencing.removeRegions()
        .then((_result: string) => {
          expect(_result).toBeDefined();
          done();
        })
        .catch((e: any) => {
          console.error(e.message);
          expect(true).toEqual(false);
          done();
        });
    });

    it('40. addRegion with type=circle', function (done) {
      var regionData: GeofenceRegion = {
        lat: 51.50998,
        lng: -1.1337,
        regionId: 'plugintest',
        radius: 10,
        type: 'circle' as RegionType,
      };
      WoosmapGeofencing.addRegion(regionData)
        .then((_result: string) => {
          expect(_result).toBeDefined();
          done();
        })
        .catch((e: any) => {
          console.error(e.message);
          expect(true).toEqual(false);
          done();
        });
    });

    it('42. addRegion with type=isochrone', function (done) {
      var regionData: GeofenceRegion = {
        lat: 51.50998,
        lng: -0.1337,
        regionId: 'isochrone-123',
        radius: 10,
        type: 'isochrone' as RegionType,
      };
      WoosmapGeofencing.addRegion(regionData)
        .then((_result: string) => {
          expect(_result).toBeDefined();
          done();
        })
        .catch((e: any) => {
          console.error(e.message);
          expect(true).toEqual(false);
          done();
        });
    });
    it('43. Get All Region', function (done) {
      WoosmapGeofencing.getRegions()
        .then((_result: Region[]) => {
          expect(_result).toBeDefined();
          done();
        })
        .catch((e: any) => {
          console.error(e.message);
          expect(true).toEqual(false);
          done();
        });
    });

    it('44. Get Region by ID', function (done) {
      var regionData: string = 'isochrone-123';
      WoosmapGeofencing.getRegions(regionData)
        .then((_result: Region[]) => {
          expect(_result).toBeDefined();
          done();
        })
        .catch((e: any) => {
          console.log(e.message);
          expect(e.message).toBeDefined();
          done();
        });
    });
    it('45. Remove Region', function (done) {
      var regionData: string = 'isochrone-123';
      WoosmapGeofencing.removeRegions(regionData)
        .then((_result: string) => {
          expect(_result).toBeDefined();
          done();
        })
        .catch((e: any) => {
          console.error(e.message);
          expect(true).toEqual(false);
          done();
        });
    });
    it('46. Remove All Region', function (done) {
      WoosmapGeofencing.removeRegions()
        .then((_result: string) => {
          expect(_result).toBeDefined();
          done();
        })
        .catch((e: any) => {
          console.error(e.message);
          expect(true).toEqual(false);
          done();
        });
    });
    it('47. Get All Location', function (done) {
      WoosmapGeofencing.getLocations()
        .then((_result: Location[]) => {
          expect(_result).toBeDefined();
          done();
        })
        .catch((e: any) => {
          console.log(e.message);
          expect(true).toEqual(false);
          done();
        });
    });

    it('48. Get Location by ID', function (done) {
      var regionData: string = '7F91369E-467C-4CBD-8D41-6509815C4780';
      WoosmapGeofencing.getLocations(regionData)
        .then((_result: Location[]) => {
          expect(_result).toBeDefined();
          done();
        })
        .catch((e: any) => {
          //console.error(e.message);
          expect(e.message).toBeDefined();
          done();
        });
    });

    it('49. Remove All Locations', function (done) {
      WoosmapGeofencing.removeLocations()
        .then((_result: string) => {
          expect(_result).toBeDefined();
          done();
        })
        .catch((e: any) => {
          console.error(e.message);
          expect(true).toEqual(false);
          done();
        });
    });
    it('50. Get All POI', function (done) {
      WoosmapGeofencing.getPois()
        .then((_result: Poi[]) => {
          expect(_result).toBeDefined();
          done();
        })
        .catch((e: any) => {
          console.log(e.message);
          expect(true).toEqual(false);
          done();
        });
    });

    it('51. Get POI by ID', function (done) {
      var regionData: string = '7F91369E-467C-4CBD-8D41-6509815C4780';
      WoosmapGeofencing.getPois(regionData)
        .then((_result: Poi[]) => {
          expect(_result).toBeDefined();
          done();
        })
        .catch((e: any) => {
          //console.error(e.message);
          expect(e.message).toBeDefined();
          done();
        });
    });

    it('52. Remove All POI Info', function (done) {
      WoosmapGeofencing.removePois()
        .then((_result: string) => {
          expect(_result).toBeDefined();
          done();
        })
        .catch((e: any) => {
          console.error(e.message);
          expect(true).toEqual(false);
          done();
        });
    });
    it('53. Custom Profile (local)', function (done) {
      var path: string = 'localProfile.json';
      WoosmapGeofencing.startCustomTracking('local' as ProfileSource, path)
        .then((_result: string) => {
          expect(_result).toBeDefined();
          done();
        })
        .catch((e: any) => {
          console.error(e.message);
          expect(true).toEqual(false);
          done();
        });
    });

    it('54. Custom Profile (local) invalid file ', function (done) {
      var path: string = 'test.json';
      WoosmapGeofencing.startCustomTracking('local' as ProfileSource, path)
        .then((_result: string) => {
          console.error(_result);
          expect(true).toEqual(false);
          done();
        })
        .catch((e: any) => {
          expect(e).toBeDefined();
          done();
        });
    });

    it('55. Custom Profile (external)', function (done) {
      var path: string =
        'https://raw.githubusercontent.com/lpernelle-wgs/files/master/customProfileLeo.json';
      WoosmapGeofencing.startCustomTracking('external' as ProfileSource, path)
        .then((_result: string) => {
          expect(_result).toBeDefined();
          done();
        })
        .catch((e: any) => {
          console.error(e.message);
          expect(true).toEqual(false);
          done();
        });
    });

    it('56. Custom Profile (external) invalid file ', function (done) {
      var path: string =
        'https://raw.githubusercontent.com/lpernelle-wgs/files/master/test.json';
      WoosmapGeofencing.startCustomTracking('external' as ProfileSource, path)
        .then((_result: string) => {
          console.error(_result);
          expect(true).toEqual(false);
          done();
        })
        .catch((e: any) => {
          expect(e).toBeDefined();
          done();
        });
    });

    it('57. Custom Profile (invalid source)', function (done) {
      var path: string =
        'https://raw.githubusercontent.com/lpernelle-wgs/files/master/customProfileLeo.json';
      WoosmapGeofencing.startCustomTracking('test' as ProfileSource, path)
        .then((_result: string) => {
          console.error(_result);
          expect(true).toEqual(false);
          done();
        })
        .catch((e: any) => {
          expect(e).toBeDefined();
          done();
        });
    });

    it('end 1. stopTracking should be a function ', function () {
      expect(typeof WoosmapGeofencing.stopTracking).toEqual('function');
    });

    it('end 2. stopTracking should stop the tracking', function (done) {
      WoosmapGeofencing.stopTracking()
        .then((_result: any) => {
          expect(_result).toBeDefined();
          done();
        })
        .catch((e: any) => {
          console.error(e.message);
          expect(true).toEqual(false);
          done();
        });
    });
  });
}
