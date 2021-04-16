"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.setters = exports.getters = exports.state = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var localStore_json_1 = __importDefault(require("./localStore.json"));
var root = path_1["default"].dirname(require.main.filename);
var state = {
    savedShortId: localStore_json_1["default"].savedShortId || '',
};
exports.state = state;
var writeToFile = function () {
    var data = JSON.stringify(state);
    var storePath = path_1["default"].resolve(root, 'store');
    fs_1["default"].writeFile(storePath + "/localStore.json", data, function (err) {
        if (err) {
            console.log('There has been an error saving your configuration data.');
            console.log(err.message);
            return;
        }
        console.log('Configuration saved successfully.');
    });
};
var getters = {
    getSavedShortId: function () { return state.savedShortId; },
};
exports.getters = getters;
var setters = {
    setSavedShortId: function (newVal) {
        state.savedShortId = newVal;
        writeToFile();
    },
};
exports.setters = setters;
