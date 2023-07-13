export class LogManager {
  private enableLog: boolean = true;

  constructor() {
  }

  set enable(value: boolean) {
    this.enableLog = value;
  }

  log(...arg: any[]) {
    if (this.enableLog) console.log(...arg);
  }

  error(...arg: any[]) {
    if (this.enableLog) console.error(...arg);
  }
}
