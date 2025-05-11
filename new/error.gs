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

module.exports = Error