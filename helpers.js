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
  onlisten,
  onlistenAfterAdvertisement,
  onlistenAfterAdvertisementHack,
  onlistenAfterWatchingAdvertisementAndRetry,
  onForget
) {
  const tableRow = document.createElement("tr");
  const deviceNameCell = document.createElement("td");
  deviceNameCell.textContent = deviceName;
  const deviceIdCell = document.createElement("td");
  deviceIdCell.textContent = deviceId;

  const connectButton = document.createElement("button");
  connectButton.textContent = "Listen for measures";
  connectButton.addEventListener("click", onlisten);

  const connectAfterAdvertisementButton = document.createElement("button");
  connectAfterAdvertisementButton.textContent = "Listen AFTER advertisement";
  connectAfterAdvertisementButton.addEventListener(
    "click",
    onlistenAfterAdvertisement
  );

  const connectAfterAdvertisementHackButton = document.createElement("button");
  connectAfterAdvertisementHackButton.textContent =
    "Listen with ADVERTISEMENT HACK";
  connectAfterAdvertisementHackButton.addEventListener(
    "click",
    onlistenAfterAdvertisementHack
  );

  const connectAfterWatchingAdvertisementAndRetryButton = document.createElement("button");
  connectAfterWatchingAdvertisementAndRetryButton.textContent =
    "Listen with watching advertisement and retry";
    connectAfterWatchingAdvertisementAndRetryButton.addEventListener(
    "click",
    onlistenAfterWatchingAdvertisementAndRetry
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
  deviceActionsCell.appendChild(connectAfterAdvertisementButton);
  deviceActionsCell.appendChild(connectAfterAdvertisementHackButton);
  deviceActionsCell.appendChild(connectAfterWatchingAdvertisementAndRetryButton);
  deviceActionsCell.appendChild(forgetDeviceButton);

  tableRow.appendChild(deviceIdCell);
  tableRow.appendChild(deviceNameCell);
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
