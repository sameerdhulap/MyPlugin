import * as React from 'react';
import Toast from 'react-native-simple-toast';
import { profile, woosmapkey as appkey } from '../../app.json';
import { StyleSheet, View, TouchableHighlight, Text } from 'react-native';
import WoosmapGeofencing from '@woosmap/react-native-plugin-geofencing';

export const SetWoosmapApiKey = () => {
  const onPress = () => {
    var woosmapSettings = {
      privateKeyWoosmapAPI: appkey,
      trackingProfile: profile,
    };
    WoosmapGeofencing.setWoosmapApiKey(woosmapSettings.privateKeyWoosmapAPI)
      .then((value: string) => {
        console.log(value);
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
          <Text style={styles.text}>Set New Woosmap Key</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};