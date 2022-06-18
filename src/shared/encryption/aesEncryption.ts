import * as crypto from 'crypto'
const algorithm = 'aes-256-cbc'
const salt = 'randomsalt'

const crypt = (pass: any) => new Promise((resolve, reject) => {
    crypto.pbkdf2(pass, salt, 1000, 256, 'sha1', (err: any, key: unknown) => {
        if (err) reject(err)
        resolve(key)
    })
})

export class AesEncryption {

    static async encrypt(data : any , password: any){
        const derivedKey : any = await crypt(password)
        const key = derivedKey.slice(0, 32)
        const iv = key.slice(0, 16)
        const cipher = await crypto.createCipheriv(algorithm, Buffer.from(key), iv)
        let encrypted = cipher.update(data)
        encrypted = Buffer.concat([encrypted, cipher.final()])
        // console.log(encrypted.toString('base64'))
        return encrypted.toString('base64')
    }


    static async decrypt(data: any, password: any){
        const derivedKey : any = await crypt(password)
        const key = derivedKey.slice(0, 32)
        const iv = key.slice(0, 16)
        const encryptedData = Buffer.from(data, 'base64')
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv)
        let decrypted = decipher.update(encryptedData)
        decrypted = Buffer.concat([decrypted, decipher.final()])
        return decrypted.toString()
    }
}