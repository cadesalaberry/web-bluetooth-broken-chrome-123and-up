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

function getBtnForDevice(deviceName, onclick) {
  const listWrapper = document.createElement("li");
  const connectButton = document.createElement("button");
  listWrapper.textContent = deviceName;
  connectButton.textContent = "Listen for measures";
  connectButton.addEventListener("click", onclick);
  listWrapper.appendChild(connectButton);
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

log = ChromeSamples.log;
clearLog = ChromeSamples.clearLog;
