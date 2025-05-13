#import Command from "/managers/command/command.src";
#import ExtensionMediator from "/mediator.src";
#import LIB_TYPES from "/managers/lib/lib_types.gs";

// @type WiFiCrackCMD
// @property {SessionManager} sessionManager
// @property {ViperUi} viperUi
// @property {ThemeManager} themeManager
// @property {LibManager} libManager
// @property {Printer} printer
// @property {ConfigManager} configManager
WiFiCrackCMD = new Command

// @param {ViperUi} viperUi
// @param {SessionManager} sessionManager
// @param {ThemeManager} themeManager
// @param {LibManager} libManager
// @param {Printer} printer
// @param {ConfigManager} configManager
// @return {WiFiCrackCMD}
WiFiCrackCMD.New = function(viperUi, sessionManager, themeManager, libManager, printer, configManager)
  return (new self)._new(
    viperUi,
    sessionManager,
    themeManager,
    libManager,
    printer,
    configManager)
end function

// @param {ViperUi} viperUi
// @param {SessionManager} sessionManager
// @param {ThemeManager} themeManager
// @param {LibManager} libManager
// @param {Printer} printer
// @param {ConfigManager} configManager
// @return {WiFiCrackCMD}
WiFiCrackCMD._new = function(viperUi, sessionManager, themeManager, libManager, printer, configManager)
  if not printer then Error.Panic("Printer is required", #filename, #line)
  if not sessionManager then Error.Panic("SessionManager is required", #filename, #line)
  if not viperUi then Error.Panic("ViperUi is required", #filename, #line)
  if not themeManager then Error.Panic("ThemeManager is required", #filename, #line)
  if not libManager then Error.Panic("LibManager is required", #filename, #line)
  if not configManager then Error.Panic("ConfigManager is required", #filename, #line)

  super._new({
    "name": "wificrack",
    "description": "Crack selected wifi network",
    "parameters": [
      Parameter.New({
        "name": "netDevice",
        "required": true,
        "default": "wlan0",
      }),
      Parameter.New({
        "name": "essid",
        "required": true,
      }),
    ],
  })

  self.sessionManager = sessionManager
  self.viperUi = viperUi
  self.themeManager = themeManager
  self.libManager = libManager
  self.printer = printer
  self.configManager = configManager

  return self
end function

WiFiCrackCMD.handle = function(params)
  netDevice = params.netDevice
  essidToCrack = params.essid
  config = self.configManager.config

  if config.hasIndex("wifi_passwords") and config["wifi_passwords"].hasIndex(netDevice) and config["wifi_passwords"][netDevice].hasIndex(essidToCrack) then
    print(self.printer.success("Wifi password for " + essidToCrack + " is " + config["wifi_passwords"][netDevice][essidToCrack]))
    exit
  end if

  cryptoE = self.libManager.getCurrentLib(LIB_TYPES.CRYPTO)
  crypto = cryptoE.lib.crypto

  airmonResult = crypto.airmon("start", netDevice)
  print(self.printer.info("Switching to monitoring mode..."))
  if typeof(airmonResult) == "string" then
    print(self.printer.error("There was an error while switching monitoring mode: " + airmonResult))
    return 
  else
    if airmonResult == 1 then
      print(self.printer.success("Monitoring mode switched successfully."))
    else
      print(self.printer.warning("There was an error while switching monitoring mode: " + airmonResult))
      return 
    end if
  end if

  session = self.sessionManager.currentSession
  handler = session.handler
  networks = handler.computer.computer.wifi_networks(params.netDevice)
  found = false
  for network in networks
    parsedItem = network.split(" ")
    bssid = parsedItem[0]
    pwrPercent = parsedItem[1]
    essid = parsedItem[2]
    if essid == essidToCrack then
      found = true
      pwr = pwrPercent[ : -1].to_int

      potentialAcks = 300000 / (pwr + 15)
      print(self.printer.info("Cracking wifi network " + essid + " with BSSID " + bssid + " and power " + pwrPercent + ". Wait for " + potentialAcks + " ACKs."))
      res = crypto.aireplay(bssid, essid, potentialAcks)
      wifiPassword = crypto.aircrack(current_path + "/file.cap")
      print(self.printer.success("Wifi password for " + essid + " is " + wifiPassword))
      
      if not config.hasIndex("wifi_passwords") then
        config["wifi_passwords"] = {}
      end if
      if not config["wifi_passwords"].hasIndex(netDevice) then
        config["wifi_passwords"][netDevice] = {}
      end if
      if not config["wifi_passwords"][netDevice].hasIndex(essid) then
        config["wifi_passwords"][netDevice][essid] = {}
      end if

      config["wifi_passwords"][netDevice][essid] = wifiPassword
      self.configManager.saveConfig(config)
      break
    end if
  end for
  if not found then
    print(self.printer.warning("Wifi network " + essidToCrack + " not found."))
  end if
end function

module.exports = WiFiCrackCMD