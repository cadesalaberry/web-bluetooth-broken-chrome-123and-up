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
