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

function getBtnsForDevice(deviceName, onlisten, onlistenAfterAdvertisement) {
  const listWrapper = document.createElement("li");
  const connectButton = document.createElement("button");
  const connectAfterAdvertisementButton = document.createElement("button");
  listWrapper.textContent = deviceName;
  connectButton.textContent = "Listen for measures";
  connectAfterAdvertisementButton.textContent = "Listen AFTER advertisement";
  connectButton.addEventListener("click", onlisten);
  connectAfterAdvertisementButton.addEventListener(
    "click",
    onlistenAfterAdvertisement
  );
  listWrapper.appendChild(connectButton);
  listWrapper.appendChild(connectAfterAdvertisementButton);
  return listWrapper;
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
