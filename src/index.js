const net = require("net");
const { getValidInterfaces, getBroadcastAddress } = require("./getInterfaces");

const GET_PRINTER_NAME = Buffer.from([
  0x1b,
  0x3d,
  0x01,
  0x1d,
  0x49,
  0x45,
  0x1d,
  0x49,
  0x43,
  0x1d,
  0x49,
  0x42
]);

function getPrinters(options) {
  options = options || {};
  const timeout = options.timeout || 3000;
  const port = options.port || 9100;
  const NAME_BUFFER = options.buffer || GET_PRINTER_NAME;

  const ifaces = getValidInterfaces();

  const printers = [];

  const promises = [];

  ifaces.map(getBroadcastAddress).forEach(addr => {
    const subnet = addr.slice(0, addr.lastIndexOf("."));

    for (let i = 1; i < 255; i++) {
      const ip = subnet + "." + i;

      const pr = new Promise(resolve => {
        let serviceSocket = net.connect(
          {
            host: ip,
            port: port,
            timeout: timeout
          },
          function() {
            serviceSocket.write(NAME_BUFFER);
          }
        );
        let timeoutId;
        let name = "";
        serviceSocket.on("data", data => {
          name = name + data.toString("utf8");
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            printers.push({
              ip: ip,
              port: port,
              name: name.replace(/\0/g, "")
            });
            serviceSocket.destroy();
            resolve();
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

      promises.push(pr);
    }
  });

  return Promise.all(promises).then(() => printers);
}

module.exports = getPrinters;
