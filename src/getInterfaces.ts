import * as os from "os";

function getValidInterfaces(): os.NetworkInterfaceBase[] {
  const interfaces = os.networkInterfaces();
  let validInterfaces: os.NetworkInterfaceBase[] = [];
  Object.values(interfaces).forEach(inf => {
    validInterfaces = validInterfaces.concat(
      inf.filter(i => !i.internal && i.family === "IPv4")
    );
  });
  return validInterfaces;
}

function getBroadcastAddress(interfaceInfo: os.NetworkInterfaceBase): number[] {
  let address = interfaceInfo.address.split(".");
  let netmask = interfaceInfo.netmask.split(".");
  // AND with 0xff to remove prepended 1s
  return address.map((e, i) => (~netmask[i] & 0xff) | (e as any));
}

function getBaseAddress(interfaceInfo: os.NetworkInterfaceBase): number[] {
  let address = interfaceInfo.address.split(".");
  let netmask = interfaceInfo.netmask.split(".");
  return address.map((e, i) => (netmask[i] as any) & (e as any));
}

function getNetworkAddress(
  interfaceInfo: os.NetworkInterfaceBase
): { base: number[]; broadcast: number[] } {
  return {
    base: getBaseAddress(interfaceInfo),
    broadcast: getBroadcastAddress(interfaceInfo)
  };
}

export { getValidInterfaces, getNetworkAddress };
