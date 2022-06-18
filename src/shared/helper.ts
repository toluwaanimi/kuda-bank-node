

export class Helper{

    static  preparedSigned(hexStr: string | any[]){
        const msb = hexStr[0]
        if (
            (msb >= '8' && msb <= '9') ||
            (msb >= 'a' && msb <= 'f') ||
            (msb >= 'A' && msb <= 'F')) {
            return '00' + hexStr
        } else {
            return hexStr
        }
    }

    static toHex( number: any){
        const nstr = number.toString(16);
        if (nstr.length % 2 === 0) return nstr
        return '0' + nstr
    }

    static encodeLengthHex(n: number){
        if (n <= 127) return this.toHex(n)
        else {
            const nHex = this.toHex(n)
            const lengthOfLengthByte = 128 + nHex.length / 2 // 0x80+numbytes
            return this.toHex(lengthOfLengthByte) + nHex
        }
    }



    static rsaPublicKeyPem(modulusB64 : any, exponentB64 : any){
        const modulus = Buffer.from(modulusB64, 'base64')
        const exponent = Buffer.from(exponentB64, 'base64')

        let modulusHex : any = modulus.toString('hex')
        let exponentHex : any = exponent.toString('hex')

        modulusHex = this.preparedSigned(modulusHex)
        exponentHex = this.preparedSigned(exponentHex)

        const modlen = modulusHex.length / 2
        const explen = exponentHex.length / 2

        const encodedModlen = this.encodeLengthHex(modlen)
        const encodedExplen = this.encodeLengthHex(explen)
        const encodedPubkey = '30' +
            this.encodeLengthHex(
                modlen +
                explen +
                encodedModlen.length / 2 +
                encodedExplen.length / 2 + 2
            ) +
            '02' + encodedModlen + modulusHex +
            '02' + encodedExplen + exponentHex

        let seq2 =
            '30 0d ' +
            '06 09 2a 86 48 86 f7 0d 01 01 01' +
            '05 00 ' +
            '03' + this.encodeLengthHex(encodedPubkey.length / 2 + 1) +
            '00' + encodedPubkey

        seq2 = seq2.replace(/ /g, '')

        let derHex = '30' + this.encodeLengthHex(seq2.length / 2) + seq2

        derHex = derHex.replace(/ /g, '')

        const der = Buffer.from(derHex, 'hex')
        const derB64 : any= der.toString('base64')

        const pem = '-----BEGIN PUBLIC KEY-----\n' +
            derB64.match(/.{1,64}/g).join('\n') +
            '\n-----END PUBLIC KEY-----\n'

        return pem
    }

    static parsePublicXMLKey(key: any) {
        const modulus = key.match(/<Modulus>([^<].*)<\/Modulus>/)[1]
        const exponent = key.match(/<Exponent>([^<].*)<\/Exponent>/)[1]
        return this.rsaPublicKeyPem(modulus, exponent)
    }
}