var util = require('util');
//HUMIDITY SENSOR
var htdu21dData = require('./temperatureData');
var jsUpmHtu21d = require ('jsupm_htu21d');
var tempSensor = new jsUpmHtu21d.HTU21D(1, htdu21dData.HTDU21D_ADDRESS);
var sempleData = tempSensor.sampleData();
//BLUETOOTH
var bleno = require('bleno');
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function readSensor(){
    var humidity = tempSensor.getHumidity();
    return new Buffer([humidity],'hex');
};

function SensorHumidityCharacteristic(sensorData) {
    SensorHumidityCharacteristic.super_.call(this, {
        uuid: '01010101010101010166616465524741',
        properties: ['read','notify'],
        value: readSensor(),
        descriptors: [
          new BlenoDescriptor({
            uuid: '2901',
            value: 'read humidity'
          })
        ]
    });
    this.sensorData = sensorData;
};

util.inherits(SensorHumidityCharacteristic, BlenoCharacteristic);

SensorHumidityCharacteristic.prototype.onReadRequest = function(offset, callback) {
    //console.log('EchoCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));
    //callback(this.RESULT_SUCCESS, this._value);
    console.log('HumidityCharacteristic - onReadRequest');
    var resultSuccess = BlenoCharacteristic.RESULT_SUCCESS;
    //data = data.slice(offset);
    callback(resultSuccess, readSensor());
};

SensorHumidityCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    console.log('HumidityCharacteristic - onSubscribe');
    this._updateValueCallback = updateValueCallback;
    this._notifyInterval = setInterval(function () {
        updateValueCallback(readSensor());
    }, 3000);
    
};

SensorHumidityCharacteristic.prototype.onUnsubscribe = function() {
    console.log('HumidityCharacteristic - onUnsubscribe');
    this._updateValueCallback = null;
    clearInterval(this._notifyInterval);
    this._notifyInterval = null;
};

SensorHumidityCharacteristic.prototype.onNotify = function() {
    console.log('HumidityCharacteristic - onNotify');
};

module.exports = SensorHumidityCharacteristic;
