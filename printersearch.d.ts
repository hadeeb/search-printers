export declare namespace PrinterSearch {
  interface Options {
    /**
     * Timeout for socket connection (ms)
     * @default 3000
     */
    timeout?: number;
    /**
     * Port to listen for printers
     * @default 9100
     */
    port?: number;
    /**
     * Buffer to get printer name
     */
    buffer?: Buffer;
  }
  interface Printer {
    ip: string;
    port: number;
    name: string;
  }
}

/**
 * Search for thermal printers in connected networks
 * @param options {PrinterSearch.Options}
 */
export default function getPrinters(
  options?: PrinterSearch.Options
): Array<PrinterSearch.Printer>;
