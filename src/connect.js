const net = require("net");

function tryConnect({ host, port, timeout, buffer }) {
  return new Promise(resolve => {
    let serviceSocket = net.connect(
      {
        host: host,
        port: port,
        timeout: timeout
      },
      function() {
        serviceSocket.write(buffer);
      }
    );
    let timeoutId;
    let name = "";
    serviceSocket.on("data", data => {
      name = name + data.toString("utf8");
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        serviceSocket.destroy();
        resolve({
          host: host,
          port: port,
          name: name.replace(/\0/g, "")
        });
      }, timeout);
    });
    serviceSocket.on("timeout", () => {
      serviceSocket.destroy();
      resolve();
    });
    serviceSocket.on("error", () => {
      serviceSocket.destroy();
      resolve();
    });
  });
}

module.exports = { tryConnect };
