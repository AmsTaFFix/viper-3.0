#import Error from "/new/error.gs"
#import Fn from "/new/fn.gs"
#import PARAMETER_TYPES from "/managers/command/parameter_types.gs"

Parameter = {}
Parameter.name = null
Parameter.required = false
Parameter.default = null
Parameter.type = null
Parameter.handle = function (args, index)
    if not(args.hasIndex(index)) and self.required then return Error.New("Missing required parameter: " + self.name)
    if not(args.hasIndex(index)) then return [self.default, index + 1]
    arg = args[index]
    if self.type == PARAMETER_TYPES.STRING then return [arg, index + 1]
    if self.type == PARAMETER_TYPES.NUMBER then
        if typeof(to_int(arg)) == "string" then return Error.New("Invalid parameter type: " + self.type)
        return [to_int(arg), index + 1]
    end if
    if self.type == PARAMETER_TYPES.BOOLEAN then 
        if arg == "true" then return [true, index + 1]
        if arg == "false" then return [false, index + 1]
        return Error.New("Invalid parameter type: " + self.type)
    end if
    return Error.New("Invalid parameter type: " + self.type)
end function
Parameter.New = function(options)
    param = new Parameter
    if options.hasIndex("name") then param.name = options.name
    if not options.hasIndex("name") then return Error.New("Missing required parameter: name")
    if options.hasIndex("required") then param.required = options.required
    if not options.hasIndex("required") then param.required = false
    if options.hasIndex("default") then param.default = options.default
    if not options.hasIndex("default") then param.default = null
    if options.hasIndex("type") then param.type = options.type
    if not options.hasIndex("type") then param.type = PARAMETER_TYPES.STRING
    return param
end function

module.exports = Parameter