// =========================================
// Tools
// =========================================

export function runTools(message) {

  const text = (message || "").toLowerCase();

  // Current Time
  if (text === "time" || text === "current time") {

    return {
      handled: true,
      message: new Date().toLocaleTimeString(),
    };

  }

  // Current Date
  if (text === "date" || text === "today") {

    return {
      handled: true,
      message: new Date().toLocaleDateString(),
    };

  }

  return {
    handled: false,
  };

}
