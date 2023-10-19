import { serial } from "web-serial-polyfill";
//import { serial } from "./test/serial.js";

export function getWebSerial() {
  if (navigator.serial) {
    return navigator.serial;
  }
  return serial;
}
