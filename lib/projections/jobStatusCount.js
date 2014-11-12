var callback = function(state, event) {
  if (state.counts == null) return {
    success: 0,
    fail: 0,
    incomplete: 0
  };
  switch (event.data.build.status) {
    case 'SUCCESS':
      state.counts.success++;
      break;
    case 'FAIL':
      state.counts.fail++;
      break;
    default:
      state.counts.incomplete++;
  }
};
fromCategory('job')
  .foreachStream()
  .whenAny(callback);