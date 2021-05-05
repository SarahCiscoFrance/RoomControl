/**
 * Macro title : Room control
 * author : rudferna@cisco.com
 * date : 05/05/2021
 * version : 1.2
 */

import xapi from 'xapi';

/****************************/
/** Set the variable below **/
/****************************/

const IP_RELAY_STORE = ""; // Here set the IP Adresse of your relay
const IP_RELAY_LIGHT = ""; // Here set the IP Adresse of your relay

/**
 * CREDENTIALS OF YOUR RELAY
 */
const LOGIN = "admin"; // Here set the login
const PASSWD = "admin"; // Here set the password

/********** Don't modifiy code below **************/

xapi.Command.UserInterface.Extensions.Widget.SetValue({
    Value: 'off',
    WidgetId: 'storeAutoButton'
});

xapi.Command.UserInterface.Extensions.Widget.SetValue({
    Value: 'off',
    WidgetId: 'autoLightButton'
});

update_navigator_data();
setInterval(function () {
    update_navigator_data();
}, 300000); // all 5 minutes data are updated

/**
 * When a call start the blinds are lowering
 */
xapi.event.on("CallSuccessful", async (event) => {
    if (await getStoreAutoButtonStatus() == 'on') {
        if (await getStatus(2, IP_RELAY_STORE) == "0") {
            sendCommand(2, IP_RELAY_STORE);
            setTimeout(function () {
                sendCommand(2, IP_RELAY_STORE);
            }, 20000);
        } else {
            sendCommand(2, IP_RELAY_STORE); // to set the relay to the value 0
            sendCommand(2, IP_RELAY_STORE);
            setTimeout(function () {
                sendCommand(2, IP_RELAY_STORE);
            }, 20000);
        }
    }
});


/**
 * When a call end the blinds go up
 */
xapi.event.on("CallDisconnect", async (event) => {
    if (await getStoreAutoButtonStatus() == 'on') {
        if (await getStatus(1, IP_RELAY_STORE) == "0") {
            sendCommand(1, IP_RELAY_STORE);
            setTimeout(function () {
                sendCommand(1, IP_RELAY_STORE);
            }, 20000);
        } else {
            sendCommand(1, IP_RELAY_STORE); // to set the relay to the value 0
            sendCommand(1, IP_RELAY_STORE);
            setTimeout(function () {
                sendCommand(1, IP_RELAY_STORE);
            }, 20000);
        }
    }
});


/**
 * When 1 or more people are detected the light comes on
 */
xapi.Status.RoomAnalytics.PeopleCount.Current.on(async value => {
    if(await getAutoLightButtonStatus() == 'on'){
        if(value > 0){
            if (await getStatus(1, IP_RELAY_LIGHT) == "0") {
                sendCommand(1, IP_RELAY_LIGHT);
            }
        }
        else{
            if (await getStatus(1, IP_RELAY_LIGHT) == "1") {
                sendCommand(1, IP_RELAY_LIGHT);
            }
        }
    }
});

xapi.event.on('UserInterface Extensions Widget Action', onGui);

async function onGui(event) {
    console.log(event)

    if (event.Type == 'pressed' && event.WidgetId == 'storeUpDown') {
        if (event.Value == "increment") {
            //check if relay1 is equal to 0 
            if (await getStatus(1, IP_RELAY_STORE) == "0") {
                console.log("INSIDE !!")
                sendCommand(1, IP_RELAY_STORE);
            }
        } else {
            //check if relay2 is equal to 0
            if (await getStatus(2, IP_RELAY_STORE) == "0") {
                sendCommand(2, IP_RELAY_STORE);
            }
        }
    } else if (event.Type == 'released' && event.WidgetId == 'storeUpDown') {
        if (event.Value == "increment") {
            if (await getStatus(1, IP_RELAY_STORE) == "1") {
                sendCommand(1, IP_RELAY_STORE);
            }
        } else {
            if (await getStatus(2, IP_RELAY_STORE) == "1") {
                sendCommand(2, IP_RELAY_STORE);
            }
        }
    } else if (event.Type == 'pressed' && event.WidgetId == 'storeFullDown') {
        if (await getStatus(2, IP_RELAY_STORE) == "0") {
            sendCommand(2, IP_RELAY_STORE);
            setTimeout(function () {
                sendCommand(2, IP_RELAY_STORE);
            }, 20000);
        }
    } else if (event.Type == 'pressed' && event.WidgetId == 'storeFullUp') {
        if (await getStatus(1, IP_RELAY_STORE) == "0") {
            sendCommand(1, IP_RELAY_STORE);
            setTimeout(function () {
                sendCommand(1, IP_RELAY_STORE);
            }, 20000);
        }
    } else if (event.Type == 'changed' && event.WidgetId == 'lightButton') {
        if (event.Value == 'on') {
            if (await getStatus(1, IP_RELAY_LIGHT) == "0") {
                sendCommand(1, IP_RELAY_LIGHT);
            }
        } else if (event.Value == 'off') {
            if (await getStatus(1, IP_RELAY_LIGHT) == "1") {
                sendCommand(1, IP_RELAY_LIGHT);
            }
        }
    }
}



/**
 * Activate or deactivate the relay
 * @param {integer} relay_num - the number of the relay requested
 * @param {string} relay_ip - the ip adress of the relay requested
 */
function sendCommand(relay_num, relay_ip) {
    console.log('Sending command');
    xapi.command('HttpClient Get', {
            AllowInsecureHTTPS: true,
            Url: 'http://' + LOGIN + ':' + PASSWD + '@' + relay_ip + '/relays.cgi?relay=' + relay_num
        })
        .catch((err) => {
            console.log(err);
        });
}



/**
 * Return status of specifie relay
 * @param {integer} relay_num - the number of the specified relay (1 or 2)
 * @param {string} relay_ip - the ip adress of the relay requested
 * @return {string} - the status of the relay requested ("0" or "1" where "0" means 
 * that the realy is not running and "1" that it's running)
 */
function getStatus(relay_num, relay_ip) {
    return new Promise(resolve => {
        xapi.command('HttpClient Get', {
                AllowInsecureHTTPS: true,
                Url: 'http://' + LOGIN + ':' + PASSWD + '@' + relay_ip + '/status.xml'
            }).then(resp => {
                resolve(resp.Body.split("<relay" + relay_num + ">")[1].split("</relay" + relay_num + ">")[0]);
            })
            .catch((err) => {
                console.log(err);
            });
    });
}


/**
 * Display a message on the Cisco Webex device
 * @param {string} title 
 * @param {string} msg 
 */
function displayTextOnScreen(title, msg) {
    xapi.command("UserInterface Message Alert Display", {
        Title: title,
        Text: msg,
        Duration: 5
    });
}

/**
 * Get the value of the button called StoreAutoButton
 */
function getStoreAutoButtonStatus() {
    return new Promise(resolve => {
        xapi.Status.UserInterface.Extensions.Widget
            .get()
            .then(widgets => {
                resolve(widgets.filter(widget => widget.WidgetId == 'storeAutoButton')[0].Value);
            });
    });
}


/**
 * Get the value of the button called LightAutoButton
 */
function getAutoLightButtonStatus() {
    return new Promise(resolve => {
        xapi.Status.UserInterface.Extensions.Widget
            .get()
            .then(widgets => {
                resolve(widgets.filter(widget => widget.WidgetId == 'autoLightButton')[0].Value);
            });
    });
}

/**
* Get connected navigator (touchpanel type)
*/
function getNavigators() {
    return new Promise(resolve => {
        xapi.Status.Peripherals.ConnectedDevice.get().then(async devices => {
            var data = devices.filter(device => device.Name.toLowerCase().includes("navigator") && device.Type.toLowerCase().includes("touchpanel"));
            resolve(data);
        });
    });
}

/**
* Update UI with navigator metrics
*/
function update_navigator_data() {
    getNavigators().then(devices => {
        var temperature = devices[0].RoomAnalytics.AmbientTemperature;
        var humidity = devices[0].RoomAnalytics.RelativeHumidity;
        console.log(temperature, humidity);
        xapi.Command.UserInterface.Extensions.Widget.SetValue({
            Value: temperature + " °C",
            WidgetId: 'widget_actual_temp'
        });
        xapi.Command.UserInterface.Extensions.Widget.SetValue({
            Value: humidity + " %",
            WidgetId: 'widget_actual_humidity'
        });
    });
}