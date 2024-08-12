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
  const connectButton = document.createElement("button");
  connectButton.textContent = deviceName;
  connectButton.addEventListener("click", onclick);
  return connectButton;
}

function logValue(value) {
  ChromeSamples.log(`Logging value: ${value.toString(16)}`);
  let log = "";
  for (let i = 0; i < value.byteLength; i++) {
    log += value.getUint8(i).toString(16) + " ";
  }
  ChromeSamples.log(log);
}

function computeVerificationCode(password, random) {
  return (password ^ random) >>> 0;
}

log = ChromeSamples.log;
clearLog = ChromeSamples.clearLog;
