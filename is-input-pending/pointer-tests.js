// Use a reasonable time to wait after dispatching events, since we want to be
// able to test for cases where isInputPending returns false.
const DISPATCH_WAIT_TIME_MS = 100;

// Dispatches the given sequence of actions and verifies isInputPending state
// after dispatch according to expectations. Returns when all dispatched input
// has been handled.
const pointerTest = async (label, actions, expectations) => {
  promise_test(async () => {
    // Give focus to the page first, before running the test.
    await new test_driver.Actions()
      .pointerMove(0, 0)
      .pointerDown()
      .send();

    const discreteOptions = new IsInputPendingOptions();
    const continuousOptions = new IsInputPendingOptions({ includeContinuous: true });

    assert_false(navigator.scheduling.isInputPending(discreteOptions), 'no input should be pending before test');
    assert_false(navigator.scheduling.isInputPending(continuousOptions), 'no input should be pending before test');

    const result = actions.send();

    // Wait a reasonable amount of time for the event to be enqueued.
    for (const end = performance.now() + DISPATCH_WAIT_TIME_MS; performance.now() < end;) {}

    assert_equals(navigator.scheduling.isInputPending(discreteOptions),
                  expectations.discrete,
                  'discrete result');
    assert_equals(navigator.scheduling.isInputPending(continuousOptions),
                  expectations.continuous,
                  'continuous result');

    await result;

    assert_false(navigator.scheduling.isInputPending(discreteOptions), 'no input should be pending after actions result');
    assert_false(navigator.scheduling.isInputPending(continuousOptions), 'no input should be pending after actions result');
  }, label);
}

// Runs a suite of pointer-related tests at the given coordinates with the
// provided detection expectations.
const runPointerTests = (label, x, y, expected) => {
  for (const type of ['mouse', 'touch', 'pen']) {
    pointerTest(
      `${label} (pointerdown, ${type})`,
      new test_driver.Actions().addPointer('p', type).pointerMove(x, y).pointerDown(),
      {
        discrete: expected,
        continuous: expected,
      }
    );

    pointerTest(
      `${label} (pointerup, ${type})`,
      new test_driver.Actions().addPointer('p', type).pointerMove(x, y).pointerUp(),
      {
        discrete: expected,
        continuous: expected,
      }
    );

    pointerTest(
      `${label} (pointermove, ${type})`,
      new test_driver.Actions().addPointer('p', type).pointerMove(x, y),
      {
        discrete: false,
        continuous: expected,
      }
    );
  }
}
