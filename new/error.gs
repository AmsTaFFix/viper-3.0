// @type Error
// @property {string} message
Error = {}
Error.message = ""

// Creates new Error
// @param {string} message
// @return {Error}
Error.New = function(message)
  result = new self
  result.message = message
  return result
end function

Error.Panic = function(message, filename = "unknown.gs", line = "0")
  exit("[" + filename + ":" + line + "] " + message)
end function


module.exports = Error