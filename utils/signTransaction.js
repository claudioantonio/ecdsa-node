const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

function hashMessage(msg) {
    const bytes = utf8ToBytes(msg);
    const hash = keccak256(bytes); 
    return hash;
}

function signMessage(msg, privKey) {
    const hash = hashMessage(msg);
    return secp.sign(
        hash,
        privKey,{
            recovered: true
            }
    );
}

async function sign(msg, privKey) {
    const [sign, recoveryBit] = await signMessage(msg, privKey);
    console.log('sign raw',sign);
    console.log('sign hex',secp.utils.bytesToHex(sign));
    console.log('recoveryBit',recoveryBit);
}

const data = JSON.stringify({
    sender: '4afda94b83340553223a6ff99a06de79cba151b6',
    amount: 25,
    recipient: '4bfaade33e59a35540093d161027b8c287786aab',
});

sign(
    data,
    '050ee3259a80cd3d3b31d3cdd5663071e0dd0e230bcc9642f7be07009ed1e6bb'
);