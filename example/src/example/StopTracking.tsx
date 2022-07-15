import * as React from 'react';
import Toast from 'react-native-simple-toast';

import { StyleSheet, View, TouchableHighlight, Text } from 'react-native';
import WoosmapGeofencing from '@woosmap/react-native-plugin-geofencing';

export const StopTracking = () => {
  const onPress = () => {
    WoosmapGeofencing.stopTracking()
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
          <Text style={styles.text}>Stop Tracking</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};
