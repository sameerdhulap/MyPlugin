import * as React from 'react';
import Toast from 'react-native-simple-toast';

import { StyleSheet, View, TouchableHighlight, Text } from 'react-native';
import WoosmapGeofencing, { Region } from '@woosmap/react-native-plugin-geofencing';

export const WatchRegion = () => {
  const [watchID, setwatchID] = React.useState('');
  const callback = (value: Region) => {
    Toast.show(JSON.stringify(value));
  };

  const onPressWatch = () => {
    WoosmapGeofencing.watchRegions(callback)
      .then((watchRef: string) => {
        setwatchID(watchRef);
        Toast.show('Watch added');
      })
      .catch((error: any) => {
        console.error(error);
      });
  };
  const onPressClearWatch = () => {
    WoosmapGeofencing.clearRegionsWatch(watchID)
      .then((watchRef: string) => {
        console.log(watchRef);
        setwatchID('');
        Toast.show(watchRef.toString());
      })
      .catch((error: any) => {
        console.error(error);
      });
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
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
    touchablebuttonLeft: {
      flexGrow: 100,
      marginRight: 2,
    },
    touchablebuttonRight: {
      flexGrow: 100,
      marginLeft: 2,
    },
    buttonDisable: {
      backgroundColor: 'gray',
    },
  });
  return (
    <View style={styles.container}>
      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={onPressWatch}
        style={styles.touchablebuttonLeft}
        disabled={watchID === '' ? false : true}
      >
        <View
          style={[
            styles.button,
            watchID !== '' ? styles.buttonDisable : styles.button,
          ]}
        >
          <Text style={styles.text}>Watch</Text>
        </View>
      </TouchableHighlight>
      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={onPressClearWatch}
        style={styles.touchablebuttonRight}
        disabled={watchID === '' ? true : false}
      >
        <View
          style={[
            styles.button,
            watchID === '' ? styles.buttonDisable : styles.button,
          ]}
        >
          <Text style={styles.text}>Clear Watch</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};
