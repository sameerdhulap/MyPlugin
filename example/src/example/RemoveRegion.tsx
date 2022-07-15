import * as React from 'react';
import Toast from 'react-native-simple-toast';

import {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  TextInput,
} from 'react-native';
import WoosmapGeofencing from '@woosmap/react-native-plugin-geofencing';

export const RemoveRegion = () => {
  const [regionID, setRegionID] = React.useState('isochrone-dummy');
  const onChangeRegion = (value: string) => {
    setRegionID(value);
  };
  const onPressSingleRegion = () => {
    WoosmapGeofencing.removeRegions(regionID)
      .then((value: string) => {
        Toast.show(value);
      })
      .catch((error: any) => {
        console.error(error);
      });
  };
  const onPressAllRegion = () => {
    WoosmapGeofencing.removeRegions()
      .then((value: string) => {
        Toast.show(value);
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
      marginTop: 10,
    },
    touchablebuttonRight: {
      flexGrow: 100,
      marginLeft: 10,
      maxWidth: 110,
    },
    input: {
      height: 40,
      margin: 0,
      marginBottom: 5,
      borderWidth: 1,
      borderRadius: 5,
      flexGrow: 100,
      padding: 10,
      backgroundColor: 'white',
      alignItems: 'stretch',
    },
  });
  return (
    <View>
      <View style={styles.container}>
        <TextInput
          id="txtRegion"
          style={styles.input}
          onChangeText={onChangeRegion}
          value={regionID}
          placeholder="Region ID"
          keyboardType="default"
        />
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          style={styles.touchablebuttonRight}
          onPress={onPressSingleRegion}
        >
          <View style={styles.button}>
            <Text style={styles.text}>Delete Region</Text>
          </View>
        </TouchableHighlight>
      </View>
      <View style={styles.container}>
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          style={styles.touchablebuttonLeft}
          onPress={onPressAllRegion}
        >
          <View style={styles.button}>
            <Text style={styles.text}>Remove All Region</Text>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};
