#import Error from "/new/error.gs";
#import FILE_TYPES from "/facades/computer-objects/file_types.gs";
#import String from "/new/string.gs";
#import getUserFromHandler from "/utils/getUserFromHandler.src";
#import File from "/facades/computer-objects/file.gs";

// @type FileFileSystem
// @property {File} current
// @property {File} root
FileFileSystem = {}

// @param {File} file
FileFileSystem.New = function(file)
  if not file isa File then return Error.New("FileFileSystem.New: file is not a File")

  obj = new self

  root = file.climbToRoot()
  if root isa Error then return root
  
  obj.root = root
  obj.current = file

  obj.user = obj.getUser

  return obj
end function

FileFileSystem.getUser = function
  if self.root.hasPermission("w") then
    return "root"
  else
    homeFile = self.getFile("/home")
    if not homeFile isa Error then
      for user in homeFile.children
        if user.name == "guest" then continue
        if user.hasPermission("w") then
          return user.name
        end if
      end for
    end if

    guestFile = handler.getFile("/home/guest")
    if not (guestFile isa Error) and guestFile.hasPermission("w") then
      return "guest"
    end if
  end if

  return "unknown"
end function

FileFileSystem.getFile = function(path)
  startingPath = self.current
  pathToFollow = path.split("/")

  if String.startsWith(path, "/") then
    startingPath = self.root
    pathToFollow = slice(pathToFollow, 1)
  end if

  for path in pathToFollow
    if path == ".." then
      startingPath = startingPath.parent
      if startingPath isa Error then return Error.New("Cannot go above root")
    else if path == "." or path == "" then
      continue
    else
      hasChild = startingPath.hasChild(path)
      if hasChild == false then return Error.New("File not found: " + startingPath.path + "/" + path)
      startingPath = startingPath.child(path)
    end if
  end for

  return startingPath
end function

FileFileSystem.goTo = function(path)
  file = self.getFile(path)
  if file isa Error then return file
  if file.type == FILE_TYPES.FILE then return Error.New("Cannot go to a file")
  self.current = file
end function

FileFileSystem.setPermissions = function(path, permissions, recersive = false)
  file = self.getFile(path)
  if file isa Error then return file
  return file.setPermissions(permissions, recersive)
end function

FileFileSystem.setOwner = function(path, owner, recersive = false)
  file = self.getFile(path)
  if file isa Error then return file
  return file.setOwner(owner, recersive)
end function

FileFileSystem.setGroup = function(path, group, recersive = false)
  file = self.getFile(path)
  if file isa Error then return file
  return file.setGroup(group, recersive)
end function

FileFileSystem.permissions = function(path)
  file = self.getFile(path)
  if file isa Error then return file
  return file.permissions
end function

FileFileSystem.copy = function(path, newPath)
  fileToCopy = self.getFile(path)
  if fileToCopy isa Error then return fileToCopy
  newFileLocation = self.getFile(newPath)
  newFileName = fileToCopy.name
  if newFileLocation isa Error then
    newFileName = newPath.split("/").pop
    newFileLocation = self.getFile(slice(newPath.split("/"), 0, newPath.split("/").len - 1).join("/"))
    if newFileLocation isa Error then return newFileLocation
  end if
  return fileToCopy.copy(newFileLocation.path, newFileName)
end function

FileFileSystem.delete = function(path)
  fileToDelete = self.getFile(path)
  if fileToDelete isa Error then return fileToDelete
  if self.isParentOf(self.current.path, fileToDelete.path) then self.current = fileToDelete.parent
  if fileToDelete.path == self.path then self.current = self.current.parent
  return fileToDelete.delete
end function

FileFileSystem.move = function(path, newPath)
  fileToMove = self.getFile(path)
  if fileToMove isa Error then return fileToMove
  newFileLocation = self.getFile(newPath)
  newFileName = fileToMove.name
  if newFileLocation isa Error or newFileLocation.type == FILE_TYPES.FILE then
    newFileName = newPath.split("/").pop
    newFileLocation = self.getFile(slice(newPath.split("/"), 0, newPath.split("/").len - 1).join("/"))
    if newFileLocation isa Error then return newFileLocation
  end if
  return fileToMove.move(newFileLocation.path, newFileName)
end function

FileFileSystem.content = function(path)
  file = self.getFile(path)
  if file isa Error then return file
  return file.content
end function

FileFileSystem.setContent = function(path, content)
  file = self.getFile(path)
  if file isa Error then return file
  return file.setContent(content)
end function

FileFileSystem.appendContent = function(path, content)
  file = self.getFile(path)
  if file isa Error then return file
  return file.appendContent(content)
end function

FileFileSystem.setName = function(path, newName)
  file = self.getFile(path)
  if file isa Error then return file
  return file.setName(newName)
end function

FileFileSystem.path = function
  return self.current.path
end function

FileFileSystem.isParentOf = function(path, childPath)
  if String.startsWith(childPath, path) then return true
  return false
end function

FileFileSystem.type = function
  return "file"
end function

FileFileSystem.privilege = function
  if self.user != "root" and self.user != "guest" then return "user"
  return self.user
end function


module.exports = FileFileSystem