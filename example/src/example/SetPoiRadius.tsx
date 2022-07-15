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

export const SetPoiRadius = () => {
  const [radius, setRadius] = React.useState('100');
  const onChangeRadius = (value: string) => {
    setRadius(value);
  };
  const onPress = () => {
    WoosmapGeofencing.setPoiRadius(radius)
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
    input: {
      height: 40,
      margin: 0,
      marginBottom: 5,
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      backgroundColor: 'white',
    },
  });
  return (
    <View>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeRadius}
          value={radius}
          placeholder="Radius (text or number in meters)"
          keyboardType="default"
        />
      </View>
      <View style={styles.container}>
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          onPress={onPress}
        >
          <View style={styles.button}>
            <Text style={styles.text}>Set POI Radius</Text>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};
