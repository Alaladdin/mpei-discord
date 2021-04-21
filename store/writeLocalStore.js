"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
exports["default"] = (function (writeData) {
    var data = JSON.stringify(writeData);
    return fs_1["default"].promises.writeFile("" + path_1["default"].join(__dirname, 'localStore.json'), data, 'utf-8')
        .then(function (res) {
        console.info('[LOCAL STORE] Configuration saved successfully.');
        return res;
    })["catch"](function (err) {
        console.log('[LOCAL STORE] There has been an error saving your configuration data.');
        console.error(err.message);
        return err;
    });
});
