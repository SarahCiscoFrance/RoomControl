# RoomControl 🕹

## Overview
Control the elements of a room such as light and blinds with a Webex video endpoint.

## How

## Installation

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
Open a web browser pointing to the IP address of your room device, and sign in to the web interface (you will need a user account with 'administrator' role), and navigate to **CUSTOMIZATION** section and go to **Macro Editor**
