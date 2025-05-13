#import Command from "/managers/command/command.src";
#import ExtensionMediator from "/mediator.src";

// @type WiFiLSCMD
// @property {SessionManager} sessionManager
// @property {ViperUi} viperUi
// @property {ThemeManager} themeManager
WiFiLSCMD = new Command

// @param {ViperUi} viperUi
// @param {SessionManager} sessionManager
// @param {ThemeManager} themeManager
// @return {WiFiLSCMD}
WiFiLSCMD.New = function(viperUi, sessionManager, themeManager)
  return (new self)._new(viperUi, sessionManager, themeManager)
end function

// @param {ViperUi} viperUi
// @param {SessionManager} sessionManager
// @param {ThemeManager} themeManager
// @return {WiFiLSCMD}
WiFiLSCMD._new = function(viperUi, sessionManager, themeManager)
  super._new({
    "name": "wifils",
    "description": "List all available wifi networks",
    "parameters": [ Parameter.New({
      "name": "netDevice",
      "required": false,
      "default": "wlan0",
    }) ],
  })

  self.sessionManager = sessionManager
  self.viperUi = viperUi
  self.themeManager = themeManager

  return self
end function

WiFiLSCMD.handle = function(params)
  session = self.sessionManager.currentSession
  handler = session.handler
  networks = handler.computer.computer.wifi_networks(params.netDevice)

  keys = [
    "BSSID",
    "PWR",
    "ESSID",
  ]
  items = []
  for network in networks
    parsedItem = network.split(" ")
    items.push({
      "BSSID": {
        "text": parsedItem[0],
        "color": @self.themeManager.color(THEME_COLORS.INFO),
      },
      "PWR": {
        "text": parsedItem[1],
        "color": @self.themeManager.color(THEME_COLORS.INFO),
      },
      "ESSID": {
        "text": parsedItem[2],
        "color": @self.themeManager.color(THEME_COLORS.INFO),
      },
    })
  end for

  self.viperUi.displayTable(keys, items)

  print
end function

module.exports = WiFiLSCMD