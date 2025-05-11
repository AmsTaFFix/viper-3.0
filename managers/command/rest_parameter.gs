#import Error from "/new/error.gs"
#import Fn from "/new/fn.gs"
#import PARAMETER_TYPES from "/managers/command/parameter_types.gs"

RestParameter = {}
RestParameter.name = null
RestParameter.required = false
RestParameter.default = null
RestParameter.type = PARAMETER_TYPES.REST
RestParameter.handle = function (args, index)
    if not(args.hasIndex(index)) and self.required then return Error.New("Missing required parameter: " + self.name)
    if not(args.hasIndex(index)) then return [self.default, args.len()]
    return [slice(args, index, args.len()).join(" "), args.len()]
end function
RestParameter.New = function(options)
    param = new RestParameter
    if options.hasIndex("name") then param.name = options.name
    if not options.hasIndex("name") then return Error.New("Missing required parameter: name")
    if options.hasIndex("required") then param.required = options.required
    if not options.hasIndex("required") then param.required = false
    if options.hasIndex("default") then param.default = options.default
    if not options.hasIndex("default") then param.default = null
    return param
end function

module.exports = RestParameter