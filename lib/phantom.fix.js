/*jslint unparam: true */
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        FuncNOP = function () {return;},
        fBound = function () {
          return fToBind.apply(this instanceof FuncNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    FuncNOP.prototype = this.prototype;
    fBound.prototype = new FuncNOP();

    return fBound;
  };
}

if (!window.CustomEvent) {
    window.CustomEvent = function (type, data) {
        var evt = document.createEvent('Event');
        evt.initEvent(type, data.bubbles, data.cancelable);
        evt.detail = data.detail;
        return evt;
    };
}

var tizen = {
    systeminfo : {
        getPropertyValue: function(name, callback) {return;},
        addPropertyValueChangeListener : function () {return;}
    },
    application : {
        getAppContext : function () {
            return {
                appId : ''
            };
        },
        getCurrentApplication : function () {
            return {
                appInfo : {
                    version: "1.0"
                },
                exit: function () {
                    return;
                }
            };
        },
        getAppSharedURI: function () {
            return "";
        }
    },
    alarm : {
        removeAll : function() {
            return;
        }
    },
    callhistory : {
        addChangeListener : function () {
            return;
        },
        find: function() {return;}
    },
    contact: {
        getDefaultAddressBook: function() {
            return {
                find: function () {return;}
            };
        }
    },
    SortMode: function() {
        return {};
    },
    time: {
        getCurrentDateTime: function() {
           return {
              toLocalTimezone: function() {return;}
           };
        },
        getDateFormat: function () {return;},
        getTimeFormat: function () {return;}
    },
    calendar: {
        getDefaultCalendar: function() {
            return {
                find: function() {return;}
            };
        }
    },
    TZDate: function () {
        return;
    },
    AttributeFilter: function () {
        return;
    },
    AttributeRangeFilter: function () {
        return;
    },
    CompositeFilter: function () {
        return;
    }
};
