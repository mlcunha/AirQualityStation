var util = require('util');
//TEMPERATURE SENSOR
var htdu21dData = require('./temperatureData');
var jsUpmHtu21d = require ('jsupm_htu21d');
var tempSensor = new jsUpmHtu21d.HTU21D(1, htdu21dData.HTDU21D_ADDRESS);
var sempleData = tempSensor.sampleData();
//BLUETOOTH
var bleno = require('bleno');
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function readSensor(){
    var temperature = tempSensor.getTemperature();
    return new Buffer([temperature],'hex');
};

function SensorTemperatureCharacteristic(sensorData) {
  SensorTemperatureCharacteristic.super_.call(this, {
    uuid: '01010101010101010166616465524740',
    properties: ['read','notify'],
    value: readSensor(),
    descriptors: [
      new BlenoDescriptor({
        uuid: '2901',
        value: 'read temperature',
        unit:'Celcius'
      })
    ]
  });
  this.sensorData = sensorData;
}

util.inherits(SensorTemperatureCharacteristic, BlenoCharacteristic);

SensorTemperatureCharacteristic.prototype.onReadRequest = function(offset, callback) {
    //console.log('EchoCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));
    //callback(this.RESULT_SUCCESS, this._value);
    console.log('TemperatureCharacteristic - onReadRequest');
    var resultSuccess = BlenoCharacteristic.RESULT_SUCCESS;
    //data = data.slice(offset);
    callback(resultSuccess, readSensor());
};

SensorTemperatureCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    console.log('TemperatureCharacteristic - onSubscribe');
    var resultSuccess = BlenoCharacteristic.RESULT_SUCCESS;
    this._updateValueCallback = updateValueCallback;
    this._notifyInterval = setInterval(function () {
        updateValueCallback(readSensor());
    }, 3000);
    
};

SensorTemperatureCharacteristic.prototype.onUnsubscribe = function() {
    console.log('TemperatureCharacteristic - onUnsubscribe');
    this._updateValueCallback = null;
    clearInterval(this._notifyInterval);
    this._notifyInterval = null;
};

SensorTemperatureCharacteristic.prototype.onNotify = function() {
    console.log('TemperatureCharacteristic - onNotify');
};

module.exports = SensorTemperatureCharacteristic;
