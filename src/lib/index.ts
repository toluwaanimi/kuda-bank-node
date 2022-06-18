import axios from "axios";
import {AesEncryption} from "../shared/encryption/aesEncryption";
import {RsaEncryption} from "../shared/encryption/rsa.encryption";
import {ResponseHandler} from "../shared/response";

const shortid = require('shortid')

const LIVE_BASE_URL = 'https://kuda-openapi.kuda.com/v1';
const TEST_BASE_URL = 'https://kuda-openapi-uat.kudabank.com/v1';

export class Kuda {
   private readonly publicKey: string
   private privateKey: string
   private readonly clientKey: string
   private readonly url: string = ""

    constructor(publicKey: any, privateKey: any, clientKey: string, isProduction: boolean = false) {
        if (!publicKey || !privateKey || !clientKey) {
            throw new Error('missing credentials, please pass in your credentials');
        }
        this.publicKey = publicKey.toString()
        this.privateKey = privateKey.toString()
        this.clientKey = clientKey
        this.url = isProduction ? LIVE_BASE_URL : TEST_BASE_URL
    }

    async request(serviceType: string, requestRef: string, data: Record<string, any>) {
        const password = `${this.clientKey}-${shortid.generate().substring(0, 5)}`

        const payload = JSON.stringify({
            serviceType,
            requestRef,
            data
        })
        const encryptedPayload = await AesEncryption.encrypt(payload, password)
        const encryptedPassword = RsaEncryption.encrypt(password, this.publicKey)
        try {
            const {data: encryptedResponse} = await axios.post(this.url, {
                data: encryptedPayload
            }, {
                headers: {
                    password: encryptedPassword
                }
            })
            // plaintext = RSA decrypt password with our privateKey
            const plaintext = RsaEncryption.decrypt(encryptedResponse.password, this.privateKey).toString()
            // data = AES decrypt data with plaintext
            let data = await AesEncryption.decrypt(encryptedResponse.data, plaintext)
            data = JSON.parse(data)
            return ResponseHandler.success(data)
        } catch (e: any) {
            return ResponseHandler.error(e)
        }
    }
}