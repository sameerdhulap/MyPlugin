import * as React from 'react';
import Toast from 'react-native-simple-toast';

import { StyleSheet, View, TouchableHighlight, Text } from 'react-native';
import WoosmapGeofencing from '@woosmap/react-native-plugin-geofencing';

export const GetPermission = () => {
  const onPress = () => {
    WoosmapGeofencing.getPermissionsStatus()
      .then((status: string) => {
        //console.log(status);
        Toast.show(status);
      })
      .catch((error: any) => {
        console.error(error.message);
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
          <Text style={styles.text}>Get Location Permission</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};
