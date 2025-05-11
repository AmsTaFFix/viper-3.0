Lib = {}
Lib.data = {
    "ip": null,
    "version": null,
}
Lib.lib = null
Lib.type = "unknown"
Lib.setIp = function(ip)
    self.data.ip = ip
end function
Lib.ip = function()
    return self.data.ip
end function
Lib.version = function()
    return self.data.version
end function
Lib.New = function(lib, data)
    result = new Lib
    result.lib = lib
    result.data = {}
    result.data.ip = null
    result.data.version = "unknown"
    result.type = "unknown"
    if not(data.hasIndex("ip")) then return Error.New("Lib data must have ip")
    if data.hasIndex("version") then result.data.version = data.version
    result.data.ip = data.ip

    if typeof(lib) == "MetaxploitLib" then result.lib = Metaxploit.New(lib)
    if result.lib isa Metaxploit then result.type = LIB_TYPES.METAXPLOIT
    if typeof(lib) == "cryptoLib" then result.lib = Crypto.New(lib)
    if result.lib isa Crypto then result.type = LIB_TYPES.CRYPTO

    if result.type == "unknown" then return Error.New("Lib type must be known")
    return result
end function

module.exports = Lib