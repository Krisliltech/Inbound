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
const redis_1 = __importDefault(require("../redis"));
const auth_1 = __importDefault(require("../auth"));
const prisma = new client_1.PrismaClient();
const redisClient = (0, redis_1.default)();
function service(app) {
    app.post('/inbound/sms', auth_1.default, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.user;
            const { to, from, text } = req.body;
            const phone_number = yield prisma.phone_number.findFirst({
                where: {
                    account_id: id,
                    number: to
                }
            });
            if (!phone_number) {
                return res.status(404).json({
                    message: '',
                    error: `'to' parameter not found.`
                });
            }
            const stops = [
                'STOP',
                'STOP\n',
                'STOP\r',
                'STOP\r\n'
            ];
            if (stops.includes(text)) {
                const key = `${to}${from}`;
                const value = JSON.stringify({
                    to,
                    from
                });
                redisClient.set(key, value);
                redisClient.expire(key, 4 * 3600);
            }
            res.json({
                'message': 'inbound sms ok',
                'error': ""
            });
        }
        catch (error) {
            return res.status(500).json({
                message: "",
                error: "Unknown failure"
            });
        }
    }));
    app.use('*', (req, res) => __awaiter(this, void 0, void 0, function* () {
        res.status(405).json({
            message: "",
            error: "Invalid route."
        });
    }));
}
exports.default = service;
