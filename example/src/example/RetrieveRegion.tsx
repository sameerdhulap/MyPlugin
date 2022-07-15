import * as React from 'react';
import Toast from 'react-native-simple-toast';

import {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  TextInput,
} from 'react-native';
import WoosmapGeofencing, { Region } from '@woosmap/react-native-plugin-geofencing';

export const RetrieveRegion = () => {
  const [regionID, setRegionID] = React.useState('');
  const onChangeRegion = (value: string) => {
    setRegionID(value);
  };
  const onPressSingleRegion = () => {
    if (regionID !== '') {
      WoosmapGeofencing.getRegions(regionID)
        .then((value: Region[]) => {
          console.log(value);
          Toast.show(String(value.length));
        })
        .catch((error: any) => {
          console.error(error);
        });
    }
  };
  const onPressAllRegion = () => {
    WoosmapGeofencing.getRegions()
      .then((value: Region[]) => {
        if (value.length > 0) {
          setRegionID(value[0].Identifier);
        }
        Toast.show(String(value.length));
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
            <Text style={styles.text}>Retrieve Region</Text>
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
            <Text style={styles.text}>Retrieve All Region</Text>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};
