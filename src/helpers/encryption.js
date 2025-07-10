import CryptoJS from 'crypto-js';

const secretKey = '1234567890abcdef1234567890abcdef'
if (!secretKey) {
    throw new Error("REACT_APP_SECRET_KEY_CRYPTO is not defined in the environment.");
}

const key = CryptoJS.enc.Utf8.parse(secretKey);

/**
 * Decrypts a base64 encoded AES (CBC mode) string.
 * @param {string} encryptedBase64 The base64 encoded encrypted string.
 * @returns {object | null} The decrypted JavaScript object or null on failure.
 */
export const decryptData = (encryptedBase64) => {
    if (!encryptedBase64) {
        return null;
    }

    try {
        const decodedData = CryptoJS.enc.Base64.parse(encryptedBase64);

        const iv = CryptoJS.lib.WordArray.create(decodedData.words.slice(0, 4));
        const ciphertext = CryptoJS.lib.WordArray.create(decodedData.words.slice(4));

        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: ciphertext },
            key,
            {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            }
        );

        const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

        return JSON.parse(decryptedString);

    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
};