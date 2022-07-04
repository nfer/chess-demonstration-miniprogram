/* eslint-disable no-console */
class Log {
  public i(...args: Array<any>): void {
    console.info.apply(console, Array.prototype.slice.call(args));
  }

  public d(...args: Array<any>): void {
    console.debug.apply(console, Array.prototype.slice.call(args));
  }

  public w(...args: Array<any>): void {
    console.warn.apply(console, Array.prototype.slice.call(args));
  }

  public e(...args: Array<any>): void {
    console.error.apply(console, Array.prototype.slice.call(args));
  }
}

export default new Log();

