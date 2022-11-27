const express = require("express");
const app = express();
const cors = require("cors");
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");

const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "4afda94b83340553223a6ff99a06de79cba151b6": 100,
  "4bfaade33e59a35540093d161027b8c287786aab": 50,
  "fe24b5ce7e9c00f25629ba10848a5ed75380ece9": 75,
};

function hashMessage(message) {
  const bytes = utf8ToBytes(message);
  const hash = keccak256(bytes); 
  return hash;
}

function getAddress(publicKey) {
  const key = publicKey.slice(1,publicKey.length);
  const hashedKey = keccak256(key);
  const address = hashedKey.slice(12,hashedKey.length);
  return address;
}

function createTransferData(sender,amount,recipient) {
  return JSON.stringify({
      sender:sender,
      amount:amount,
      recipient:recipient,
    });
}

function isValidTransfer(sender, transferdata,signature,recoveryBit) {
  const transferDataBytes = hashMessage(transferdata);
  const signBytes = secp.utils.hexToBytes(signature);
  const recBitNumber = parseInt(recoveryBit);

  let recovered;
  try {
    recovered = secp.recoverPublicKey(transferDataBytes, signBytes, recBitNumber,false);
    recoveredAddress = toHex(getAddress(recovered));
    if (sender===recoveredAddress) {
      return true;
    } else {
      return false;
    }
  }catch (err) {
    console.log('err',err);
    return false;
  }
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { 
    sender, recipient, amount, signature, recoveryBit 
  } = req.body;
  const transferData = createTransferData(sender,amount,recipient);
  if (await isValidTransfer(sender, transferData,signature,recoveryBit)) {
    setInitialBalance(sender);
    setInitialBalance(recipient);
  
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.status(400).send({ message: "It is not a valid transfer" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
