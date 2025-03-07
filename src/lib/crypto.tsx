import nacl from "tweetnacl";
import util from "tweetnacl-util";

export const encrypt = (message: string): string => {
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  const messageUint8 = util.decodeUTF8(message);
  const encrypted = nacl.secretbox(messageUint8, nonce, getSecretKey());

  return JSON.stringify([
    util.encodeBase64(nonce),
    util.encodeBase64(encrypted),
  ]);
};

export const decrypt = (cipherText: string): string | null => {
  try {
    const [nonce, encrypted] = JSON.parse(cipherText);
    const decrypted = nacl.secretbox.open(
      util.decodeBase64(encrypted),
      util.decodeBase64(nonce),
      getSecretKey()
    );

    return decrypted ? util.encodeUTF8(decrypted) : null;
  } catch (error) {
    return null;
  }
};

let secretKey: Uint8Array;

const getSecretKey = (): Uint8Array => {
  if (secretKey === undefined) {
    const cryptoKey = import.meta.env.VITE_CRYPTO_KEY ?? "secret";
    const hash = new TextEncoder().encode(cryptoKey);
    secretKey = nacl.hash(hash).slice(0, nacl.secretbox.keyLength);
  }
  return secretKey;
};
