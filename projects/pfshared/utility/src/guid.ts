export class Guid {
  static empty = "00000000-0000-0000-0000-000000000000";

  static newGuid(): string {
    const hasCrypto = typeof (window.crypto) != "undefined";
    const hasRandomValues = hasCrypto && (typeof (window.crypto.getRandomValues) != "undefined");
    return (hasCrypto && hasRandomValues) ? cryptoGuid() : guid();
  }
}

function padLeft(paddingString, width, replacementChar): string {
  return paddingString.length >= width ? paddingString : padLeft(replacementChar + paddingString, width, replacementChar || " ");
}

function guid(): string {
  var currentDateMilliseconds = new Date().getTime();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, currentChar => {
    var randomChar = (currentDateMilliseconds + Math.random() * 16) % 16 | 0;
    currentDateMilliseconds = Math.floor(currentDateMilliseconds / 16);
    return (currentChar === "x" ? randomChar : (randomChar & 0x7 | 0x8)).toString(16);
  });
}

function cryptoGuid(): string {
  const buffer = new Uint16Array(8);
  window.crypto.getRandomValues(buffer);
  return [s4(buffer[0]) + s4(buffer[1]), s4(buffer[2]), s4(buffer[3]), s4(buffer[4]), s4(buffer[5]) + s4(buffer[6]) + s4(buffer[7])].join("-");
}

function s4(number): string {
  const hexadecimalResult = number.toString(16);
  return padLeft(hexadecimalResult, 4, "0");
}