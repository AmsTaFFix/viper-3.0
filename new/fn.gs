#import Error from "/new/error.gs"
// @type Fn 
Fn = {}
Fn.isIterable = function(item)
    if typeof(item) == "map" then return true
    if typeof(item) == "list" then return true
    return false
end function

Fn.forEach = function(list, callback)
    if typeof(list) == "map" then
        for v in list
            callback(v)
        end for
    end if
    if typeof(list) == "list" then
        for v in list
            callback(v)
        end for
    end if
    if Fn.isIterable(list) == false then 
        return Error.New("Invalid Type")
    end if
end function

Fn.map = function(list, callback)
    if typeof(list) == "map" then newList = {}
    if typeof(list) == "list" then newList = []
    if Fn.isIterable(list) == false then return Error.New("Invalid Type")
    if typeof(list) == "map" then
        for item in list
            k = item.key
            v = item.value
            newList[k] = callback(item)
        end for
    end if
    if typeof(list) == "list" then
        for v in list
            newList.push(callback(v))
        end for
    end if
    return newList
end function

Fn.filter = function(list, callback)
    if typeof(list) == "map" then newList = {}
    if typeof(list) == "list" then newList = []
    if Fn.isIterable(list) == false then return Error.New("Invalid Type")
    for v in list
        if callback(v) then
            newList.push(v)
        end if
    end for
    return newList
end function

Fn.find = function(aList, callback)
    if not Fn.isIterable(aList) then return Error.New("Invalid Type")
    for v in aList
        if callback(v) then
            return v
        end if
    end for
    return null
end function

Fn.reduce = function(list, callback, initialValue)
    if typeof(list) == "map" then newList = {}
    if typeof(list) == "list" then newList = []
    if Fn.isIterable(list) == false then return Error.New("Invalid Type")
    skipFirst = false
    if initialValue == null then skipFirst = true
    for v in list
        if skipFirst then
            initialValue = v
            skipFirst = false
        else
            initialValue = callback(initialValue, v)
        end if
    end for
    return initialValue
end function

Fn.every = function(list, callback)
    if typeof(list) == "map" then newList = {}
    if typeof(list) == "list" then newList = []
    if Fn.isIterable(list) == false then return Error.New("Invalid Type")
    for v in list
        if callback(v) == false then
            return false
        end if
    end for
    return true
end function

Fn.some = function(list, callback)
    if Fn.isIterable(list) == false then return Error.New("Invalid Type")
    for v in list
        if callback(v) then
            return true
        end if
    end for
    return false
end function

Fn.flat = function(list)
    if typeof(list) == "list" then newList = []
    if Fn.isIterable(list) == false then return Error.New("Invalid Type")
    for v in list
        if typeof(v) == "list" then
            l = Fn.flat(v)
            for i in l
                newList.push(i)
            end for
        else
            newList.push(v)
        end if
    end for
    return newList
end function

Fn.distinct = function(list)
    if typeof(list) == "map" then newList = {}
    if typeof(list) == "list" then newList = []
    if Fn.isIterable(list) == false then return Error.New("Invalid Type")
    if typeof(list) == "map" then
        for item in list
            k = item.key
            v = item.value
            if not newList.hasIndex(k) then
                newList[k] = v
            end if
        end for
    end if
    if typeof(list) == "list" then
        for v in list
            if newList.indexOf(v) == null then
                newList.push(v)
            end if
        end for
    end if
    return newList
end function

module.exports = Fn