var calback = function(state, event) {
  switch (event.data.build.status) {
    case 'SUCCESS':
      linkTo('job-' + event.data.name, event);
      break;
    case 'FAIL':
      linkTo('job-' + event.data.name, event);
      break;
    default:
      linkTo('job-' + event.data.name, event);
  }
};

fromStream('jenkinsjob')
  .whenAny(calback);