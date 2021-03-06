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
exports.AdminStore = void 0;
// @ts-ignore
var database_1 = __importDefault(require("../database"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var saltRounds = process.env.SALT_ROUNDS;
var pepper = process.env.BCRYPT_PASSWORD;
var AdminStore = /** @class */ (function () {
    function AdminStore() {
    }
    AdminStore.prototype.create = function (a) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, row, sql_1, hash, result_1, admin, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = 'SELECT username FROM admin WHERE username=($1)';
                        return [4 /*yield*/, conn.query(sql, [a.username])];
                    case 2:
                        result = _a.sent();
                        row = result.rows[0];
                        if (!row) return [3 /*break*/, 3];
                        throw new Error('Username not available');
                    case 3:
                        sql_1 = 'INSERT INTO admin (firstname, lastname, username, password_digest, account) VALUES ($1, $2, $3, $4, $5) RETURNING *';
                        hash = bcrypt_1.default.hashSync(a.password + pepper, parseInt(saltRounds));
                        return [4 /*yield*/, conn.query(sql_1, [a.firstname, a.lastname, a.username, hash, a.account])];
                    case 4:
                        result_1 = _a.sent();
                        admin = result_1.rows[0];
                        conn.release();
                        return [2 /*return*/, admin];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        err_1 = _a.sent();
                        throw new Error("Unable to create a new admin user " + err_1);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AdminStore.prototype.authenticate = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, admin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = 'SELECT account, password_digest FROM admin WHERE username=($1)';
                        return [4 /*yield*/, conn.query(sql, [username])];
                    case 2:
                        result = _a.sent();
                        if (result.rows.length) {
                            admin = result.rows[0];
                            if (bcrypt_1.default.compareSync(password + pepper, admin.password_digest)) {
                                conn.release();
                                return [2 /*return*/, admin];
                            }
                        }
                        conn.release();
                        return [2 /*return*/, null];
                }
            });
        });
    };
    AdminStore.prototype.find = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = 'SELECT id FROM admin WHERE username=($1)';
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
    AdminStore.prototype.updateName = function (newFirstname, newLastname, username) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = 'SELECT firstname, lastname FROM admin WHERE username=($1)';
                        return [4 /*yield*/, conn.query(sql, [username])];
                    case 2:
                        result = _a.sent();
                        result = result.rows[0];
                        newFirstname = newFirstname || result.firstname;
                        newLastname = newLastname || result.lastname;
                        if (!(result.firstname !== newFirstname || result.lastName !== newLastname)) return [3 /*break*/, 4];
                        sql = 'UPDATE admin SET firstname=($1), lastname=($2) WHERE username=($3)';
                        return [4 /*yield*/, conn.query(sql, [newFirstname, newLastname, username])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, 'Name update success'];
                    case 4:
                        conn.release();
                        return [3 /*break*/, 6];
                    case 5:
                        err_3 = _a.sent();
                        throw new Error("Unable to update user information " + err_3);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AdminStore.prototype.updateUser = function (username, newUsername) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, row, newSql, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = 'SELECT username FROM admin WHERE username=($1)';
                        return [4 /*yield*/, conn.query(sql, [newUsername])];
                    case 2:
                        result = _a.sent();
                        row = result.rows[0];
                        if (!row) return [3 /*break*/, 3];
                        throw new Error('Username not available');
                    case 3:
                        newSql = 'UPDATE admin SET username=($2) WHERE username=($1)';
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
    AdminStore.prototype.updatePassword = function (username, newPassword) {
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
                        return [4 /*yield*/, database_1.default.connect()];
                    case 2:
                        conn = _a.sent();
                        newSql = 'UPDATE admin SET password_digest=($1) WHERE username=($2)';
                        hash = bcrypt_1.default.hashSync(newPassword + pepper, parseInt(saltRounds));
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
    AdminStore.prototype.remove = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = 'DELETE FROM admin WHERE username=($1)';
                        return [4 /*yield*/, conn.query(sql, [username])];
                    case 2:
                        _a.sent();
                        conn.release();
                        return [2 /*return*/, 'Admin account removal success'];
                    case 3:
                        err_6 = _a.sent();
                        throw new Error("Unable to delete user username " + username);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AdminStore.prototype.indexUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, results, row, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = 'SELECT id, firstname, lastname, username FROM users';
                        return [4 /*yield*/, conn.query(sql)];
                    case 2:
                        results = _a.sent();
                        row = results.rows[0];
                        conn.release();
                        return [2 /*return*/, row];
                    case 3:
                        err_7 = _a.sent();
                        throw new Error("Unable to retrieve all users " + err_7);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return AdminStore;
}());
exports.AdminStore = AdminStore;
