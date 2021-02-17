/*const projectDecrypt = (data) => {
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
};*/

function Uint8ToString(u8a) {
    var CHUNK_SZ = 0x8000;
    var c = [];
    for (var i = 0; i < u8a.length; i += CHUNK_SZ) {
        c.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)));
    }
    return c.join("");
}
const projectDecrypt = (projectAsset) => {
    try {
        var password = "4A9745825F24883B657AFC4E4626A0F2253D8DE48C2B32D85F26989E9BFF78B9";
        var key = CryptoJS.enc.Utf8.parse(password.substr(0, 32));
        var iv = CryptoJS.enc.Utf8.parse(password.substr(0, 16));
        var b64encoded = btoa(Uint8ToString(projectAsset.data));
        var jsonStr = CryptoJS.AES.decrypt(b64encoded, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        var data = jsonStr.toString(CryptoJS.enc.Utf8);
        if (data.charAt(0) == '{') return data;
    } catch (e) {}
    return projectAsset.decodeText();
};

export default projectDecrypt;
