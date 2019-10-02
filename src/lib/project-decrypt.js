const projectDecrypt = (data) => {
    if(data.charAt(0) != "{"){
        var password="A479542825F3B48865C4E47AF6A026F22D853DEC2B3248DF268599BF89EF78B9";
        var key = CryptoJS.enc.Utf8.parse(password.substr(0,32));
        var iv = CryptoJS.enc.Utf8.parse(password.substr(0,16));
        var encryptedHexStr = CryptoJS.enc.Hex.parse(data);
        var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        var jsonStr = CryptoJS.AES.decrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        data = jsonStr.toString(CryptoJS.enc.Utf8);
    }
    return data;
};

export default projectDecrypt;
