#import Command from "/managers/command/command.src";
#import ExtensionMediator from "/mediator.src";

// @type WiFiNetworksCMD
// @property {SessionManager} sessionManager
// @property {ViperUi} viperUi
WiFiNetworksCMD = new Command

// @param {ViperUi} viperUi
// @param {SessionManager} sessionManager
// @return {WiFiNetworksCMD}
WiFiNetworksCMD.New = function(viperUi, sessionManager)
  obj = new self
  super._new({
    "name": "ls2",
    "description": "List all items in the provided directory",
    "parameters": [ Parameter.New({
      "name": "path",
      "required": false,
      "default": ".",
    }) ],
  })

  obj.sessionManager = sessionManager
  obj.viperUi = viperUi

  return obj
end function

WiFiNetworksCMD.handle = function(params)
  session = self.sessionManager.currentSession
  handler = session.handler
  path = params.path

  file = handler.getFile(path)
  if file isa Error then return file
  if file.children isa Error then return file.children

  self.viperUi.ls(file.children)
end function

module.exports = WiFiNetworksCMD