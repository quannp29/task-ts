"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.deleteMulti = exports.deleteTask = exports.edit = exports.create = exports.changeMulti = exports.changeStatus = exports.detail = exports.index = void 0;
var task_model_1 = __importDefault(require("../models/task.model"));
// [GET] /api/v1/tasks
var index = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var find, regex, sort, pagination, skip, userId, tasks;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                find = {
                    deleted: false,
                };
                if (req.query.status) {
                    find.status = "".concat(req.query.status);
                }
                // Search
                if (req.query.keyword) {
                    regex = new RegExp("".concat(req.query.keyword), "i");
                    find.title = regex;
                }
                sort = {};
                if (req.query.sortKey && req.query.sortValue) {
                    sort["".concat(req.query.sortKey)] = "".concat(req.query.sortValue);
                }
                pagination = {
                    limit: 4,
                    page: 1,
                };
                if (req.query.page)
                    pagination.page = parseInt("".concat(req.query.page));
                if (req.query.limit)
                    pagination.limit = parseInt("".concat(req.query.limit));
                skip = (pagination.page - 1) * pagination.limit;
                userId = res.locals.user.id;
                return [4 /*yield*/, task_model_1.default.find(__assign(__assign({}, find), { $or: [{ createdBy: res.locals.user.id }, { listUser: userId }] }))
                        .sort(sort)
                        .limit(pagination.limit)
                        .skip(skip)];
            case 1:
                tasks = _a.sent();
                res.json({
                    code: 200,
                    message: "Thành công",
                    tasks: tasks,
                });
                return [2 /*return*/];
        }
    });
}); };
exports.index = index;
// [GET] /api/v1/tasks/detail/:id
var detail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, task, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, task_model_1.default.findOne({
                        _id: id,
                        deleted: false,
                    })];
            case 1:
                task = _a.sent();
                res.json({
                    code: 200,
                    message: "Thành công",
                    task: task,
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.json({
                    code: 400,
                    message: "Không tồn tại bản ghi!",
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.detail = detail;
// [PATCH] /api/v1/tasks/change-status/:id
var changeStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, status_1, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                status_1 = req.body.status;
                return [4 /*yield*/, task_model_1.default.updateOne({
                        _id: id,
                    }, {
                        status: status_1,
                    })];
            case 1:
                _a.sent();
                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công!",
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.json({
                    code: 400,
                    message: "Không tồn tại bản ghi!",
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.changeStatus = changeStatus;
// [PATCH] /api/v1/tasks/change-multi
var changeMulti = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ids, status, listStatus, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, ids = _a.ids, status = _a.status;
                listStatus = [
                    "initial",
                    "doing",
                    "finish",
                    "pending",
                    "notFinish",
                ];
                if (!listStatus.includes(status)) {
                    res.json({
                        code: 400,
                        message: "Tr\u1EA1ng th\u00E1i ".concat(status, " kh\u00F4ng h\u1EE3p l\u1EC7!"),
                    });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, task_model_1.default.updateMany({
                        _id: { $in: ids },
                    }, {
                        status: status,
                    })];
            case 2:
                _b.sent();
                res.json({
                    code: 200,
                    message: "Đổi trạng thái thành công!",
                });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _b.sent();
                res.json({
                    code: 400,
                    message: "\u0110\u1ED5i tr\u1EA1ng th\u00E1i kh\u00F4ng th\u00E0nh c\u00F4ng!",
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.changeMulti = changeMulti;
// [POST] /api/v1/tasks/create
var create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var task_1, error_4, task;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req.body.createdBy = res.locals.user.id;
                if (!req.body.taskParentId) return [3 /*break*/, 4];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, task_model_1.default.findOne({
                        _id: req.body.taskParentId,
                        deleted: false
                    })];
            case 2:
                task_1 = _a.sent();
                if (!task_1) {
                    res.json({
                        code: 400,
                        message: "Không tồn tại công việc phụ thuộc"
                    });
                    return [2 /*return*/];
                }
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                res.json({
                    code: 400,
                    message: "Không tồn tại công việc phụ thuộc"
                });
                return [2 /*return*/];
            case 4:
                task = new task_model_1.default(req.body);
                return [4 /*yield*/, task.save()];
            case 5:
                _a.sent();
                res.json({
                    code: 200,
                    message: "Tạo công việc thành công!",
                });
                return [2 /*return*/];
        }
    });
}); };
exports.create = create;
// [PATCH] /api/v1/tasks/edit/:id
var edit = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, data, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                data = req.body;
                return [4 /*yield*/, task_model_1.default.updateOne({
                        _id: id,
                    }, data)];
            case 1:
                _a.sent();
                res.json({
                    code: 200,
                    message: "Cập nhật công việc thành công!",
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                res.json({
                    code: 400,
                    message: "Cập nhật không thành công",
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.edit = edit;
// [PATCH] /api/v1/tasks/delete/:id
var deleteTask = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, task_model_1.default.updateOne({
                        _id: id,
                    }, {
                        deleted: true,
                        deletedAt: new Date(),
                    })];
            case 1:
                _a.sent();
                res.json({
                    code: 200,
                    message: "Xóa công việc thành công!",
                });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                res.json({
                    code: 400,
                    message: "Xóa công việc không thành công",
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteTask = deleteTask;
// [PATCH] /api/v1/tasks/delete-multi
var deleteMulti = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ids, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                ids = req.body.ids;
                return [4 /*yield*/, task_model_1.default.updateMany({
                        _id: { $in: ids },
                    }, {
                        deleted: true,
                        deletedAt: new Date(),
                    })];
            case 1:
                _a.sent();
                res.json({
                    code: 200,
                    message: "Xóa các công việc thành công!",
                });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                res.json({
                    code: 400,
                    message: "Xóa công việc không thành công",
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteMulti = deleteMulti;
