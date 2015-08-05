var util = require('util');

var bleno = require('bleno');
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;
var mraa = require('mraa'); //require mraa
var analogPinMQ4 = new mraa.Aio(4);

function readSensor() {
    var analogValue = analogPinMQ4.read();
    return new Buffer([analogValue],'hex');
}

function SensorMQ4Characteristic(sensorData) {
  SensorMQ4Characteristic.super_.call(this, {
    uuid: '01010101010101010101010101524744',
    properties: ['read','notify'],
    value: readSensor(),
    descriptors: [
      new BlenoDescriptor({
        uuid: '2901',
        value: 'read MQ4 gas sensors value'
      })
    ]
  });
};

util.inherits(SensorMQ4Characteristic, BlenoCharacteristic);

SensorMQ4Characteristic.prototype.onReadRequest = function(offset, callback) {
    console.log('MQ4Characteristic - onReadRequest');
    var resultSuccess = BlenoCharacteristic.RESULT_SUCCESS;
    callback(resultSuccess, readSensor());
};

SensorMQ4Characteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    console.log('MQ4Characteristic - onSubscribe');
    this._updateValueCallback = updateValueCallback;
    this._notifyInterval = setInterval(function () {
        updateValueCallback(readSensor());
    }, 3000);
};

SensorMQ4Characteristic.prototype.onUnsubscribe = function() {
    console.log('MQ4Characteristic - onUnsubscribe');
    this._updateValueCallback = null;
    clearInterval(this._notifyInterval);
    this._notifyInterval = null;
};

SensorMQ4Characteristic.prototype.onNotify = function() {
    console.log('MQ4Characteristic - onNotify');
};

module.exports = SensorMQ4Characteristic;
