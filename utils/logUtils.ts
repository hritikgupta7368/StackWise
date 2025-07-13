// utils/logUtils.ts
type LogLevel = "info" | "warn" | "error" | "debug";

interface LogOptions {
  label?: string;
  level?: LogLevel;
  stringify?: boolean;
  trace?: boolean;
}

const COLORS: Record<LogLevel, string> = {
  info: "\x1b[95m", // Bright blue
  warn: "\x1b[93m", // Bright yellow
  error: "\x1b[91m", // Bright red
  debug: "\x1b[92m",
};

const DATA_COLOR = "\x1b[35m"; // Magenta for data
const RESET = "\x1b[0m";

export const logDebug = (data: unknown, options: LogOptions = {}): void => {
  const { label = "DEBUG", level = "info", stringify = false, trace = false } = options;

  if (__DEV__) {
    const levelColor = COLORS[level];
    const prefix = `${levelColor}[${label.toUpperCase()}]${RESET}`;

    // Handle data formatting properly
    let formattedData: string;

    if (stringify && data !== null && data !== undefined) {
      // Always stringify when stringify is true
      formattedData = typeof data === "object" ? JSON.stringify(data, null, 2) : String(data);
    } else {
      // For non-stringify mode, handle objects properly
      if (typeof data === "object" && data !== null) {
        formattedData = JSON.stringify(data, null, 2);
      } else {
        formattedData = String(data);
      }
    }

    // Apply full color to the entire output based on level
    let coloredOutput: string;
    switch (level) {
      case "warn":
        coloredOutput = `${COLORS.warn}${formattedData}${RESET}`;
        break;
      case "error":
        coloredOutput = `${COLORS.error}${formattedData}${RESET}`;
        break;
      case "debug":
        coloredOutput = `${DATA_COLOR}${formattedData}${RESET}`;
        break;
      default: // info
        coloredOutput = `${COLORS.info}${formattedData}${RESET}`;
    }

    // Use appropriate console method
    switch (level) {
      case "warn":
        console.warn(prefix, coloredOutput);
        break;
      case "error":
        console.error(prefix, coloredOutput);
        break;
      case "debug":
        console.debug(prefix, coloredOutput);
        break;
      default:
        console.log(prefix, coloredOutput);
    }

    if (trace) {
      console.trace(`${levelColor}[${label.toUpperCase()}] trace${RESET}`);
    }
  }
};

// Alternative version with even more distinct colors
export const logDebugEnhanced = (data: unknown, options: LogOptions = {}): void => {
  const { label = "DEBUG", level = "info", stringify = false, trace = false } = options;

  if (__DEV__) {
    // Enhanced color scheme for better distinction
    const ENHANCED_COLORS = {
      info: "\x1b[94m", // Bright blue
      warn: "\x1b[93m", // Bright yellow
      error: "\x1b[91m", // Bright red
      debug: "\x1b[96m", // Bright cyan
    };

    const levelColor = ENHANCED_COLORS[level];

    // Handle data formatting
    let formattedData: string;
    if (stringify && data !== null && data !== undefined) {
      formattedData = typeof data === "object" ? JSON.stringify(data, null, 2) : String(data);
    } else {
      if (typeof data === "object" && data !== null) {
        formattedData = JSON.stringify(data, null, 2);
      } else {
        formattedData = String(data);
      }
    }

    // Apply full color to entire message
    const fullMessage = `${levelColor}[${label.toUpperCase()}] ${formattedData}${RESET}`;

    switch (level) {
      case "warn":
        console.warn(fullMessage);
        break;
      case "error":
        console.error(fullMessage);
        break;
      case "debug":
        console.debug(fullMessage);
        break;
      default:
        console.log(fullMessage);
    }

    if (trace) {
      console.trace(`${levelColor}[${label.toUpperCase()}] trace${RESET}`);
    }
  }
};
