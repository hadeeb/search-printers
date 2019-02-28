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
    const minMasks = base.split(".");
    const maxMasks = broadcast.split(".");

    for (let i1 = minMasks[0]; i1 <= maxMasks[0]; i1++) {
      for (let i2 = minMasks[1]; i2 <= maxMasks[1]; i2++) {
        for (let i3 = minMasks[2]; i3 <= maxMasks[2]; i3++) {
          for (let i4 = minMasks[3] + 1; i4 < maxMasks[3]; i4++) {
            promises.push(
              tryConnect({
                host: i1 + "." + i2 + "." + i3 + "." + i4,
                port: port,
                timeout: timeout,
                buffer: buffer
              })
            );
          }
        }
      }
    }
  });

  const devices = await Promise.all(promises);
  return devices.filter(Boolean);
}

module.exports = getPrinters;
