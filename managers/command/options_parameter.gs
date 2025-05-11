#import Error from "/new/error.gs"
#import Fn from "/new/fn.gs"
#import PARAMETER_TYPES from "/managers/command/parameter_types.gs"

OptionsParameter = {}
OptionsParameter.name = null
OptionsParameter.required = false
OptionsParameter.default = null
OptionsParameter.type = PARAMETER_TYPES.OPTIONS
OptionsParameter.options = {}
OptionsParameter.handle = function (args, index)
    if not(args.hasIndex(index)) and self.required then return Error.New("Missing required parameter: " + self.name)
    if not(args.hasIndex(index)) then return [self.default, index + 1]
    arg = args[index]
    if self.options.hasIndex(self.name) and not(self.options.hasIndex(arg)) then return [arg, index + 1]
    if not(self.options.hasIndex(arg)) then return Error.New("Invalid option: " + arg)
    return [self.options[arg], index + 1]
end function
OptionsParameter.New = function(options)
    param = new OptionsParameter
    if options.hasIndex("name") then param.name = options.name
    if not options.hasIndex("name") then return Error.New("Missing required parameter: name")
    if options.hasIndex("required") then param.required = options.required
    if not options.hasIndex("required") then param.required = false
    if options.hasIndex("default") then param.default = options.default
    if not options.hasIndex("default") then param.default = null
    if options.hasIndex("options") then param.options = options.options
    if not options.hasIndex("options") then return Error.New("Missing required parameter: options")
    return param
end function

module.exports = OptionsParameter