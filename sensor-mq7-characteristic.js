var util = require('util');
var bleno = require('bleno');
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;
var mraa = require('mraa'); //require mraa

var analogPinMQ7 = new mraa.Aio(5);//MQ7

function readSensor() {
    var analogValue = analogPinMQ7.read();
    return new Buffer([analogValue],'hex');
};

function sensorMQ7Characteristic(sensorData) {
  sensorMQ7Characteristic.super_.call(this, {
    uuid: '01010101010101010101010101524746',
    properties: ['read','notify'],
    value: readSensor(),
    descriptors: [
      new BlenoDescriptor({
        uuid: '2901',
        value: 'read MQ7 gas sensor value'
      })
    ]
  });
};

util.inherits(sensorMQ7Characteristic, BlenoCharacteristic);

sensorMQ7Characteristic.prototype.onReadRequest = function(offset, callback) {
    //console.log('EchoCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));
    //callback(this.RESULT_SUCCESS, this._value);
    console.log('MQ7Characteristic - onReadRequest');
    var resultSuccess = BlenoCharacteristic.RESULT_SUCCESS;
    //data = data.slice(offset);
    callback(resultSuccess, readSensor());
};

sensorMQ7Characteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    console.log('MQ7Characteristic - onSubscribe');
    this._updateValueCallback = updateValueCallback;
    this._notifyInterval = setInterval(function () {
        updateValueCallback(readSensor());
    }, 3000);
    
};

sensorMQ7Characteristic.prototype.onUnsubscribe = function() {
    console.log('MQ7Characteristic - onUnsubscribe');
    this._updateValueCallback = null;
    clearInterval(this._notifyInterval);
    this._notifyInterval = null;
};

sensorMQ7Characteristic.prototype.onNotify = function() {
    console.log('MQ7Characteristic - onNotify');
};

module.exports = sensorMQ7Characteristic;
