import {Helper} from "../helper";

const JSEncrypt = require('node-jsencrypt')
const RSAXML = require('rsa-xml')

const jsEncrypt = new JSEncrypt()

export class RsaEncryption{
    static encrypt(text: string, publicKey: any){
        try {
            publicKey = Helper.parsePublicXMLKey(publicKey)
            jsEncrypt.setPublicKey(publicKey)
            return jsEncrypt.encrypt(text)
        } catch (e: any) {
            console.log('Error:', e.stack)
        }
    }

    static decrypt(encryptedText:any, privateKey :any){
        const rsa = new RSAXML()
        rsa.importKey(privateKey)
        return rsa.decrypt(encryptedText)
    }
}