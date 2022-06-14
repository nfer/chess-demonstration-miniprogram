/* eslint-disable no-console */
class Log {
  i(...args: Array<any>) {
    console.info.apply(console, Array.prototype.slice.call(args));
  }

  d(...args: Array<any>) {
    console.debug.apply(console, Array.prototype.slice.call(args));
  }

  w(...args: Array<any>) {
    console.warn.apply(console, Array.prototype.slice.call(args));
  }

  e(...args: Array<any>) {
    console.error.apply(console, Array.prototype.slice.call(args));
  }
}

export default new Log();

