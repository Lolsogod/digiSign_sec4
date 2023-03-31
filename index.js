"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const crypto_1 = __importDefault(require("crypto"));
app.get('/keys', (req, res) => {
    let { publicKey, privateKey } = crypto_1.default.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'der',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'der'
        }
    });
    res.send({ publicKey: publicKey.toString('base64'), privateKey: privateKey.toString('base64') });
});
app.post('/sign', (req, res) => {
    let data = req.body.data;
    let privateKey = req.body.privateKey;
    console.log(req.body);
    crypto_1.default.createPrivateKey({
        key: Buffer.from(privateKey, 'base64'),
        type: 'pkcs8',
        format: 'der'
    });
    const sign = crypto_1.default.createSign('sha256');
    sign.update(data);
    sign.end();
    const signature = sign.sign(privateKey).toString('base64');
    res.send({ data, signature });
});
app.post('/verify', (req, res) => {
    let { data, publicKey, signature } = req.body;
    let bublicKey = crypto_1.default.createPublicKey({
        key: Buffer.from(publicKey, 'base64'),
        type: 'spki',
        format: 'der'
    });
    const verify = crypto_1.default.createVerify('sha256');
    verify.update(data);
    verify.end();
    let result = verify.verify(publicKey, Buffer.from(signature, 'base64'));
    res.send({ verify: result });
});
app.listen('5000', () => {
    console.log('started on port 5000');
});
