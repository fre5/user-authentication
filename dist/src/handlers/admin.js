"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var admin_1 = require("../models/admin");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var store = new admin_1.AdminStore();
var create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var admin, newAdmin, token, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                admin = {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    username: req.body.username,
                    password: req.body.password,
                    account: 'admin'
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, store.create(admin)];
            case 2:
                newAdmin = _a.sent();
                token = jsonwebtoken_1.default.sign({ admin: newAdmin }, process.env.TOKEN_SECRET);
                res.json(token);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                res.status(400);
                res.json(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var authenticate = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var username, password, authHeader, token, decoded, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.body.username;
                password = req.body.password;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                authHeader = req.headers.authorization;
                token = authHeader.split(' ')[1];
                decoded = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
                if (!(decoded.admin.account !== 'admin')) return [3 /*break*/, 2];
                throw new Error('Not admin account');
            case 2: return [4 /*yield*/, store.authenticate(username, password)];
            case 3:
                _a.sent();
                next();
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_2 = _a.sent();
                res.status(401);
                res.send(err_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
var postAuthentication = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.status(200);
        res.send('Authentication successful');
        return [2 /*return*/];
    });
}); };
var find = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, id, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.body.username;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, store.find(username)];
            case 2:
                id = _a.sent();
                res.json(id);
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                res.status(401);
                res.json(err_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var updateName = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, newFirstname, newLastname, update, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.body.username;
                newFirstname = req.body.newFirstname;
                newLastname = req.body.newLastname;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, store.updateName(newFirstname, newLastname, username)];
            case 2:
                update = _a.sent();
                res.send(update);
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                res.status(401);
                res.json(err_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var updateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, newUsername, update, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.body.username;
                newUsername = req.body.newUsername;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, store.updateUser(username, newUsername)];
            case 2:
                update = _a.sent();
                res.send(update);
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                res.status(401);
                res.json(err_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var updatePassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, newPassword, update, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.body.username;
                newPassword = req.body.newPassword;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, store.updatePassword(username, newPassword)];
            case 2:
                update = _a.sent();
                res.send(update);
                return [3 /*break*/, 4];
            case 3:
                err_6 = _a.sent();
                res.status(401);
                res.json(err_6);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var remove = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.body.username;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, store.remove(username)];
            case 2:
                _a.sent();
                res.send('Admin deleted');
                return [3 /*break*/, 4];
            case 3:
                err_7 = _a.sent();
                res.status(401);
                res.json(err_7);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var indexUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var index, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, store.indexUser()];
            case 1:
                index = _a.sent();
                res.json(index);
                return [3 /*break*/, 3];
            case 2:
                err_8 = _a.sent();
                res.status(401);
                res.json(err_8);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var adminRoutes = function (app) {
    app.post('/admin', create);
    app.post('/admin/auth', authenticate, postAuthentication);
    app.put('/admin/name', authenticate, updateName);
    app.put('/admin/user', authenticate, updateUser);
    app.put('/admin/pass', authenticate, updatePassword);
    app.delete('/admin', authenticate, remove);
    app.get('/admin', authenticate, find);
    app.get('/admin/users', authenticate, indexUser);
};
exports.default = adminRoutes;
