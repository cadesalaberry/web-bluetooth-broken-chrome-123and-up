# web-bluetooth-broken-chrome-123and-up

The page to test is available here:

https://cadesalaberry.github.io/web-bluetooth-broken-chrome-123and-up/

## Requirements

- Tested on a Chromebook 126
- Tested on a Macbook M2 Max (Version 14.5 (23F79))
- Enable ff `chrome://flags/#enable-web-bluetooth-new-permissions-backend`
- Enable ff `chrome://flags/#enable-experimental-web-platform-features`

## Working Flow on Chromium Version 120.0.6086.0 (Developer Build) (arm64)

```
globalAccountId : 4254967178
Found 2 authorized devices.
Prompting user for a new device...
> User picked 1810A0 (dgYlbPIgHaSl0kippgpq8g==)
> Notifications started
< "charChangedPairing": a0 6d 6d e3 94
👥: RECEIVED_PASSWORD
👥: REQUESTING_RANDOM_FROM_ACCOUNT_ID
< "charChangedPairing": a1 1d 20 27 0
👥: RECEIVED_RANDOM_FOR_VERIFICATION
👥: SENDING_VERIFICATION_CODE
👥: SENDING_TIME_OFFSET
👥: SENDING_DISCONNECTION
👥: PAIRED
👥: DISCONNECTED
Connecting to 1810A0 (dgYlbPIgHaSl0kippgpq8g==)...
"1810A0" (dgYlbPIgHaSl0kippgpq8g==) was found, attempting connection...
❤️: REQUESTING_BPM_MEASURE
> BPM Notifications started
< "BPM Char Changed": a1 3a 4 8 0
👥: RECEIVED_RANDOM
❤️: SENDING_VERIFICATION_CODE
❤️: SENDING_TIME_OFFSET
❤️: REQUEST_MEASUREMENT
> Measurement notifications started
< "readMeasurementData": 1e 72 0 45 0 5c 0 13 23 86 1b 51 0 0 0 60
✅ Systolic: 114, Diastolic: 69, Pulsation: 81
❤️: SENDING_DISCONNECTION
❤️: MEASURE_ACQUIRED
👥: DISCONNECTED
```

## Crash on Version 127.0.6533.120 (Official Build) (arm64)

The crash happens when calling startNotifications()

```
globalAccountId : 4254967178
Found 2 authorized devices.
Prompting user for a new device...
> User picked 1810A0 (dgYlbPIgHaSl0kippgpq8g==)
>>>> CRASH <<<<
```
