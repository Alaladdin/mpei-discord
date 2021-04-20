"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.eventEmitter = exports.setters = exports.getters = exports.state = void 0;
var events_1 = __importDefault(require("events"));
var writeStoreToFile_1 = __importDefault(require("./writeStoreToFile"));
var localStore_json_1 = __importDefault(require("./localStore.json"));
events_1["default"].captureRejections = true;
var eventEmitter = new events_1["default"].EventEmitter();
exports.eventEmitter = eventEmitter;
var state = {
    savedShortId: localStore_json_1["default"].savedShortId || '',
    actualityChannel: localStore_json_1["default"].actualityChannel || '',
    actualityTime: localStore_json_1["default"].actualityTime || '',
};
exports.state = state;
var getters = {
    getSavedShortId: function () { return state.savedShortId; },
    getActualityChannel: function () { return state.actualityChannel; },
    getActualityTime: function () { return state.actualityTime; },
};
exports.getters = getters;
var setters = {
    listener: function (eventName) {
        if (eventName === void 0) { eventName = ''; }
        writeStoreToFile_1["default"](state)
            .then(function () {
            if (eventName)
                eventEmitter.emit(eventName);
        });
    },
    setSavedShortId: function (newVal) {
        state.savedShortId = newVal;
        this.listener('savedShortId');
    },
    setActualityChannel: function (newVal) {
        state.actualityChannel = newVal;
        this.listener('actualityChannel');
    },
    setActualityTime: function (newVal) {
        state.actualityTime = newVal;
        this.listener('actualityTime');
    },
};
exports.setters = setters;
