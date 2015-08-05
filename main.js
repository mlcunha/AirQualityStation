//FUNCOES NECESSARIAS PARA O SISTEMA
var mraa = require('mraa');
var jsUpmHtu21d = require ('jsupm_htu21d');
var bleno = require('bleno');

var htdu21dData = require('./temperatureData');
//INICIA SENSOR DE TEMPERATURA
var tempSensor = new jsUpmHtu21d.HTU21D(1, htdu21dData.HTDU21D_ADDRESS);
var sempleData = tempSensor.sampleData();

//FUNCOES NECESSARIAS PARA INICIAR BLUETOOTH CORRETAMENTE
var execSync = require('exec-sync');
execSync('rfkill unblock bluetooth');
execSync('systemctl disable bluetooth');
execSync('hciconfig hci0 up');

//INICIA PORTAR ANALOGICAS PARA SENSOR DE GAS
var analogPinMQ7 = new mraa.Aio(0);//MQ7
var analogPinMQ4 = new mraa.Aio(1);//MQ4
var analogPinMQ6 = new mraa.Aio(2);//MQ6
var analogPinMQ3 = new mraa.Aio(3);//MQ3

var analogValue1 = analogPinMQ3.read(); //read the value of the analog pin
//console.log('Alcohol(MQ3):' + analogValue1); //write the value of the analog pin to the console
var analogValue2 = analogPinMQ7.read();
//console.log('Carbon Monoxide(MQ7):' + analogValue2);
var analogValue3 = analogPinMQ6.read();
//console.log('LPG(MQ6):' + analogValue3);
var analogValue4 = analogPinMQ4.read();
//console.log('Methane(MQ4):' + analogValue4);
var temperature = tempSensor.getTemperature();
//console.log('Temperature:' +temperature);
var humidity = tempSensor.getHumidity();
//console.log('Humidity:' + humidity);

var sensorsData = {
    temperature: temperature,
    humidity: humidity,
    mq3: analogValue1,
    mq4: analogValue4,
    mq6: analogValue3,
    mq7: analogValue2
};
//console.log(JSON.stringify(sensorsData));

//BLUETOOTH CONFIG
var nameService = 'AirQualityStation';
var SensorsService = require('./sensors-service');
var sensorService = new SensorsService(sensorsData);
bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);
  if (state === 'poweredOn') {
    bleno.startAdvertising(nameService, [sensorService.uuid]);
  } else {
    bleno.stopAdvertising();
  }
});
bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
  if (!error) {
    console.log('Inicializando Servico');
    bleno.setServices([
        sensorService
    ]);
  }
});
