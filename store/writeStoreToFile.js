"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
exports["default"] = (function (writeData) {
    var root = path_1["default"].dirname(require.main.filename);
    var data = JSON.stringify(writeData);
    var storePath = path_1["default"].resolve(root, 'store');
    return fs_1["default"].promises.writeFile(storePath + "/localStore.json", data)
        .then(function (res) {
        console.info('[LOCAL STORE] Configuration saved successfully.');
        return res;
    })["catch"](function (err) {
        console.log('[LOCAL STORE] There has been an error saving your configuration data.');
        console.error(err.message);
        return err;
    });
});
