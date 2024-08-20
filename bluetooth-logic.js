let globalState = "IDLE",
  /** @type {BluetoothRemoteGATTServer} */
  globalServer;

// BPM means Blood Pressure Monitor
let globalBPMState = "IDLE",
  /** @type {BluetoothRemoteGATTService} */
  globalBPMService;

const globalAccountId = Math.floor(Math.random() * (Math.pow(2, 32) - 1));

log("globalAccountId : " + globalAccountId);

const setState = (state) => {
  log("👥: " + state);
  globalState = state;
};

const setBPMState = (state) => {
  log("❤️: " + state);
  globalBPMState = state;
};

const TRANSTEK_WRITE_CHARACTERISTIC = 0x8a81; // [WRITE] Information transfer from App to Device
const TRANSTEK_READ_CHARACTERISTIC = 0x8a82; // [Indicate] Information transfer from Device to App
const TRANSTEK_BPM_READ_CHARACTERISTIC = 0x8a91; // [Indicate]: Blood pressure measurement transfer from Device to App
const TRANSTEK_BASE_TIME = new Date(2010, 0, 1).getTime();
const BLUETOOTH_COMMANDS = Object.freeze({
  PASSWORD: 0xa0,
  ACCOUNT: 0x21,
  RANDOM: 0xa1,
  VERIFICATION_CODE: 0x20,
  TIME_OFFSET: 0x02,
  MEASURE: 0x1e,
  DISCONNECT: 0x22,
});

const BLOOD_PRESSURE_MONITOR_OPTS = {
  bluetoothStorageKey: 0x7809,
  scanFilter: { filters: [{ services: [0x7809] }] },
  type: "BLOOD_PRESSURE_MONITOR",
  characteristics: [
    0x8a81, // [Write]: Information transfer from App to Device
    0x8a82, // [Indicate]: Information transfer from Device to App
    0x8a91, // [Indicate]: Blood pressure measurement transfer from Device to App
    0x8a92, // [Notify]: Blood pressure measurement transfer from Device to App
  ],
};

const delayPromise = (delay) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

const pairDevice = async (device) => {
  const server = await device.gatt.connect();
  console.log("Connected to device", device);
  console.log("Server", server);
  const serviceId = BLOOD_PRESSURE_MONITOR_OPTS.bluetoothStorageKey;
  const service = await server.getPrimaryService(serviceId);
  // Getting read Characteristic
  const readChar = await service.getCharacteristic(
    TRANSTEK_READ_CHARACTERISTIC
  );
  const writeChar = await service.getCharacteristic(
    TRANSTEK_WRITE_CHARACTERISTIC
  );
  log("> Notifications started");

  // log to the screen if the gatt server disconnects
  if (!globalServer) {
    device.addEventListener("gattserverdisconnected", () => {
      setState("DISCONNECTED");
    });
  }
  readChar.addEventListener("characteristicvaluechanged", async (e) => {
    await readCharChangedPairing(e, {
      deviceId: device.id,
      writeChar,
    });
  });

  // launching pairing protocol
  await readChar.startNotifications();

  globalServer = server;
  // When doing the pairing, all the conversation should be done with the same characteristic
  // It will not work if you try another service.getCharacteristic() call
};

const readCharChangedPairing = async (event, { deviceId, writeChar }) => {
  /** @type {DataView} */
  const value = event.target.value;
  logValue("charChangedPairing", value);

  if (value.getUint8(0) === BLUETOOTH_COMMANDS.PASSWORD) {
    setState("RECEIVED_PASSWORD");
    const password = value.getUint32(1, true);

    setState("REQUESTING_RANDOM_FROM_ACCOUNT_ID");
    const accountId = globalAccountId;
    await Promise.resolve(writeChar).then((_writeChar) => {
      const buffer = new ArrayBuffer(5);
      const view = new DataView(buffer);
      view.setUint8(0, BLUETOOTH_COMMANDS.ACCOUNT);
      view.setUint32(1, accountId, true);
      return _writeChar.writeValue(buffer);
    });

    savePasswordForDeviceId(deviceId, password);
  }

  if (value.getUint8(0) === BLUETOOTH_COMMANDS.RANDOM) {
    setState("RECEIVED_RANDOM_FOR_VERIFICATION");
    const random = value.getUint32(1, true);
    const password = getPasswordForDeviceId(deviceId);
    const verificationCode = computeVerificationCode(password, random);

    setState("SENDING_VERIFICATION_CODE");
    await Promise.resolve(writeChar).then((_writeChar) => {
      const buffer = new ArrayBuffer(5);
      const view = new DataView(buffer);
      view.setUint8(0, BLUETOOTH_COMMANDS.VERIFICATION_CODE);
      view.setUint32(1, verificationCode, true);
      return _writeChar.writeValue(buffer);
    });
    // log("If we get disconnected, the verificationCode must be wrong");

    setState("SENDING_TIME_OFFSET");
    const offset = Math.floor((Date.now() - TRANSTEK_BASE_TIME) / 1000);
    await Promise.resolve(writeChar).then((_writeChar) => {
      const buffer = new ArrayBuffer(5);
      const view = new DataView(buffer);
      view.setUint8(0, BLUETOOTH_COMMANDS.TIME_OFFSET);
      view.setUint32(1, offset, true);
      return _writeChar.writeValue(buffer);
    });

    setState("SENDING_DISCONNECTION");
    await Promise.resolve(writeChar).then((_writeChar) => {
      const buffer = new ArrayBuffer(1);
      const view = new DataView(buffer);
      view.setUint8(0, BLUETOOTH_COMMANDS.DISCONNECT);
      return _writeChar.writeValue(buffer);
    });

    setState("PAIRED");
  }
};

const measureHeartRateWithDevice = async (device, password) => {
  const server = await device.gatt.connect();
  const serviceId = BLOOD_PRESSURE_MONITOR_OPTS.bluetoothStorageKey;
  const service = await server.getPrimaryService(serviceId);
  const readChar = await service.getCharacteristic(
    TRANSTEK_READ_CHARACTERISTIC
  );
  const writeChar = await service.getCharacteristic(
    TRANSTEK_WRITE_CHARACTERISTIC
  );

  setBPMState("REQUESTING_BPM_MEASURE");

  readChar.addEventListener("characteristicvaluechanged", async (e) => {
    await readCharChangedBpm(e, {
      password,
      service,
      bpmWriteChar: writeChar,
    });
  });

  await readChar.startNotifications();
  log("> BPM Notifications started");
};

const readCharChangedBpm = async (
  event,
  { password, service, bpmWriteChar }
) => {
  /** @type {DataView} */
  const value = event.target.value;
  logValue("BPM Char Changed", value);

  if (value.getUint8(0) === BLUETOOTH_COMMANDS.RANDOM) {
    setBPMState("RECEIVED_RANDOM");
    const random = value.getUint32(1, true);

    setBPMState("SENDING_VERIFICATION_CODE");
    const verifCode = computeVerificationCode(password, random);
    await Promise.resolve(bpmWriteChar).then((_writeChar) => {
      const buffer = new ArrayBuffer(5);
      const view = new DataView(buffer);
      view.setUint8(0, BLUETOOTH_COMMANDS.VERIFICATION_CODE);
      view.setUint32(1, verifCode, true);
      return _writeChar.writeValue(buffer);
    });

    setBPMState("SENDING_TIME_OFFSET");
    const offset = Math.floor((Date.now() - TRANSTEK_BASE_TIME) / 1000);
    await Promise.resolve(bpmWriteChar).then((_writeChar) => {
      const buffer = new ArrayBuffer(5);
      const view = new DataView(buffer);
      view.setUint8(0, BLUETOOTH_COMMANDS.TIME_OFFSET);
      view.setUint32(1, offset, true);
      return _writeChar.writeValue(buffer);
    });

    // Be ready to receive measurement data
    setBPMState("REQUEST_MEASUREMENT");
    const bpmChar = await service.getCharacteristic(
      TRANSTEK_BPM_READ_CHARACTERISTIC
    );

    bpmChar.addEventListener("gattserverdisconnected", (e) => {
      setBPMState("STATE.DISCONNECTED");
    });
    bpmChar.addEventListener("characteristicvaluechanged", async (e) => {
      await readMeasurementData(e, {
        bpmWriteChar,
      });
    });

    await bpmChar.startNotifications();
    log("> Start notifications for BPM");
  }
};

const readMeasurementData = async (event, { bpmWriteChar }) => {
  const value = event.target.value;

  if (globalBPMState !== "REQUEST_MEASUREMENT") {
    log(`⚠️ We have received data in state: ${globalBPMState}`);
  }
  if (value.getUint8(0) !== BLUETOOTH_COMMANDS.MEASURE) {
    log(`⚠️ We have received data that is not a measure`);
    logValue("readMeasurementData", value);
    return;
  }

  const systolic = value.getUint16(1, true);
  const diastolic = value.getUint16(3, true);
  const pulsation = value.getUint16(11, true);

  log(
    [
      `✅ Systolic: ${systolic}`,
      `Diastolic: ${diastolic}`,
      `Pulsation: ${pulsation}`,
    ].join(", ")
  );

  setBPMState("SENDING_DISCONNECTION");
  await Promise.resolve(bpmWriteChar).then((_writeChar) => {
    const buffer = new ArrayBuffer(1);
    const view = new DataView(buffer);
    view.setUint8(0, BLUETOOTH_COMMANDS.DISCONNECT);
    return _writeChar.writeValue(buffer);
  });

  setBPMState("MEASURE_ACQUIRED");
};
