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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const joi_1 = __importDefault(require("joi"));
const prisma = new client_1.PrismaClient();
function auth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const schema = joi_1.default.object({
                username: joi_1.default.string().min(3).max(120).required().messages({
                    "string.base": `"username" is invalid`,
                    "string.empty": `"username" must contain value`,
                    "string.min": `"username" must be at least 3 character long`,
                    "string.max": `"username" must not exceed 120 characters.`,
                    "any.required": `"username" is missing`,
                }),
                auth_id: joi_1.default.string().min(3).max(120).required().messages({
                    "string.base": `"auth_id" is invalid`,
                    "string.empty": `"auth_id" must contain value`,
                    "string.min": `"auth_id" must be at least 3 character long`,
                    "string.max": `"auth_id" must not exceed 120 characters.`,
                    "any.required": `"auth_id" is missing`,
                }),
                from: joi_1.default.string().min(6).max(16).required().messages({
                    "string.base": `"from" is invalid`,
                    "string.empty": `"from" must contain value`,
                    "string.min": `"from" must be at least 6 characters long`,
                    "string.max": `"from" must not exceed 16 characters.`,
                    "any.required": `"from" is missing`,
                }),
                to: joi_1.default.string().min(6).max(16).required().messages({
                    "string.base": `"to" is invalid`,
                    "string.empty": `"to" must contain value`,
                    "string.min": `"to" must be at least 6 characters long`,
                    "string.max": `"to" must not exceed 16 characters.`,
                    "any.required": `"to" is missing`,
                }),
                text: joi_1.default.string().min(1).max(120).required().messages({
                    "string.base": `"text" is invalid`,
                    "string.empty": `"text" must contain value`,
                    "string.min": `"text" must be at least 1 character long`,
                    "string.max": `"text" must not exceed 120 characters.`,
                    "any.required": `"text" is missing`,
                }),
            });
            const validation = schema.validate(req.body);
            if (validation.error) {
                return res.status(403).json({
                    message: "",
                    error: validation.error.message,
                });
            }
            const { username, auth_id } = req.body;
            const user = yield prisma.account.findFirst({
                where: {
                    username,
                    auth_id,
                },
            });
            if (user) {
                req.user = user;
                next();
            }
            else {
                return res.status(403).json({
                    message: "",
                    error: "Invalid Credentials, check username and authId then try again.",
                });
            }
        }
        catch (error) {
            return res.status(500).json({
                message: "",
                error: "Unable to authenticate user",
            });
        }
    });
}
exports.default = auth;
