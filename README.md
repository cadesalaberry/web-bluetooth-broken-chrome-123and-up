# web-bluetooth-broken-chrome-123and-up

The page to test is available here:

https://cadesalaberry.github.io/web-bluetooth-broken-chrome-123and-up/

The issue has been reported here:

https://issues.chromium.org/issues/360888485

Note that the code does not use `watchAdvertisement`.

## Requirements

- Tested on a Chromebook 126
- Tested on a Macbook M2 Max (Version 14.5 (23F79))
- Enable ff `chrome://flags/#enable-web-bluetooth-new-permissions-backend`
- Enable ff `chrome://flags/#enable-experimental-web-platform-features`

## Working Flow on MacOS - Chromium Version 122.0.6261.128 (Official Build) (arm64)

- Add the device with the "Add Blood Pressure Monitor" button
- Select it in the device picker
- Pairing should now be successful
- REFRESH THE PAGE
- Click on the "Listen for measures" button
- This should result in a `NetworkError: Bluetooth Device is no longer in range.`
- Start a measure on the blood pressure monitor
- Once the bluetooth icon is blinking on the device it means that it is trying to upload the results to a computer
- Click on the "Listen for measures" button
- You should get the following log:

```
globalAccountId : 1249353131
Found 2 authorized devices.
Connecting to 0810A0306F36F9 (TUSdb0vaZffDHjs11Z4zug==)...
"0810A0306F36F9" (TUSdb0vaZffDHjs11Z4zug==) was found, attempting connection...
Error connecting to 0810A0306F36F9: NetworkError: Bluetooth Device is no longer in range.
Connecting to 0810A0306F36F9 (TUSdb0vaZffDHjs11Z4zug==)...
"0810A0306F36F9" (TUSdb0vaZffDHjs11Z4zug==) was found, attempting connection...
❤️: REQUESTING_BPM_MEASURE
> BPM Notifications started
< "BPM Char Changed": a1 ab 0 9 0
❤️: RECEIVED_RANDOM
❤️: SENDING_VERIFICATION_CODE
❤️: SENDING_TIME_OFFSET
❤️: REQUEST_MEASUREMENT
> Start notifications for BPM
✅ Systolic: 113, Diastolic: 78, Pulsation: 67
❤️: SENDING_DISCONNECTION
❤️: MEASURE_ACQUIRED
```

## Failing Flow on MacOS - Chrome Version 123.0.6312.122 (Official Build) (arm64)

Follow the instructions for the working flow on 122.
Once the page is refreshed, chrome is unable to connect back to the device. It always appear as `no longer in range`.

```
globalAccountId : 741820389
Found 2 authorized devices.
Connecting to 0810A0306F36F9 (TUSdb0vaZffDHjs11Z4zug==)...
"0810A0306F36F9" (TUSdb0vaZffDHjs11Z4zug==) was found, attempting connection...
Error connecting to 0810A0306F36F9: NetworkError: Bluetooth Device is no longer in range.
Connecting to 0810A0306F36F9 (TUSdb0vaZffDHjs11Z4zug==)...
"0810A0306F36F9" (TUSdb0vaZffDHjs11Z4zug==) was found, attempting connection...
Error connecting to 0810A0306F36F9: NetworkError: Bluetooth Device is no longer in range.
Connecting to 0810A0306F36F9 (TUSdb0vaZffDHjs11Z4zug==)...
"0810A0306F36F9" (TUSdb0vaZffDHjs11Z4zug==) was found, attempting connection...
Error connecting to 0810A0306F36F9: NetworkError: Bluetooth Device is no longer in range.
Connecting to 0810A0306F36F9 (TUSdb0vaZffDHjs11Z4zug==)...
"0810A0306F36F9" (TUSdb0vaZffDHjs11Z4zug==) was found, attempting connection...
Error connecting to 0810A0306F36F9: NetworkError: Bluetooth Device is no longer in range.
Connecting to 0810A0306F36F9 (TUSdb0vaZffDHjs11Z4zug==)...
"0810A0306F36F9" (TUSdb0vaZffDHjs11Z4zug==) was found, attempting connection...
Error connecting to 0810A0306F36F9: NetworkError: Bluetooth Device is no longer in range.
Connecting to 0810A0306F36F9 (TUSdb0vaZffDHjs11Z4zug==)...
"0810A0306F36F9" (TUSdb0vaZffDHjs11Z4zug==) was found, attempting connection...
Error connecting to 0810A0306F36F9: NetworkError: Bluetooth Device is no longer in range.
Connecting to 0810A0306F36F9 (TUSdb0vaZffDHjs11Z4zug==)...
"0810A0306F36F9" (TUSdb0vaZffDHjs11Z4zug==) was found, attempting connection...
Error connecting to 0810A0306F36F9: NetworkError: Bluetooth Device is no longer in range.
```

## Crash on Version MacOS - 127.0.6533.120 (Official Build) (arm64)

The crash happens when calling startNotifications()

```
globalAccountId : 4254967178
Found 2 authorized devices.
Prompting user for a new device...
> User picked 1810A0 (dgYlbPIgHaSl0kippgpq8g==)
>>>> CRASH <<<<
```

## Failing Flow on MacOS - Version 130.0.6693.0 (Official Build) canary (arm64)

I tried after this issue was fixed: https://issues.chromium.org/issues/362116535
The crash does not happen anymore.
However I still cannot get the data sent by the bluetooth device once the page is refreshed.
Getting the data works before a page reload.

```
globalAccountId : 3428219340
Found 2 authorized devices.
Connecting to 1810A0 (hSgm1F2U85RusQqkXoN3pw==)...
"1810A0" (hSgm1F2U85RusQqkXoN3pw==) was found, attempting connection...
Error connecting to 1810A0: NetworkError: Bluetooth Device is no longer in range.
Connecting to 1810A0 (hSgm1F2U85RusQqkXoN3pw==)...
"1810A0" (hSgm1F2U85RusQqkXoN3pw==) was found, attempting connection...
Error connecting to 1810A0: NetworkError: Bluetooth Device is no longer in range.
Connecting to 1810A0 (hSgm1F2U85RusQqkXoN3pw==)...
"1810A0" (hSgm1F2U85RusQqkXoN3pw==) was found, attempting connection...
Error connecting to 1810A0: NetworkError: Bluetooth Device is no longer in range.
Connecting to 1810A0 (hSgm1F2U85RusQqkXoN3pw==)...
"1810A0" (hSgm1F2U85RusQqkXoN3pw==) was found, attempting connection...
Error connecting to 1810A0: NetworkError: Bluetooth Device is no longer in range.
Connecting to 1810A0 (hSgm1F2U85RusQqkXoN3pw==)...
"1810A0" (hSgm1F2U85RusQqkXoN3pw==) was found, attempting connection...
Error connecting to 1810A0: NetworkError: Bluetooth Device is no longer in range.
```

## 2024.09.03 - Failing Flow on ChromeOS - 126.0.6478.222 (Build officiel) (64 bits)

I tried the blood pressure monitor on a `ASUS Chromebook C523N (board: coral)` I had lying around.

```
Google Chrome	126.0.6478.222 (Build officiel) (64 bits)
Révision	803933f6b3177592370be766f36d7095a1903fd0-refs/branch-heads/6478@{#1853}
Plate-forme	15886.74.0 (Official Build) stable-channel coral
Version du micrologiciel	Google_Coral.10068.113.0
ID de la personnalisation	BABYTIGER
```

After clicking 5 times on "Listen for measures", all the "Connection attempt failed" are displayed at the same time.

```
globalAccountId : 4194637317
Found 1 authorized devices.
Connecting to 1810A0 (tO/HqaL76hQk3k/OJ1Mpbw==)...
"1810A0" (tO/HqaL76hQk3k/OJ1Mpbw==) was found, attempting connection...
Connecting to 1810A0 (tO/HqaL76hQk3k/OJ1Mpbw==)...
"1810A0" (tO/HqaL76hQk3k/OJ1Mpbw==) was found, attempting connection...
Connecting to 1810A0 (tO/HqaL76hQk3k/OJ1Mpbw==)...
"1810A0" (tO/HqaL76hQk3k/OJ1Mpbw==) was found, attempting connection...
Connecting to 1810A0 (tO/HqaL76hQk3k/OJ1Mpbw==)...
"1810A0" (tO/HqaL76hQk3k/OJ1Mpbw==) was found, attempting connection...
Connecting to 1810A0 (tO/HqaL76hQk3k/OJ1Mpbw==)...
"1810A0" (tO/HqaL76hQk3k/OJ1Mpbw==) was found, attempting connection...
Error connecting to 1810A0: NetworkError: Connection Error: .
Error connecting to 1810A0: NetworkError: Connection Error: Connection attempt failed.
Error connecting to 1810A0: NetworkError: Connection Error: Connection attempt failed.
Error connecting to 1810A0: NetworkError: Connection Error: Connection attempt failed.
Error connecting to 1810A0: NetworkError: Connection Error: Connection attempt failed.
```

## 2024.09.09 - Successful Flow on ChromeOS - 120.0.6099.331 (Build officiel) (64 bits)

```
globalAccountId : 3313465336
Found 1 authorized devices.
Connecting to 1810A0 (eCk8EaFEjWQdbbM0AhmsKw==)...
"1810A0" (eCk8EaFEjWQdbbM0AhmsKw==) was found, attempting connection...
Waiting for advertisement from device #eCk8EaFEjWQdbbM0AhmsKw==...
Advertisement received: [object BluetoothAdvertisingEvent]
❤️ : REQUESTING_BPM_MEASURE
> BPM Notifications started
< "BPM Char Changed": a1 f4 0 a 0
❤️ : RECEIVED_RANDOM
❤️ : SENDING_VERIFICATION_CODE
❤️ : SENDING_TIME_OFFSET
❤️ : REQUEST_MEASUREMENT
> Start notifications for BPM
✅ Systolic: 126, Diastolic: 87, Pulsation: 73
❤️ : SENDING_DISCONNECTION
❤️ : MEASURE_ACQUIRED
```

## 2024.09.09 - Failing Flow on ChromeOS - 127.0.6533.138 (Build officiel) (64 bits)

```
globalAccountId : 4245209078
Found 1 authorized devices.
Connecting to 1810A0 (asfjzDiWcbBpW1Is7+9PMA==)...
"1810A0" (asfjzDiWcbBpW1Is7+9PMA==) was found, attempting connection...
Waiting for advertisement from device #asfjzDiWcbBpW1Is7+9PMA==...
```

## 2024.09.10 - chrome://device-log

I collected bluetooth logs from the `chrome://device-log` page, with the blood pressure monitor `1810A0 (94:E3:6D:6D:E7:3B)`.
Here is the scenario I followed on both devices:

- open the `chrome://device-log` page and filter on bluetooth only
- make sure the device is not already paired on the Chromebook. device.forget() if needed.
- refresh the pairing page page
- proceed with pairing the blood pressure monitor on the pairing page (With "Add Blood Pressure Monitor")
- refresh the page
- proceed with a measure from the blood pressure monitor (With "Listen AFTER advertisement")
- I expect the measure to show up on screen (✅ on M120, ❌ on M127)

The two log files are in the repo:

- [M120](./M120_94_E3_6D_6D_E7_3B.mhtml)
- [M127](./M127_94_E3_6D_6D_E7_3B.mhtml)


## 2024.10.11 - Successful Flow on ChromeOS - 130.0.6723.36 (Build officiel) beta (64 bits)

Trying with "Listen with ADVERTISEMENT HACK" several times, attempts were succesful
Here is the scenario I followed on the chromebook:

- Add Blood Pressure Monitor => pair the device
- Refresh the page
- Refresh the devices
- Start a measure on the blood pressure monitor
- First attempt: Click on the "Listen with ADVERTISEMENT HACK" button at the middle and end of the measure
- Second attempt: Click on the "Listen with ADVERTISEMENT HACK" button at the end of the measure only once
- Third attempt: Click on the "Listen with ADVERTISEMENT HACK" button at the beginning and end of the measure
- Every attempt were successful, even with errors like "Unknown error when connecting to the device" and "Bluetooth Device is no longer in range"
- Tested in salle calme with probably a lot of noises around

```
globalAccountId : 2047375666
Found 1 authorized devices.
> User refreshed authorized devices...
Found 1 authorized devices.
Connecting to 1810A0 (W1OKFHw/m8vZLKNZhjhRYg==) using ADVERTISEMENT_HACK strategy...
Error found using ADVERTISEMENT_HACK strategy connecting to 1810A0: NetworkError: Unknown error when connecting to the device.
Connecting to 1810A0 (W1OKFHw/m8vZLKNZhjhRYg==) using ADVERTISEMENT_HACK strategy...
Error found using ADVERTISEMENT_HACK strategy connecting to 1810A0: NetworkError: Bluetooth Device is no longer in range.
Connecting to 1810A0 (W1OKFHw/m8vZLKNZhjhRYg==) using ADVERTISEMENT_HACK strategy...
❤️: REQUESTING_BPM_MEASURE
> BPM Notifications started
< "BPM Char Changed": a1 b8 1 10 0 
❤️: RECEIVED_RANDOM
❤️: SENDING_VERIFICATION_CODE
❤️: SENDING_TIME_OFFSET
❤️: REQUEST_MEASUREMENT
> Start notifications for BPM
✅ Systolic: 127, Diastolic: 63, Pulsation: 78
❤️: SENDING_DISCONNECTION
❤️: MEASURE_ACQUIRED
Connecting to 1810A0 (W1OKFHw/m8vZLKNZhjhRYg==) using ADVERTISEMENT_HACK strategy...
❤️: REQUESTING_BPM_MEASURE
> BPM Notifications started
< "BPM Char Changed": a1 4b 0 3d 0 
❤️: RECEIVED_RANDOM
❤️: SENDING_VERIFICATION_CODE
❤️: SENDING_TIME_OFFSET
❤️: REQUEST_MEASUREMENT
> Start notifications for BPM
✅ Systolic: 124, Diastolic: 66, Pulsation: 77
❤️: SENDING_DISCONNECTION
❤️: MEASURE_ACQUIRED
Connecting to 1810A0 (W1OKFHw/m8vZLKNZhjhRYg==) using ADVERTISEMENT_HACK strategy...
Error found using ADVERTISEMENT_HACK strategy connecting to 1810A0: NetworkError: Bluetooth Device is no longer in range.
Connecting to 1810A0 (W1OKFHw/m8vZLKNZhjhRYg==) using ADVERTISEMENT_HACK strategy...
❤️: REQUESTING_BPM_MEASURE
> BPM Notifications started
< "BPM Char Changed": a1 d 0 39 0 
❤️: RECEIVED_RANDOM
❤️: SENDING_VERIFICATION_CODE
❤️: SENDING_TIME_OFFSET
❤️: REQUEST_MEASUREMENT
> Start notifications for BPM
✅ Systolic: 122, Diastolic: 81, Pulsation: 83
❤️: SENDING_DISCONNECTION
❤️: MEASURE_ACQUIRED
```

# Demonstration of the required usecase - 2024.11.04 - Failing Flow on Mac M3 Pro - 130.0.6723.92 (Build officiel) (arm64)
In the context of integrating and reading TRANSTEK LS810-BS results in our web application via the web Bluetooth API. We tried the following:

- Pair the device by calling requestDevice which triggers a popup on which we find the device that we want we pair to it.
- Connect to the GATT server through `device.gatt.connect()` every time we want to read the measurements from the device through a NOTIFY and READ characteristics. (even after page refresh or browser close/reopen or even computer restart)

This was working up until version v120 of Chrome, after that version, the following happened:
- We Pair the device through requestDevice.
- If the page is refreshed, then we try to do device.gatt.connect() to read the measurements. We systematically get the error "Device out of range".
  
I'll add a video showcasing how my device works, I used the Nordic Semiconductor Android app nRF connect in my testing to be sure that my device does not advertise after measurements and it only advertises while being in "Pairing mode" https://drive.google.com/file/d/1XANUyP4zmprpUNBd0ogCKhaSTDIZG4fR/view?usp=sharing

A video showcasing the problem on the web app https://drive.google.com/file/d/16NJ6fNpqWkWaGPapJEFc40ZBDckT6dc_/view?usp=sharing
