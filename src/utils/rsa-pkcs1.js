import JsEncrypt from 'jsencrypt'

const util = {

}

const pubilcKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC6u5Boy0CKmVWrls63va9Q1xSG
5cFqSfFgMKU6dT8xIv485gXOU4Rt8AGab8Tz7e+EgeH4PTVSTMae/JMmot6KpSeT
i3GJmwzoPudZ7Lyy7Ul32bmw02a+AhQH5tmafzG2iUaG73Dv7UCH7dJbbPc4+F6G
SWzbz8z4kgg3y5ZucQIDAQAB
-----END PUBLIC KEY-----
`

util.getRSAPassword = function (password) {
    let jse = new JsEncrypt()
    jse.setPublicKey(pubilcKey)
    let data = jse.encrypt(password)
    // 转化成16进制
    // var hexData = "";
    // for (var i = 0; i < data.length; i++) {
    //     if (hexData == "")
    //     hexData = data.charCodeAt(i).toString(16);
    //     else
    //     hexData += data.charCodeAt(i).toString(16);
    // }
    return data
}

export default util