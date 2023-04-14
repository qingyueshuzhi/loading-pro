export class ConsoleService {
  private readonly enableLog: boolean = false;

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
