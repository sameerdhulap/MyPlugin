/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { LogBox } from 'react-native';
import Toast from 'react-native-simple-toast';
import DropDownPicker from 'react-native-dropdown-picker';

import { StyleSheet, View, TouchableHighlight, Text } from 'react-native';
import WoosmapGeofencing from '@woosmap/react-native-plugin-geofencing';
import { useEffect } from 'react';

export const StartTracking = () => {
  const [open, setOpen] = React.useState(false);
  const [profilevalue, setProfileValue] = React.useState('passiveTracking');
  //liveTracking / passiveTracking / visitsTracking
  const [items, setItems] = React.useState([
    { label: 'Live', value: 'liveTracking' },
    { label: 'Passive', value: 'passiveTracking' },
    { label: 'Visits', value: 'visitsTracking' },
  ]);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  const onPress = () => {
    WoosmapGeofencing.startTracking(profilevalue)
      .then((result: string) => {
        return Toast.show(result);
      })
      .catch((error: any) => {
        console.error(error);
        //Toast.show(JSON.stringify(error.message));
      });
  };
  const onProfileChange = (value) => {
    console.error(value);
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 10,
    },
    containerDropdown: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 10,
      paddingTop: 10,
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
    <>
      <View>
        <View style={styles.container}>
          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={onPress}
          >
            <View style={styles.button}>
              <Text style={styles.text}>
                Tracking Profile {profilevalue ? '(' + profilevalue + ')' : ''}
              </Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.containerDropdown}>
          <DropDownPicker
            open={open}
            value={profilevalue}
            items={items}
            setOpen={setOpen}
            setValue={setProfileValue}
            setItems={setItems}
            onChangeValue={onProfileChange}
            disableBorderRadius={true}
            placeholder="Select a profile"
            searchable={true}
          />
        </View>
      </View>
    </>
  );
};
