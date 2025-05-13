#import THEME_COLORS from "/managers/theme/theme_colors.gs";

// @type Printer
// @property {ThemeManager} themeManager
Printer = {}

// @param {ThemeManager} themeManager
// @return {Printer}
Printer.New = function(themeManager)
  obj = new self
  obj.themeManager = themeManager
  return obj
end function

// @param {string} text
// @return {string}
Printer.highlight = function(text)
  return self.themeManager.colorText(THEME_COLORS.HIGHLIGHT, text)
end function

// @param {string} text
// @return {string}
Printer.text = function(text)
  return self.themeManager.colorText(THEME_COLORS.TEXT, text)
end function

// @param {string} text
// @return {string}
Printer.secondary = function(text)
  return self.themeManager.colorText(THEME_COLORS.SECONDARY, text)
end function

// @param {string} text
// @return {string}
Printer.warning = function(text)
  return self.themeManager.colorText(THEME_COLORS.WARNING, text)
end function

// @param {string} text
// @return {string}
Printer.info = function(text)
  return self.themeManager.colorText(THEME_COLORS.INFO, text)
end function

// @param {string} text
// @return {string}
Printer.success = function(text)
  return self.themeManager.colorText(THEME_COLORS.SUCCESS, text)
end function

// @param {string} text
// @return {string}
Printer.danger = function(text)
  return self.themeManager.colorText(THEME_COLORS.DANGER, text)
end function

// @param {string} text
// @return {string}
Printer.error = function(text)
  return self.themeManager.colorText(THEME_COLORS.ERROR, text)
end function

// @param {string} text
Printer.print = function(text)
  print(text)
end function

module.exports = Printer