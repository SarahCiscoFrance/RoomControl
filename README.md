# RoomControl 🕹

## Overview
Control the elements of a room such as light and blinds with a Webex video endpoint.

## How to use 💡
On your touch10 or Room Navigator you have a button called *IoT* when you click on it a page appear. On that page you have 4 sections : 


**1. Lighting**

Here you can turn on/off the light. You can also automate the switching on of the light when 1 or more person are detected.


**2. Electric blinds**

Here you can raise or lower the blinds. You can also activate an automatic process : When a call start the blinds are lowering and when it end's the blinds go up


**3. Air conditioner**

In this section the metrics of temperature and humidity are the real metrics (detected by the Room Navigator) but the controls of the air conditioner are fake. They are left as an example.


**4. BluRay**

This section is fake but it's left as an example of use case.

## Installation 🔨

### Clone project

``` bash
git clone https://github.com/SarahCiscoFrance/RoomControl.git
```

### Edit the file *roomControl.js* 
Set the following variables : 

```bash
const IP_RELAY_STORE = ""; // Here set the IP Adresse of your relay that manage the blinds
const IP_RELAY_LIGHT = ""; // Here set the IP Adresse of your relay that manage the light

/**
 * CREDENTIALS OF YOUR RELAY
 */
const LOGIN = ""; // Here set the login
const PASSWD = ""; // Here set the password
```

### Install the files on the device
1. Open a web browser pointing to the IP address of your room device, and sign in to the web interface (you will need a user account with 'administrator' role), and navigate to **CUSTOMIZATION** section and go to **Macro Editor**. Then click on **Import from file** and select the file *roomControl.js*.
2. To finish go to the main page and click on **UI Extensions Editor** after that click on **Merge from file** and choose the file *roomcontrol_UI.xml* 
