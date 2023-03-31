"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reader = __importStar(require("readline-sync"));
const fs_1 = __importDefault(require("fs"));
const p = __importStar(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const crypto_1 = __importDefault(require("crypto"));
let file;
let path = reader.question("File path: ");
let fileName = p.basename(path);
file = fs_1.default.readFileSync(path);
const sign = () => {
    let { publicKey, privateKey } = crypto_1.default.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });
    console.log(publicKey);
    const sign = crypto_1.default.createSign('sha256');
    sign.update(file);
    sign.end();
    const signature = sign.sign(privateKey);
    fs_1.default.writeFileSync(`${__dirname}/files/${fileName}.sig`, signature, {
        flag: "w"
    });
    fs_1.default.writeFileSync(`${__dirname}/files/${fileName}.key`, publicKey, {
        flag: "w"
    });
};
const verify = () => {
    const verify = crypto_1.default.createVerify('sha256');
    verify.update(file);
    verify.end();
    let signature;
    let sigPath = reader.question("Signature path: ");
    signature = fs_1.default.readFileSync(sigPath);
    let publicKey;
    let keyPath = reader.question("Public key path: ");
    publicKey = fs_1.default.readFileSync(keyPath);
    let result = verify.verify(publicKey, signature);
    console.log(result);
};
let operation = reader.question("Sign or verify (s/v)?: ");
console.log(operation);
switch (operation) {
    case "s":
        sign();
        break;
    case "v":
        verify();
        break;
    default:
        break;
}
