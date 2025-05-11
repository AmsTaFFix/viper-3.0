#import Error from "/new/error.gs"
#import Fn from "/new/fn.gs"
#import PARAMETER_TYPES from "/managers/command/parameter_types.gs"

FlagParameter = {}
FlagParameter.name = null
FlagParameter.required = false
FlagParameter.type = PARAMETER_TYPES.FLAG
FlagParameter.flag = null
FlagParameter.handle = function (args, index)
    if not(args.hasIndex(index)) and self.required then return Error.New("Missing required parameter: " + self.name)
    if not(args.hasIndex(index)) then return [false, index]
    arg = args[index]
    if arg == self.flag then return [true, index + 1]
    return [false, index]
end function
FlagParameter.New = function(options)
    param = new FlagParameter
    if options.hasIndex("name") then param.name = options.name
    if not options.hasIndex("name") then return Error.New("Missing required parameter: name")
    if options.hasIndex("required") then param.required = options.required
    if not options.hasIndex("required") then param.required = false
    if options.hasIndex("flag") then param.flag = options.flag
    if not options.hasIndex("flag") then return Error.New("Missing required parameter: flag")
    return param
end function

module.exports = FlagParameter