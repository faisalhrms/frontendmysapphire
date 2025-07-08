import CryptoJS from 'crypto-js';

// Load the secret key from environment variables
const secretKey = import.meta.env.VITE_ENCRYPTION_SECRET
if (!secretKey) {
    throw new Error("REACT_APP_SECRET_KEY_CRYPTO is not defined in the environment.");
}

// The key for CryptoJS must be parsed from a UTF8 string
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
        // Decode the base64 string. The result is a WordArray.
        const decodedData = CryptoJS.enc.Base64.parse(encryptedBase64);

        // The first 16 bytes are the IV, the rest is the ciphertext.
        const iv = CryptoJS.lib.WordArray.create(decodedData.words.slice(0, 4));
        const ciphertext = CryptoJS.lib.WordArray.create(decodedData.words.slice(4));

        // Decrypt the data
        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: ciphertext }, // Pass ciphertext as a WordArray object
            key,
            {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            }
        );

        // Convert the decrypted WordArray to a UTF-8 string
        const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

        // The result is a JSON string, so parse it
        return JSON.parse(decryptedString);

    } catch (error) {
        console.error("Decryption failed:", error);
        // This is where the "Malformed UTF-8" error would be caught.
        return null;
    }
};