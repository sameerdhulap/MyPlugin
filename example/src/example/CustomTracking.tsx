import * as React from 'react';
import Toast from 'react-native-simple-toast';

import { StyleSheet, View, TouchableHighlight, Text } from 'react-native';
import WoosmapGeofencing, {
  ProfileSource,
} from '@woosmap/react-native-plugin-geofencing';

export const CustomTracking = (props: { mode: ProfileSource }) => {
  const onClick = () => {
    var path: string = 'localProfile.json';
    if (props.mode === 'external') {
      path =
        'https://raw.githubusercontent.com/lpernelle-wgs/files/master/customProfileLeo.json';
    }
    WoosmapGeofencing.startCustomTracking(props.mode, path)
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
        onPress={onClick}
      >
        <View style={styles.button}>
          <Text style={styles.text}>Custom Tracking ({props.mode})</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};
