"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var admin_1 = __importDefault(require("./handlers/admin"));
var user_1 = __importDefault(require("./handlers/user"));
var app = (0, express_1.default)();
var port = process.env.PORT || 5000;
app.use(body_parser_1.default.json());
(0, admin_1.default)(app);
(0, user_1.default)(app);
app.listen(port, function () {
    console.log("Server active and listening to port " + port);
});
exports.default = app;
