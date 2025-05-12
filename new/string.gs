// @type String
String = {}

String.startsWith = function (str, prefix) 
    return str.indexOf(prefix) == 0
end function

String.endsWith = function (str, suffix) 
    return str.indexOf(suffix) == str.len - suffix.len
end function

module.exports = String