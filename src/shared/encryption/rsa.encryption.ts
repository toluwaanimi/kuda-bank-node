import {Helper} from "../helper";
// @ts-ignore
import * as JSENCRYPT from 'node-jsencrypt'

// @ts-ignore
import * as RSAXML  from 'rsa-xml'

const jsEncrypt = new JSENCRYPT()

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