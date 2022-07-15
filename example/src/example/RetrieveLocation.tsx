import * as React from 'react';
import Toast from 'react-native-simple-toast';

import {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  TextInput,
} from 'react-native';
import WoosmapGeofencing, { Location } from '@woosmap/react-native-plugin-geofencing';

export const RetrieveLocation = () => {
  const [locationID, setLocationID] = React.useState('');
  const onChange = (value: string) => {
    setLocationID(value);
  };
  const onPress = () => {
    if (locationID !== '') {
      WoosmapGeofencing.getLocations(locationID)
        .then((value: Location[]) => {
          console.log(value);
          Toast.show(String(value.length));
        })
        .catch((error: any) => {
          console.error(error);
        });
    }
  };
  const onPressAll = () => {
    WoosmapGeofencing.getLocations()
      .then((value: Location[]) => {
        if (value.length > 0) {
          setLocationID(value[0].Locationid);
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
          placeholder="Location ID"
          keyboardType="default"
        />
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          style={styles.touchablebuttonRight}
          onPress={onPress}
        >
          <View style={styles.button}>
            <Text style={styles.text}>Retrieve Location</Text>
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
            <Text style={styles.text}>Retrieve All Locations</Text>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};
