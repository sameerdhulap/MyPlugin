import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Text } from 'react-native';
import TestRunnerComponent from '../components/TestRunnerComponent';

export default function JasmineTests(props: any) {
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
    mainContainer: {
      flex: 1,
      overflow: 'scroll',
      minHeight: 100,
      marginVertical: 5,
      paddingLeft: 5,
      paddingRight: 5,
    },
    row: {
      paddingBottom: 5,
    },
  });
  return (
    <React.Fragment>
      <SafeAreaView style={pageStyles.topBar}>{props.children}</SafeAreaView>
      <SafeAreaView style={pageStyles.container}>
        <View style={pageStyles.header}>
          <Text style={pageStyles.title}>Geofence Plugin Test</Text>
        </View>
        <ScrollView>
          <View style={pageStyles.mainContainer}>
            <View style={pageStyles.row}>
              <TestRunnerComponent />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </React.Fragment>
  );
}
