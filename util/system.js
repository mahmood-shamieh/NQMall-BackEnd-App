const os = require('os');
class SystemUtil {
  static OS_TYPE = {
    WINDOWS: "Windows",
    MACOS: "MacOS",
    LINUX: "Linux",
    ANDROID: "Android",
    IOS: "iOS",
    UNKNOWN: "Unknown OS",
  };
  static detectOS() {
    let platform = os.platform();
    if (platform.includes("win")) {
      return this.OS_TYPE.WINDOWS;
    } else if (platform.includes("mac") ||platform.includes("x11") || platform.includes("linux") || platform.includes("darwin")) {
      return this.OS_TYPE.MACOS;
    }
    // else if (platform.includes("x11") || platform.includes("linux")) {
    //   return this.OS_TYPE.LINUX;
    // }
    else if (platform.includes("android")) {
      return this.OS_TYPE.ANDROID;
    } else if (platform.includes("iphone") || platform.includes("ipad")) {
      return this.OS_TYPE.IOS;
    } else {
      return this.OS_TYPE.UNKNOWN;
    }
  }
}
module.exports = SystemUtil;
