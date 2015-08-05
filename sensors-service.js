var util = require('util');
var bleno = require('bleno');
var BlenoPrimaryService = bleno.PrimaryService;

var sensorTemperatureCharacteristic = require('./sensor-temperature-characteristic');
var sensorHumidityCharacteristic = require('./sensor-humidity-characteristic');
var sensorMQ3Characteristic = require('./sensor-mq3-characteristic');
var sensorMQ4Characteristic = require('./sensor-mq4-characteristic');
var sensorMQ6Characteristic = require('./sensor-mq6-characteristic');
var sensorMQ7Characteristic = require('./sensor-mq7-characteristic');

function SensorService(sensorData) {
  SensorService.super_.call(this, {
    uuid: '01010101010101010101010101010101',
    characteristics: [
        new sensorTemperatureCharacteristic(sensorData),
        new sensorHumidityCharacteristic(sensorData),
        new sensorMQ3Characteristic(sensorData),
        new sensorMQ4Characteristic(sensorData),
        new sensorMQ6Characteristic(sensorData),
        new sensorMQ7Characteristic(sensorData),
    ]
  });
}

util.inherits(SensorService, BlenoPrimaryService);

module.exports = SensorService;