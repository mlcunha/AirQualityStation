var util = require('util');

var bleno = require('bleno');
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;
var mraa = require('mraa'); //require mraa
var analogPinMQ3 = new mraa.Aio(2);//MQ3

function readSensor() {
    var analogValue = analogPinMQ3.read();
    return new Buffer([analogValue],'hex');
}

function SensorMQ3Characteristic(sensorData) {
  SensorMQ3Characteristic.super_.call(this, {
    uuid: '01010101010101010101010101524743',
    properties: ['read','notify'],
    value: readSensor(),
    descriptors: [
      new BlenoDescriptor({
        uuid: '2901',
        value: 'read MQ3 gas sensors value'
      })
    ]
  });
};

util.inherits(SensorMQ3Characteristic, BlenoCharacteristic);

SensorMQ3Characteristic.prototype.onReadRequest = function(offset, callback) {
    console.log('MQ3Characteristic - onReadRequest');
    var resultSuccess = BlenoCharacteristic.RESULT_SUCCESS;
    callback(resultSuccess, readSensor());
};

SensorMQ3Characteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    console.log('MQ3Characteristic - onSubscribe');
    var resultSuccess = BlenoCharacteristic.RESULT_SUCCESS;
    this._updateValueCallback = updateValueCallback;
    this._notifyInterval = setInterval(function () {
        updateValueCallback(readSensor());
    }, 3000);
    
};

SensorMQ3Characteristic.prototype.onUnsubscribe = function() {
    console.log('MQ3Characteristic - onUnsubscribe');
    this._updateValueCallback = null;
    clearInterval(this._notifyInterval);
    this._notifyInterval = null;
};

SensorMQ3Characteristic.prototype.onNotify = function() {
    console.log('MQ3Characteristic - onNotify');
};

module.exports = SensorMQ3Characteristic;
