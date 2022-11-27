const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");

function getAddress(publicKey) {
    const key = publicKey.slice(1,publicKey.length);
    const hashedKey = keccak256(key);
    const address = hashedKey.slice(12,hashedKey.length);
    return address;
}

const privKey1 = secp.utils.randomPrivateKey();
const pubKey1 = secp.getPublicKey(privKey1);
console.log('Priv Key 01=',secp.utils.bytesToHex(privKey1));
console.log('-- Pub Key 01=',secp.utils.bytesToHex(getAddress(pubKey1)));

const privKey2 = secp.utils.randomPrivateKey();
const pubKey2 = secp.getPublicKey(privKey2);
console.log('Priv Key 02=',secp.utils.bytesToHex(privKey2));
console.log('-- Pub Key 02=',secp.utils.bytesToHex(getAddress(pubKey2)));

const privKey3 = secp.utils.randomPrivateKey();
const pubKey3 = secp.getPublicKey(privKey3);
console.log('Priv Key 03=',secp.utils.bytesToHex(privKey3));
console.log('-- Pub Key 03=',secp.utils.bytesToHex(getAddress(pubKey3)));
