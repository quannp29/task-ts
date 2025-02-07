"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerValidate = void 0;
var joi_1 = __importDefault(require("joi"));
var registerValidate = function (req, res, next) {
    var userSchema = joi_1.default.object({
        fullName: joi_1.default.string().trim().required().messages({
            "string.empty": "Full name is required",
        }),
        email: joi_1.default.string().trim().email().required().messages({
            "string.empty": "Email is required",
            "string.email": "Invalid email format",
        }),
        password: joi_1.default.string().min(4).required().messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 4 characters long",
        }),
    });
    var _a = userSchema.validate(req.body), error = _a.error, value = _a.value;
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
exports.registerValidate = registerValidate;
