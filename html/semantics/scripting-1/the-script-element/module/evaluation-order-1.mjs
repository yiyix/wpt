log.push("step-1-1");
queueMicrotask(() => log.push("microtask"));
log.push("step-1-2");

test_load.step_timeout(() => testDone(), 0);

throw new Error("error");
