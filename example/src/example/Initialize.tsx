import * as React from 'react';
import { woosmapkey as appkey } from '../../app.json';
import Toast from 'react-native-simple-toast';

import { StyleSheet, View, TouchableHighlight, Text } from 'react-native';
import WoosmapGeofencing, { RegionType } from '@woosmap/react-native-plugin-geofencing';

export const Initialize = () => {
  const onPress = () => {
    var woosmapSettings = {
      privateKeyWoosmapAPI: appkey,
    };
    var pushDummyData = async () => {
      var regionData = {
        lat: 51.50998,
        lng: -0.1337,
        regionId: 'isochrone-dummy',
        radius: 10,
        type: 'isochrone' as RegionType,
      };

      try {
        await WoosmapGeofencing.addRegion(regionData);
      } catch (e) {
        console.log(e);
      } finally {
        console.log('We do cleanup here');
      }
    };
    WoosmapGeofencing.initialize(woosmapSettings)
      .then((value: string) => {
        pushDummyData();
        Toast.show(value);
      })
      .catch((error: any) => {
        console.error(error);
      });
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 10,
    },
    button: {
      alignItems: 'center',
      backgroundColor: 'blue',
      padding: 10,
      borderRadius: 10,
    },
    text: {
      alignItems: 'center',
      color: 'white',
      fontWeight: 'bold',
    },
  });
  return (
    <View style={styles.container}>
      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={onPress}
      >
        <View style={styles.button}>
          <Text style={styles.text}>Initialize Plugin</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};
