"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskValidate = void 0;
var joi_1 = __importDefault(require("joi"));
var createTaskValidate = function (req, res, next) {
    var taskSchema = joi_1.default.object({
        title: joi_1.default.string().trim().min(3).required().messages({
            "string.empty": "Title is required",
            "string.min": "Title must be at least 3 characters long",
        }),
        status: joi_1.default.string()
            .valid("initial", "doing", "finish", "pending", "notFinish")
            .required()
            .messages({
            "any.only": "Status must be either initial, doing, finish, pending or notFinish",
        }),
        content: joi_1.default.string().trim().optional(),
        timeStart: joi_1.default.date().required().messages({
            "date.base": "Invalid start time",
        }),
        timeFinish: joi_1.default.date().greater(joi_1.default.ref("timeStart")).required().messages({
            "date.greater": "Finish time must be later than start time",
        }),
        listUser: joi_1.default.array().items(joi_1.default.string()).optional().messages({
            "array.base": "ListUser must be an array of user ids",
        }),
        taskParentId: joi_1.default.string().trim().optional(),
    });
    var _a = taskSchema.validate(req.body), error = _a.error, value = _a.value;
    if (error) {
        res.json({
            code: 400,
            errors: error.details.map(function (item) { return item.message; }),
        });
        return;
    }
    req.body = value;
    next();
};
exports.createTaskValidate = createTaskValidate;
