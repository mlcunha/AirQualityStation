mraa
--------------------------------------------
* Included on the IoTDevkit Linux Image 

* source:  https://github.com/intel-iot-devkit/mraa
* license:  https://github.com/intel-iot-devkit/mraa/blob/9d488c8e869e59e1dff2c68218a8f38e9b959cd7/cmake/modules/LICENSE_1_0.txt


Connectiong do Edison:
==============================================
screen /dev/xx.usbserial-XXXXXXXX 115200 –L
configure_edison --setup
configure_edison --wifi


BLUETOOTH SETUP
==================================================
http://rexstjohn.com/configure-intel-edison-for-bluetooth-le-smart-development/

rfkill unblock bluetooth
hciconfig hci0 up

vi /etc/opkg/base-feeds.conf (insert only following lines)
src/gz all http://repo.opkg.net/edison/repo/all
src/gz edison http://repo.opkg.net/edison/repo/edison
src/gz core2-32 http://repo.opkg.net/edison/repo/core2-32

opkg update
opkg install bluez5-dev

npm install -g async
npm install noble
npm install bleno

rfkill unblock bluetooth
systemctl disable bluetooth
hciconfig hci0 up
