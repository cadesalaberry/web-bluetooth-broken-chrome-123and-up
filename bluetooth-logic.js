let globalAccountId, globalPassword;
let globalState = "IDLE",
  globalService,
  globalReadChar;
// HRD means Heart Rate Device
let globalHRDState = "IDLE",
  globalHRDService,
  globalHRDReadChar,
  globalHRDBPMReadChar;

const globalAccountId16 = Math.floor(
  Math.random() * (Math.pow(2, 32) - 1)
).toString(16);

const setState = (state) => {
  log("Setting state to: " + state);
  globalState = state;
};

const setHRDState = (state) => {
  log("Setting HRD state to: " + state);
  globalHRDState = state;
};

const SCALE_OPTS = {
  bluetoothStorageKey: 0x7802,
  scanFilter: {
    filters: [{ name: "11255B" }],
    optionalServices: [0x7802],
  },
  type: "SCALE",
  characteristics: [
    0x8a21, // [Indicate] Weight measurement transfer from Device to App
    0x8a22, // [Indicate] Body composition transfer from Device to App
    0x8a23, // [Notify] Weight measurement transfer from Device to App
  ],
};

const BLOOD_PRESSURE_MONITOR_OPTS = {
  bluetoothStorageKey: 0x7809,
  scanFilter: { filters: [{ services: [0x7809] }] },
  type: "BLOOD_PRESSURE_MONITOR",
  characteristics: [
    0x8a91, // [Indicate] Blood pressure measurement transfer from Device to App
    0x8a92, // [Notifiy] Blood pressure measurement transfer from Device to App
  ],
};

const delayPromise = (delay) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

const pairDevice = async (device) => {
  const server = await device.gatt.connect();
  const service = await server.getPrimaryService(0x7809);
  // Getting read Characteristic
  const readChar = await service.getCharacteristic(0x8a82);
  // launching pairing protocol
  await readChar.startNotifications();
  log("> Notifications started");

  readChar.addEventListener(
    "characteristicvaluechanged",
    readCharChangedPairing
  );

  globalService = service;
  globalReadChar = readChar;
};

const readCharChangedPairing = async (event) => {
  let value = event.target.value;
  log("read value : " + value);
  // We are receiving the password...
  if (value.getUint8(0).toString(16) === "a0") {
    setState("RECEIVED_PASSWORD");
    const password = value.getUint32(1, true);
    logValue(password);
    //  get accountId from accountId16
    const accountId = parseInt(globalAccountId16, 16);
    // send account id
    await globalService.getCharacteristic(0x8a81).then((writeChar) => {
      const buffer = new ArrayBuffer(5);
      const view = new DataView(buffer);
      view.setUint8(0, 0x21);
      view.setUint32(1, accountId, true);
      setState("REQUESTING_RANDOM");
      return writeChar.writeValue(buffer);
    });
    await delayPromise(100);

    globalAccountId = accountId;
    globalPasssword = password;
  }
  // We are receiving the random value...
  if (value.getUint8(0).toString(16) === "a1") {
    setState("RECEIVED_RANDOM_FOR_VERIFICATION");
    const random = value.getUint32(1, true);
    logValue(random);
    // calculate verification code
    const verificationCode = computeVerificationCode(globalPassword, random);
    // send verification code
    await globalService.getCharacteristic(0x8a81).then((writeChar) => {
      const buffer = new ArrayBuffer(5);
      const view = new DataView(buffer);
      view.setUint8(0, 0x20);
      view.setUint32(1, verificationCode, true);
      log("verificationCode : " + view.getUint32(1, true).toString(16));
      logValue(view);
      return writeChar.writeValue(buffer);
    });
    await delayPromise(100);

    // send time offset
    setState("SENDING_TIME_OFFSET");
    await globalService.getCharacteristic(0x8a81).then((writeChar) => {
      const buffer = new ArrayBuffer(5);
      const view = new DataView(buffer);
      view.setUint8(0, 0x02);
      view.setUint32(1, 0x0af8d1d0, true);
      return writeChar.writeValue(buffer);
    });
    await delayPromise(100);

    // send disconnection
    setState("SENDING_DISCONNECTION");
    await globalService.getCharacteristic(0x8a81).then((writeChar) => {
      const buffer = new ArrayBuffer(1);
      const view = new DataView(buffer);
      view.setUint8(0, 0x22);
      return writeChar.writeValue(buffer);
    });

    setState("PAIRED");
    globalReadChar.removeEventListener(
      "characteristicvaluechanged",
      readCharChangedPairing
    );
  }
};

const measureHeartRateWithDevice = async (device) => {
  log("Measuring heart rate with Heart Rate Device (HRD)...");
  const server = await device.gatt.connect();
  const service = await server.getPrimaryService(0x8a82);
  const readChar = await service.getCharacteristic(0x8a91);

  setHRDState("REQUESTING_RANDOM");
  await readChar.startNotifications();
  log("> HRD Notifications started");

  readChar.addEventListener("characteristicvaluechanged", readCharChangedBpm);

  globalHRDService = service;
  globalHRDReadChar = readChar;
};

const readCharChangedBpm = async (event) => {
  const value = event.target.value;
  log("read value BPM : ", value);
  if (value.getUint8(0).toString(16) === "a1") {
    const random = value.getUint32(1, true);
    logValue(random);
    // calculate verification code
    setHRDState("VERIFYING_CODE");
    const verifCode = computeVerificationCode(globalPassword, random);
    // send verification code
    await globalHRDService.getCharacteristic(0x8a81).then((char) => {
      const buffer = new ArrayBuffer(5);
      const view = new DataView(buffer);
      view.setUint8(0, 0x20);
      view.setUint32(1, verifCode, true);
      log("verifCode : ", view.getUint32(1, true).toString(16));
      logValue(view);
      return char.writeValue(buffer);
    });
    // send time offset
    setHRDState("SENDING_TIME_OFFSET");
    await globalHRDService.getCharacteristic(0x8a81).then((char) => {
      const buffer = new ArrayBuffer(5);
      const view = new DataView(buffer);
      view.setUint8(0, 0x02);
      view.setUint32(1, 0x0af8d2d16, true);
      return char.writeValue(buffer);
    });

    // Be ready to receive measurement data
    setHRDState("REQUEST_MEASUREMENT");
    const bpmChar = await globalHRDService.getCharacteristic(0x8a91);

    await bpmChar.startNotifications();

    log("> Measurement notifications started");
    globalHRDReadChar.removeEventListener(
      "characteristicvaluechanged",
      readCharChangedBpm
    );
    bpmChar.addEventListener("characteristicvaluechanged", readMeasurementData);

    globalHRDBPMReadChar = bpmChar;
  }
};

const readMeasurementData = async (event) => {
  const value = event.target.value;
  log("readMeasurementData : " + value);
  if (globalHRDState !== "REQUEST_MEASUREMENT") {
    log(`We have received data in state: ${globalHRDState}`);
    return;
  }
  log("good state!!! : ");
  logValue(value);
  const systolic = value.getUint16(1, true);
  const diastolic = value.getUint16(3, true);
  const pulsation = value.getUint16(11, true);

  log(
    `Systolic: ${systolic}, Diastolic: ${diastolic}, Pulsation: ${pulsation}`
  );
  // send disconnection
  setHRDState("STATE.DISCONNECTION");
  await globalHRDService.getCharacteristic(0x8a81).then((char) => {
    const buffer = new ArrayBuffer(1);
    const view = new DataView(buffer);
    view.setUint8(0, 0x22);
    return char.writeValue(buffer);
  });

  setHRDState("STATE.DISCONNECTED");
  globalHRDBPMReadChar.removeEventListener(
    "characteristicvaluechanged",
    readMeasurementData
  );
};
