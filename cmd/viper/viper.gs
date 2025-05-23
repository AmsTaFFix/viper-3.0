#import Error from "/new/error.gs"
#import CommandManager from "/managers/command/command-manager.src"
#import Command from "/managers/command/command.src"
#import ExtensionMediator from "/mediator.src"
#import SessionManager from "/managers/session/session-manager.src"
#import Session from "/managers/session/session.src"
#import LibManager from "/managers/lib/lib-manager.src"
#import MetaxploitManager from "/managers/lib/metaxploit-manager.src"
#import ViperUi from "/managers/ui/viper-ui.src"
#import Router from "/facades/network/router.src"
#import MacroManager from "/managers/macro/macro-manager.src"
#import ThemeManager from "/managers/theme/theme-manager.src"
// #import DictionaryManager from "/managers/dictionary/dictionary-manager.src"
#import ConfigManager from "/managers/config/config-manager.src"
#import Printer from "/new/printer.gs" 
#import Shell from "/facades/computer-objects/shell.src";

#import WiFiLSCMD from "/cmd/viper/cmd/wifils.gs"
#import WiFiCrackCMD from "/cmd/viper/cmd/wificrack.gs"
#import ExploitScanCMD from "/cmd/viper/cmd/exploitscan.gs"

// quickfix
#import computerObjectFactory from "/facades/computer-objects/computer-object-factory.src"
#import THEME_COLORS from "/managers/theme/theme_colors.gs"

extensionMediator = ExtensionMediator.New()

commandManager = CommandManager.New()
extensionMediator.addExtension("commandManager", commandManager)
sessionManager = SessionManager.New()
extensionMediator.addExtension("sessionManager", sessionManager)
libManager = LibManager.New()
extensionMediator.addExtension("libManager", libManager)
metaxploitManager = MetaxploitManager.New(libManager, sessionManager)
extensionMediator.addExtension("metaxploitManager", metaxploitManager)
macroManager = MacroManager.New()
extensionMediator.addExtension("macroManager", macroManager)
// dictionaryManager = DictionaryManager.New()
// extensionMediator.addExtension("dictionaryManager", dictionaryManager)
themeManager = ThemeManager.New()
extensionMediator.addExtension("themeManager", themeManager)
viperUi = ViperUi.New()
extensionMediator.addExtension("viperUi", viperUi)
configManager = ConfigManager.New()
extensionMediator.addExtension("configManager", configManager)
printer = Printer.New(themeManager)
import_code("/commands.src")
commandManager.registerCommand(WiFiLSCMD.New(viperUi, sessionManager, themeManager))
commandManager.registerCommand(WiFiCrackCMD.New(viperUi, sessionManager, themeManager, libManager, printer, configManager))
commandManager.registerCommand(ExploitScanCMD.New(viperUi, sessionManager, themeManager, libManager, printer, configManager, metaxploitManager))

init = function()
    sessionManager.addSession(Session.WrapShell(Shell.New(get_shell())))
    metaxploit = sessionManager.currentSession.handler.getFile("metaxploit.so")
    if metaxploit isa Error then metaxploit = sessionManager.currentSession.handler.getFile("/lib/metaxploit.so")
    if not (metaxploit isa Error) then
        meta = include_lib(metaxploit.path)
        if meta != null then
            libManager.addLib(meta, { 
                "ip": sessionManager.currentSession.data.ip,
                "path": metaxploit.path(),
            })
        end if
    end if

    cryptoFile = sessionManager.currentSession.handler.getFile("crypto.so")
    if cryptoFile isa Error then cryptoFile = sessionManager.currentSession.handler.getFile("/lib/crypto.so")
    if not (cryptoFile isa Error) then
        crypto = include_lib(cryptoFile.path)
        if crypto != null then
            libManager.addLib(crypto, { 
                "ip": sessionManager.currentSession.data.ip,
                "path": cryptoFile.path(),
            })
        end if
    end if

    clear_screen()
    viperUi.init()

    currentLibs = libManager.currentLibs
    listCurrentLibs = []
    for lib in currentLibs
        listCurrentLibs.push(lib.value)
    end for
    viperUi.currentLibs(listCurrentLibs)

    macroManager = extensionMediator.getExtension("macroManager")
    macros = macroManager.init()

    configManager = extensionMediator.getExtension("configManager")
    configManager.init()

    themeManager = extensionMediator.getExtension("themeManager")
    themeManager.init()
end function

main = function()
    commandManager.run()

    dictionaryManager = extensionMediator.getExtension("dictionaryManager")
    if dictionaryManager then
        dictionaryManager.reset()
    end if
    userInput = user_input(viperUi.displaySession(sessionManager.currentSession))
    result = commandManager.executeCommand(userInput)
end function

init()

while(true)
    main()
end while