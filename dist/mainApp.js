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
exports.mainApp = void 0;
const router_1 = __importDefault(require("./router/router"));
const mainApp = (app) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        app.use("/api", router_1.default);
        app.get("/", (req, res) => {
            try {
                return res.status(201).json({
                    message: "Welcome to Tech Hack Challenge 2",
                    status: 201,
                });
            }
            catch (error) {
                return res.status(404).json({
                    message: "Error",
                    status: 404,
                });
            }
        });
    }
    catch (error) {
        return error;
    }
});
exports.mainApp = mainApp;
