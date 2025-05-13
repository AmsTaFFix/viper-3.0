#import File from "/facades/computer-objects/file.src";
#import Computer from "/facades/computer-objects/computer.src";
#import Shell from "/facades/computer-objects/shell.src";

// @type Session2
// @property {FileFileSystem} fs
// @property {File} file
// @property {Computer|null} computer
// @property {Shell|null} shell
// @property {string} type
Session2 = {}
Session2.data = {}

// @param {File|Computer|Shell} object
// @return {Session2}
Session2.New = function(object)
  obj = new self

  if object isa File then
    obj.file = object
    obj.type = "file"
  else if object isa Computer then
    obj.computer = object
    obj.file = obj.computer.getFile("/")
    obj.type = "computer"
  else if object isa Shell then
    obj.shell = object
    obj.computer = obj.shell.getComputer
    obj.file = obj.computer.getFile("/")
    obj.type = "shell"
  else if object isa Session2 then
    return object
  else
    return Error.New("Session2.New: object is not a File, Computer or Shell")
  end if

  obj.fs = FileFileSystem.New(obj.file)

  obj.data = data

  if handler isa ComputerSession or handler isa ShellSession then
    obj.data = {}
    obj.data.ip = handler.ip
  else if handler isa FileSession and data.ip == null then
    return Error.New("File session requires ip")
  end if

  if handler.user == "root" then
    handler.goTo("/root")
  else
    handler.goTo("/home/" + handler.user)
  end if

  return obj






  return obj
end function


