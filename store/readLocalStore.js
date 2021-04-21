"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
exports["default"] = (function () {
    try {
        return JSON.parse(fs_1["default"].readFileSync(path_1["default"].resolve(__dirname, 'localStore.json'), 'utf-8'));
    }
    catch (err) {
        return {};
    }
});
