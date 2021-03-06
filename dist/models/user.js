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
exports.__esModule = true;
exports.UserStore = void 0;
// @ts-ignore
var database_1 = __importDefault(require("../database"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var saltRounds = process.env.SALT_ROUNDS;
var pepper = process.env.BCRYPT_PASSWORD;
var UserStore = /** @class */ (function () {
    function UserStore() {
    }
    UserStore.prototype.create = function (u) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, row, sql_1, hash, result_1, user, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        sql = 'SELECT username FROM users WHERE username=($1)';
                        return [4 /*yield*/, conn.query(sql, [u.username])];
                    case 2:
                        result = _a.sent();
                        row = result.rows[0];
                        if (!row) return [3 /*break*/, 3];
                        throw new Error('Username not available');
                    case 3:
                        sql_1 = 'INSERT INTO users (firstname, lastname, username, password_digest, account) VALUES ($1, $2, $3, $4, $5) RETURNING *';
                        hash = bcrypt_1["default"].hashSync(u.password + pepper, parseInt(saltRounds));
                        return [4 /*yield*/, conn.query(sql_1, [u.firstname, u.lastname, u.username, hash, u.account])];
                    case 4:
                        result_1 = _a.sent();
                        user = result_1.rows[0];
                        conn.release();
                        return [2 /*return*/, user];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        err_1 = _a.sent();
                        throw new Error("Unable to create a new user " + err_1);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    UserStore.prototype.authenticate = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        sql = 'SELECT account, password_digest FROM users WHERE username=($1)';
                        return [4 /*yield*/, conn.query(sql, [username])];
                    case 2:
                        result = _a.sent();
                        if (result.rows.length) {
                            user = result.rows[0];
                            if (bcrypt_1["default"].compareSync(password + pepper, user.password_digest)) {
                                conn.release();
                                return [2 /*return*/, user];
                            }
                        }
                        conn.release();
                        return [2 /*return*/, null];
                }
            });
        });
    };
    UserStore.prototype.find = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        sql = 'SELECT id FROM users WHERE username=($1)';
                        return [4 /*yield*/, conn.query(sql, [username])];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        return [2 /*return*/, result.rows[0]];
                    case 3:
                        err_2 = _a.sent();
                        throw new Error("Unable to get id from username " + username + " " + err_2);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserStore.prototype.updateName = function (newFirstname, newLastname, username) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        sql = 'SELECT firstname, lastname FROM users WHERE username=($1)';
                        return [4 /*yield*/, conn.query(sql, [username])];
                    case 2:
                        result = _a.sent();
                        result = result.rows[0];
                        if (!(result.firstname !== newFirstname || result.lastName !== newLastname)) return [3 /*break*/, 4];
                        sql = 'UPDATE user SET firstname=($1), lastname=($2) WHERE username=($3)';
                        return [4 /*yield*/, conn.query(sql, [newFirstname, newLastname, username])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        conn.release();
                        return [2 /*return*/, 'Name update success'];
                    case 5:
                        err_3 = _a.sent();
                        throw new Error("Unable to update user information " + err_3);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UserStore.prototype.updateUser = function (username, newUsername) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, row, newSql, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        sql = 'SELECT username FROM users WHERE username=($1)';
                        return [4 /*yield*/, conn.query(sql, [newUsername])];
                    case 2:
                        result = _a.sent();
                        row = result.rows[0];
                        if (!row) return [3 /*break*/, 3];
                        throw new Error('Username not available');
                    case 3:
                        newSql = 'UPDATE users SET username=($2) WHERE username=($1)';
                        return [4 /*yield*/, conn.query(newSql, [username, newUsername])];
                    case 4:
                        _a.sent();
                        conn.release();
                        return [2 /*return*/, 'Username update success'];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        err_4 = _a.sent();
                        throw new Error("Unable to update username " + err_4);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    UserStore.prototype.updatePassword = function (username, newPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var same, conn, newSql, hash, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.authenticate(username, newPassword)];
                    case 1:
                        same = _a.sent();
                        if (!!same) return [3 /*break*/, 4];
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 2:
                        conn = _a.sent();
                        newSql = 'UPDATE users SET password_digest=($1) WHERE username=($2)';
                        hash = bcrypt_1["default"].hashSync(newPassword + pepper, parseInt(saltRounds));
                        return [4 /*yield*/, conn.query(newSql, [hash, username])];
                    case 3:
                        _a.sent();
                        conn.release();
                        return [2 /*return*/, 'Password update success'];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_5 = _a.sent();
                        throw new Error("Unable to update password " + err_5);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UserStore.prototype.remove = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        sql = 'DELETE FROM users WHERE id=($1)';
                        return [4 /*yield*/, conn.query(sql, [id])];
                    case 2:
                        _a.sent();
                        conn.release();
                        return [2 /*return*/, 'User account removal success'];
                    case 3:
                        err_6 = _a.sent();
                        throw new Error("Unable to delete user id " + id);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return UserStore;
}());
exports.UserStore = UserStore;
