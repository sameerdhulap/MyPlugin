import * as React from 'react';
import Toast from 'react-native-simple-toast';

import {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  TextInput,
} from 'react-native';
import WoosmapGeofencing, { Poi } from '@woosmap/react-native-plugin-geofencing';

export const RetrievePOI = () => {
  const [locationID, setLocationID] = React.useState('');
  const onChange = (value: string) => {
    setLocationID(value);
  };
  const onPress = () => {
    if (locationID !== '') {
      WoosmapGeofencing.getPois(locationID)
        .then((value: Poi[]) => {
          Toast.show(JSON.stringify(value));
        })
        .catch((error: any) => {
          console.error(error);
        });
    }
  };
  const onPressAll = () => {
    WoosmapGeofencing.getPois()
      .then((value: Poi[]) => {
        if (value.length > 0) {
          setLocationID(value[0].Idstore);
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
          onChangeText={onChange}
          value={locationID}
          placeholder="Store ID/Location ID"
          keyboardType="default"
        />
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          style={styles.touchablebuttonRight}
          onPress={onPress}
        >
          <View style={styles.button}>
            <Text style={styles.text}>Retrieve POI</Text>
          </View>
        </TouchableHighlight>
      </View>
      <View style={styles.container}>
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          style={styles.touchablebuttonLeft}
          onPress={onPressAll}
        >
          <View style={styles.button}>
            <Text style={styles.text}>Retrieve All POI</Text>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};
