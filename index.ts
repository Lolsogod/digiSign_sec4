import express, { json } from 'express'
import * as reader from 'readline-sync';
import fs from 'fs'
import * as p from 'path';
const app = express()
app.use(express.json())
import crypto from 'crypto'

let file: any;
let path = reader.question("File path: ");
let fileName = p.basename(path);
file = fs.readFileSync(path)

const sign = () =>{
    let {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    })
    console.log(publicKey)
    const sign = crypto.createSign('sha256')
    sign.update(file)
    sign.end()
    const signature = sign.sign(privateKey)
    fs.writeFileSync(`${__dirname}/files/${fileName}.sig`, signature, {
        flag: "w"
    });
    fs.writeFileSync(`${__dirname}/files/${fileName}.key`, publicKey, {
        flag: "w"
    });
}

const verify = () =>{
    const verify = crypto.createVerify('sha256')
        verify.update(file)
        verify.end()
        let signature: any;
        let sigPath = reader.question("Signature path: ");
        signature = fs.readFileSync(sigPath)
        let publicKey: any;
        let keyPath = reader.question("Public key path: ");
        publicKey = fs.readFileSync(keyPath)
        let result = verify.verify(publicKey, signature)
        console.log(result)
}

let operation = reader.question("Sign or verify (s/v)?: ");
console.log(operation)
switch (operation) {
    case "s":
        sign()
        break;
    case "v":
        verify()
        break
    default:
        break;
}