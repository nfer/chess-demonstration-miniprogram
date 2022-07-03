/* eslint-disable no-console */
class Log {
  public i(...args: Array<any>) {
    console.info.apply(console, Array.prototype.slice.call(args));
  }

  public d(...args: Array<any>) {
    console.debug.apply(console, Array.prototype.slice.call(args));
  }

  public w(...args: Array<any>) {
    console.warn.apply(console, Array.prototype.slice.call(args));
  }

  public e(...args: Array<any>) {
    console.error.apply(console, Array.prototype.slice.call(args));
  }
}

export default new Log();

