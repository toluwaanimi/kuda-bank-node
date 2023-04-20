import axios from "axios";
import {AesEncryption} from "../shared/encryption/aesEncryption";
import {RsaEncryption} from "../shared/encryption/rsa.encryption";
import {ResponseHandler} from "../shared/response";
import * as shortid from 'shortid'

const LIVE_BASE_URL = 'https://kuda-openapi.kuda.com/v2.1';
const TEST_BASE_URL = 'https://kuda-openapi-uat.kudabank.com/v2.1';

export class Kuda {
    private readonly email: string
    private readonly clientApiKey: string
    private readonly url: string = ""
    private readonly accessToken: string = ""

    constructor(credentials : {
        email?: string,
        clientApiKey?: string
        accessToken?: string
    }, isProduction: boolean = false) {
        if (
            (credentials && !!credentials.email && !!credentials.clientApiKey) || (credentials && !!credentials.accessToken)) {
            throw new Error('missing credentials, please pass in your credentials');
        }
        this.email = credentials.email?.toLowerCase() || ""
        this.clientApiKey = credentials.clientApiKey?.toString() || ""
        this.url = isProduction ? LIVE_BASE_URL : TEST_BASE_URL
        this.accessToken = credentials.accessToken || ""
    }

    async generateSecret() {
        try {
            const response = (await axios.post(this.url + "/Account/GetToken", {
                "email": this.email,
                "apiKey": this.clientApiKey
            })).data
            return {
                status: true,
                data: {
                    token: response
                }
            }
        } catch (e) {
            return {
                status: false,
                data: {
                    token: ""
                }
            }
        }
    }

    async request(serviceType: string, requestRef: string, data: Record<string, any>) {
        try {
            const response = (await axios.post(this.url, {
                serviceType,
                requestRef,
                Data: data
            }, {
                headers: {
                    Authorization: "Bearer " + !!this.accessToken ? this.accessToken : (await this.generateSecret()).data.token
                }
            })).data
            return ResponseHandler.success(response)
        } catch (e: any) {
            return ResponseHandler.error(e)
        }
    }
}