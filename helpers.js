var ChromeSamples = {
  log: function () {
    var line = Array.prototype.slice
      .call(arguments)
      .map(function (argument) {
        return typeof argument === "string"
          ? argument
          : JSON.stringify(argument);
      })
      .join(" ");

    document.querySelector("#log").textContent += line + "\n";
  },

  clearLog: function () {
    document.querySelector("#log").textContent = "";
  },
};

function getLineForDevice(
  deviceName,
  deviceId,
  onConnect,
  onWatchAdvertisement,
  onRead,
  onForget,
  onNaiveStrategy,
  onRepeatWatchUntilEventStrategy,
  onRepeatWatchUntilConnectStrategy,
  connectionStatus$
) {
  const tableRow = document.createElement("tr");
  const deviceNameCell = document.createElement("td");
  deviceNameCell.textContent = deviceName;
  const deviceIdCell = document.createElement("td");
  deviceIdCell.textContent = deviceId;

  const deviceConnectionStatus = document.createElement("td");
  deviceConnectionStatus.textContent = "Not connected";

  connectionStatus$.subscribe((status) => {
    deviceConnectionStatus.textContent = status;
  });

  const connectButton = document.createElement("button");
  connectButton.textContent = "Connect";
  connectButton.addEventListener("click", onConnect);

  const watchAdvertisementButton = document.createElement("button");
  watchAdvertisementButton.textContent = "Watch advertisement";
  watchAdvertisementButton.addEventListener(
    "click",
    onWatchAdvertisement
  );

  const readButton = document.createElement("button");
  readButton.textContent =
    "Read";
    readButton.addEventListener(
    "click",
    onRead
  );

  const naiveStrategyButton = document.createElement("button");
  naiveStrategyButton.textContent =
    "Naive strategy";
    naiveStrategyButton.addEventListener(
    "click",
    onNaiveStrategy
  );

  const repeatWatchUntilEventStrategyButton = document.createElement("button");
  repeatWatchUntilEventStrategyButton.textContent =
    "Repeat watch until event strategy";
    repeatWatchUntilEventStrategyButton.addEventListener(
    "click",
    onRepeatWatchUntilEventStrategy
  );

  const repeatWatchUntilConnectStrategyButton = document.createElement("button");
  repeatWatchUntilConnectStrategyButton.textContent =
    "Repeat watch until connect strategy";
    repeatWatchUntilConnectStrategyButton.addEventListener(
    "click",
    onRepeatWatchUntilConnectStrategy
  );


  const forgetDeviceButton = document.createElement("button");
  forgetDeviceButton.textContent =
    "Forget device";
    forgetDeviceButton.addEventListener(
    "click",
    onForget
  );

  const deviceActionsCell = document.createElement("td");
  deviceActionsCell.appendChild(connectButton);
  deviceActionsCell.appendChild(watchAdvertisementButton);
  deviceActionsCell.appendChild(readButton);
  deviceActionsCell.appendChild(naiveStrategyButton);
  deviceActionsCell.appendChild(repeatWatchUntilEventStrategyButton);
  deviceActionsCell.appendChild(repeatWatchUntilConnectStrategyButton);
  deviceActionsCell.appendChild(forgetDeviceButton);

  tableRow.appendChild(deviceIdCell);
  tableRow.appendChild(deviceNameCell);
  tableRow.appendChild(deviceConnectionStatus);
  tableRow.appendChild(deviceActionsCell);

  return tableRow;
}

function logValue(name, value) {
  let log = `< "${name}": `;
  for (let i = 0; i < value.byteLength; i++) {
    log += value.getUint8(i).toString(16) + " ";
  }
  ChromeSamples.log(log);
}

/**
 * Computes the verification code to send back to the device.
 *
 * @param {DataView} password stored password
 * @param {number} random random number received from device
 * @returns verification code
 */
function computeVerificationCode(password, random) {
  return (password ^ random) >>> 0;
}

function getPasswordForDeviceId(deviceId) {
  const key = `bt-password-${deviceId}`;
  return localStorage.getItem(key);
}

function savePasswordForDeviceId(deviceId, password) {
  const key = `bt-password-${deviceId}`;
  localStorage.setItem(key, password);
}

log = ChromeSamples.log;
clearLog = ChromeSamples.clearLog;
