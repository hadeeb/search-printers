const os = require("os");

function getValidInterfaces() {
  const interfaces = os.networkInterfaces();
  let validInterfaces = [];
  Object.values(interfaces).forEach(inf => {
    validInterfaces = validInterfaces.concat(
      inf.filter(i => !i.internal && i.family === "IPv4")
    );
  });
  return validInterfaces;
}

function getBroadcastAddress(interfaceInfo) {
  let address = interfaceInfo.address.split(".");
  let netmask = interfaceInfo.netmask.split(".");
  return address.map((e, i) => (~netmask[i] & 0xff) | e).join(".");
}

function getBaseAddress(interfaceInfo) {
  let address = interfaceInfo.address.split(".");
  let netmask = interfaceInfo.netmask.split(".");
  return address.map((e, i) => netmask[i] & e).join(".");
}

function getNetworkAddress(interfaceInfo) {
  return {
    base: getBaseAddress(interfaceInfo),
    broadcast: getBroadcastAddress(interfaceInfo)
  };
}

module.exports = {
  getValidInterfaces,
  getNetworkAddress
};
