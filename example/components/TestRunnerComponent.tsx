'use strict';

import React, { Component } from 'react';
import { Text, TouchableHighlight, StyleSheet, View } from 'react-native';

import TestRunner from '../tests/TestRunner';
import _ from 'lodash';
import state_tree from '../tests/state_tree';
var styles = StyleSheet.create(require('./component_styles'));

export default class TestRunnerComponent extends Component {
  constructor(props: any) {
    super(props);
    this.state = state_tree.get();
  }

  onTreeUpdate(e) {
    this.setState(state_tree.get());
  }

  onStartTests() {
    //We could use an "actions" module here but for the sake of brevity I am directly invoking the TestRunner
    TestRunner.execute();
  }

  componentDidMount() {
    state_tree.on('write', this.onTreeUpdate.bind(this));
    this.onStartTests();
  }

  componentWillUnmount() {
    state_tree.off('write', this.onTreeUpdate.bind(this));
  }

  render() {
    var buttonStyle = styles.button;
    if (this.state.testing) {
      buttonStyle = styles.button_disabled;
    }
    var startButton = (
      <View style={styles.container}>
        <TouchableHighlight
          onPress={this.onStartTests.bind(this)}
          style={buttonStyle}
        >
          <Text style={styles.buttonText}>Start Tests</Text>
        </TouchableHighlight>
      </View>
    );

    var testResults = [];
    _.each(this.state.test_results, function (test_result, index) {
      //test_result has style names, we need to pluck them out of styles object
      var result_styles = _.values(_.pick(styles, test_result.classes));

      //and add a common style for each result
      result_styles.push(styles.test_result);

      testResults.push(
        <Text key={'result_' + index} style={result_styles}>
          {test_result.text}
        </Text>
      );
    });

    return (
      <View style={styles.container}>
        {startButton}
        {testResults}
      </View>
    );
  }
}
