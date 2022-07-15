'use strict';

import state_tree from './state_tree';
import jasmineRequire from './jasmine';
import PluginSpec from './spec/PluginSpec';

export default {
  //Export object with an execute function
  execute: function () {
    // Get a cursor that we can use to add new test results to
    var resultsCursor = state_tree.select('test_results');

    // Boot jasmine (this is borrowed from their boot.js script)
    var jasmine = jasmineRequire.core(jasmineRequire);
    var env = jasmine.getEnv();
    env.configure({ random: false });
    var jasmineInterface = jasmineRequire.interface(jasmine, env);

    // Globally expose Jasmine's DSL
    function extend(destination, source) {
      for (var property in source) destination[property] = source[property];
      return destination;
    }
    extend(window, jasmineInterface);

    // Helper function for adding test results to the state tree
    function emitResult(text, classes = []) {
      console.log(text);
      resultsCursor.push({
        text: text,
        classes: classes,
      });
    }

    // Custom reporter to collect the test results
    var reactReporter = {
      jasmineStarted: function (suiteInfo) {
        // Let everybody know we are testing
        state_tree.set('testing', true);

        // Clear out old test results
        state_tree.set('test_results', []);
      },
      suiteStarted: function (result) {
        emitResult(result.fullName, ['suite_started']);
      },
      specStarted: function (result) {
        emitResult(result.fullName, ['spec_started']);
      },
      specDone: function (result) {
        var spec_class = 'empty';
        if (
          result.passedExpectations.length > 0 &&
          result.failedExpectations.length === 0
        ) {
          // There were some passes and no failures
          spec_class = 'passed';
        } else if (result.failedExpectations.length > 0) {
          // There were failures
          spec_class = 'failed';
        }

        emitResult(
          result.status +
            ' (' +
            result.passedExpectations.length +
            ' passed, ' +
            result.failedExpectations.length +
            ' failed)',
          [spec_class, 'spec_done']
        );
        for (var i = 0; i < result.failedExpectations.length; i++) {
          emitResult('Failure: ' + result.failedExpectations[i].message, [
            'failure_detail',
          ]);
          // We can use the error stack too if we want :
          // result.failedExpectations[i].stack
        }
      },
      suiteDone: function (result) {
        // Nothing to do here
      },
      jasmineDone: function () {
        // Let everyone know we are done testing
        state_tree.set('testing', false);
      },
    };
    env.addReporter(reactReporter);

    // Invoke our test specs
    PluginSpec();

    // Run the tests
    env.execute();
  },
};
