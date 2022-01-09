"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const service_1 = __importDefault(require("./service"));
(0, dotenv_1.config)(); // activate access to environment variables.
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
(0, service_1.default)(app);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server now running on port ${PORT}`);
});
