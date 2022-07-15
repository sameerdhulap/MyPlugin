import * as React from 'react';

import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Platform,
  ScrollView,
} from 'react-native';

import type { ProfileSource, RegionType } from '@woosmap/react-native-plugin-geofencing';
import * as PluginSample from './example';

export default function App(props: any) {
  const pageStyles = StyleSheet.create({
    topBar: {
      flex: 0,
      backgroundColor: 'purple',
    },

    container: {
      flex: 1,
      backgroundColor: '#ddd',
    },

    header: {
      height: 60,
      marginVertical: 0,
      backgroundColor: '#8f8f8f',
      alignContent: 'center',
      justifyContent: 'center',
    },
    title: {
      textAlign: 'center',
      marginVertical: 8,
      color: 'white',
      fontSize: 25,
    },
    article: {
      flex: 1,
      overflow: 'scroll',
      minHeight: 100,
      marginVertical: 10,
      paddingLeft: 5,
      paddingRight: 5,
    },
    row: {
      paddingBottom: 5,
    },
    col2: {
      flex: 1,
      flexDirection: 'row',
      paddingHorizontal: 0,
      justifyContent: 'center',
    },
  });
  return (
    <React.Fragment>
      <SafeAreaView style={pageStyles.topBar}>{props.children}</SafeAreaView>
      <SafeAreaView style={pageStyles.container}>
        <View style={pageStyles.header}>
          <Text style={pageStyles.title}>Geofence Plugin</Text>
        </View>
        <ScrollView>
          <View style={pageStyles.article}>
            <View style={pageStyles.row}>
              <Text>Initialize</Text>
            </View>
            <View style={pageStyles.row}>
              <PluginSample.Initialize />
            </View>
            <View style={pageStyles.row}>
              <PluginSample.SetWoosmapApiKey />
            </View>
            <View style={pageStyles.row}>
              <Text>Profile</Text>
            </View>
            <View
              class={pageStyles.row}
              style={{
                ...(Platform.OS !== 'android' && {
                  zIndex: 10,
                }),
              }}
            >
              <PluginSample.StartTracking />
            </View>
            <View style={pageStyles.row}>
              <Text> </Text>
            </View>
            <View style={pageStyles.row}>
              <PluginSample.StopTracking />
            </View>
            <View style={pageStyles.row}>
              <Text>Custom tracking profile</Text>
            </View>
            <View style={pageStyles.row}>
              <PluginSample.CustomTracking mode={'local' as ProfileSource} />
            </View>
            <View style={pageStyles.row}>
              <PluginSample.CustomTracking mode={'external' as ProfileSource} />
            </View>
            <View style={pageStyles.row}>
              <Text>Location Permission</Text>
            </View>
            <View style={pageStyles.row}>
              <PluginSample.RequestPermissions background={true} />
            </View>
            <View style={pageStyles.row}>
              <PluginSample.RequestPermissions background={false} />
            </View>
            <View style={pageStyles.row}>
              <PluginSample.GetPermission />
            </View>
            <View style={pageStyles.row}>
              <Text>POI Radius</Text>
            </View>
            <View style={pageStyles.row}>
              <PluginSample.SetPoiRadius />
            </View>
            <View style={pageStyles.row}>
              <Text>Watch Location</Text>
            </View>
            <View style={pageStyles.row}>
              <PluginSample.WatchLocation />
            </View>
            <View style={pageStyles.row}>
              <Text>Watch Regions</Text>
            </View>
            <View style={pageStyles.row}>
              <PluginSample.WatchRegion />
            </View>
            <View style={pageStyles.row}>
              <Text>SFMC Credentials</Text>
            </View>
            <View style={pageStyles.row}>
              <PluginSample.SFMCCredentials />
            </View>
            <View style={pageStyles.row}>
              <Text>New Region</Text>
            </View>
            <View style={pageStyles.row}>
              <View style={pageStyles.col2}>
                <PluginSample.AddRegion regionType={'circle' as RegionType} />
                <PluginSample.AddRegion
                  regionType={'isochrone' as RegionType}
                />
              </View>
            </View>
            <View style={pageStyles.row}>
              <Text>Retrieve Region</Text>
            </View>
            <View style={pageStyles.row}>
              <PluginSample.RetrieveRegion />
            </View>
            <View style={pageStyles.row}>
              <Text>Remove Region</Text>
            </View>
            <View style={pageStyles.row}>
              <PluginSample.RemoveRegion />
            </View>
            <View style={pageStyles.row}>
              <Text>Retrieve Location</Text>
            </View>
            <View style={pageStyles.row}>
              <PluginSample.RetrieveLocation />
            </View>
            <View style={pageStyles.row}>
              <PluginSample.RemoveLocation />
            </View>
            <View style={pageStyles.row}>
              <Text>Retrieve POI</Text>
            </View>
            <View style={pageStyles.row}>
              <PluginSample.RetrievePOI />
            </View>
            <View style={pageStyles.row}>
              <PluginSample.RemovePOI />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </React.Fragment>
  );
}
