const { getValidInterfaces, getNetworkAddress } = require("./getInterfaces");
const { tryConnect } = require("./connect");

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

async function getPrinters(options) {
  options = options || {};
  const timeout = options.timeout || 3000;
  const port = options.port || 9100;
  const buffer = options.buffer || GET_PRINTER_NAME;

  const ifaces = getValidInterfaces();
  const promises = [];

  ifaces.map(getNetworkAddress).forEach(({ base, broadcast }) => {
    let isValid = base.every(mask => mask >= 0 && mask <= 255);
    isValid = isValid && broadcast.every(mask => mask >= 0 && mask <= 255);
    if (!isValid) return;

    const startIP =
      (base[0] << 24) | (base[1] << 16) | (base[2] << 8) | base[3];

    const endIP =
      (broadcast[0] << 24) |
      (broadcast[1] << 16) |
      (broadcast[2] << 8) |
      broadcast[3];

    for (let i = startIP + 1; i < endIP; i++) {
      const ipParts = [
        // AND with 0xff to remove prepended 1s
        ((i & 0xff000000) >> 24) & 0xff,
        (i & 0x00ff0000) >> 16,
        (i & 0x0000ff00) >> 8,
        i & 0x000000ff
      ];

      promises.push(
        tryConnect({
          host: ipParts.join("."),
          port: port,
          timeout: timeout,
          buffer: buffer
        })
      );
    }
  });

  const devices = await Promise.all(promises);
  return devices.filter(Boolean);
}

module.exports = getPrinters;
