import * as net from "net";

interface SearchOptions {
  host: string;
  port: number;
  timeout: number;
  buffer: Buffer;
}

export interface Printer {
  host: string;
  port: number;
  name: string;
}

function tryConnect({
  host,
  port,
  timeout,
  buffer
}: SearchOptions): Promise<Printer> {
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
    let timeoutId: NodeJS.Timeout;
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

export { tryConnect };
