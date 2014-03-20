'use strict';

describe('Service: accelerometer', function () {

  // load the service's module
  beforeEach(module('yoApp'));

  // instantiate service
  var accelerometer;
  beforeEach(inject(function (_accelerometer_) {
    accelerometer = _accelerometer_;
  }));

  it('should do something', function () {
    expect(!!accelerometer).toBe(true);
  });

});
