export class ConsoleService {
  private enableLog = false;
  constructor(enable: boolean) {
    this.enableLog = enable;
  }

  log(...arg: any[]) {
    if (this.enableLog) console.log(...arg);
  }

  error(...arg: any[]) {
    if (this.enableLog) console.error(...arg);
  }
}
