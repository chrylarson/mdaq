'use strict';

describe('Service: Cordova', function () {

  // load the service's module
  beforeEach(module('yoApp'));

  // instantiate service
  var Cordova;
  beforeEach(inject(function (_Cordova_) {
    Cordova = _Cordova_;
  }));

  it('should do something', function () {
    expect(!!Cordova).toBe(true);
  });

});
