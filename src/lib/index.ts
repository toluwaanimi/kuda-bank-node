import axios from "axios";
import {ResponseHandler} from "../shared/response";

const LIVE_BASE_URL = 'https://kuda-openapi.kuda.com/v2.1';
const TEST_BASE_URL = 'https://kuda-openapi-uat.kudabank.com/v2.1';

export class Kuda {
    private readonly email: string
    private readonly clientApiKey: string
    private readonly url: string = ""
    private readonly accessToken: string = ""

    constructor(credentials: {
        email?: string,
        clientApiKey?: string
        accessToken?: string
    }, isProduction: boolean = false) {

        if (!credentials.accessToken && !(credentials.email && credentials.clientApiKey)) {
            throw new Error('Missing credentials. Please provide accessToken or both email and clientApiKey.');
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
        let accessToken = this.accessToken;
        if (!accessToken) {
            const {status, data: dataResponse} = await this.generateSecret();
            if (!status) {
                return ResponseHandler.error({
                    response: {
                        data: {
                            message: "Failed to generate access token."
                        }
                    }
                })
            }
            accessToken = dataResponse.token;
        }
        try {
            const response = (await axios.post(this.url, {
                serviceType,
                requestRef,
                Data: data
            }, {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            })).data
            if (response.status) {
                return ResponseHandler.success(response)
            } else {
                return ResponseHandler.error({
                    response: {
                        data: {
                            message: response.message
                        }
                    }
                })
            }

        } catch (e: any) {
            return ResponseHandler.error(e)
        }
    }
}