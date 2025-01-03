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
exports.friendRequestEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ejs_1 = __importDefault(require("ejs"));
const node_path_1 = __importDefault(require("node:path"));
const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
const GOOGLE_URL = process.env.GOOGLE_URL;
const GOOGLE_TOKEN = process.env.GOOGLE_TOKEN;
const oAuth = new googleapis_1.google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_URL);
oAuth.setCredentials({ refresh_token: GOOGLE_TOKEN });
const friendRequestEmail = (senderEmail, receiverEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = (yield oAuth.getAccessToken()).token;
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.GOOGLE_MAIL,
            clientId: GOOGLE_ID,
            clientSecret: GOOGLE_SECRET,
            refreshToken: GOOGLE_TOKEN,
            accessToken: accessToken,
        },
    });
    const pathFile = node_path_1.default.join(__dirname, "../views/sent.ejs");
    let url = `http://localhost:5173/auth/login`;
    const html = yield ejs_1.default.renderFile(pathFile, {
        email: senderEmail,
        name: receiverEmail,
        url: url,
    });
    const mailData = {
        to: receiverEmail,
        from: `${process.env.GOOGLE_MAIL}`,
        subject: "",
        text: "This is just a test message",
        html,
    };
    yield transporter.sendMail(mailData).then(() => {
        console.log("mail sent");
    });
});
exports.friendRequestEmail = friendRequestEmail;
