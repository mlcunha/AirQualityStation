var util = require('util');

var bleno = require('bleno');
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;
var mraa = require('mraa'); //require mraa
var analogPinMQ6 = new mraa.Aio(3);//MQ6

function readSensor() {
    var analogValue = analogPinMQ6.read();
    return new Buffer([analogValue],'hex');
};

function SensorMQ6Characteristic(sensorData) {
  SensorMQ6Characteristic.super_.call(this, {
    uuid: '01010101010101010101010101524745',
    properties: ['read','notify'],
    value: readSensor(),
    descriptors: [
      new BlenoDescriptor({
        uuid: '2901',
        value: 'read MQ6 gas sensors value'
      })
    ]
  });
};

util.inherits(SensorMQ6Characteristic, BlenoCharacteristic);

SensorMQ6Characteristic.prototype.onReadRequest = function(offset, callback) {
    //console.log('EchoCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));
    //callback(this.RESULT_SUCCESS, this._value);
    console.log('MQ6Characteristic - onReadRequest');
    var resultSuccess = BlenoCharacteristic.RESULT_SUCCESS;
    //data = data.slice(offset);
    callback(resultSuccess, readSensor());
};

SensorMQ6Characteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    console.log('MQ6Characteristic - onSubscribe');
    var resultSuccess = BlenoCharacteristic.RESULT_SUCCESS;
    this._updateValueCallback = updateValueCallback;
    this._notifyInterval = setInterval(function () {
        updateValueCallback(readSensor());
    }, 3000);
    
};

SensorMQ6Characteristic.prototype.onUnsubscribe = function() {
    console.log('MQ6Characteristic - onUnsubscribe');
    this._updateValueCallback = null;
    clearInterval(this._notifyInterval);
    this._notifyInterval = null;
};

SensorMQ6Characteristic.prototype.onNotify = function() {
    console.log('MQ6Characteristic - onNotify');
};

module.exports = SensorMQ6Characteristic;