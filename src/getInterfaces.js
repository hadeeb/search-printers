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

function getBroadcastAddress(addr_info) {
  let addr_splitted = addr_info.address.split(".");
  let netmask_splitted = addr_info.netmask.split(".");
  return addr_splitted
    .map((e, i) => (~netmask_splitted[i] & 0xff) | e)
    .join(".");
}

module.exports = {
  getValidInterfaces,
  getBroadcastAddress
};
