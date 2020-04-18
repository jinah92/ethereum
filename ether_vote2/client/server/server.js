const SimpleStorageContract = require("../src/contracts/SimpleStorage.json");
const Web3 = require("web3");
let web3 = new Web3();
let accounts = null;
let contract = null;

const ethers = require("ethers");
const cors = require("cors");

const express = require("express");
const path = require("path");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.static(path.join(__dirname, "..", "public/")));

app.use(express.json());

app.get("/api/init", async (req, res, next) => {
  try {
    web3.setProvider(new Web3.providers.HttpProvider("http://localhost:7545"));
    accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = SimpleStorageContract.networks[networkId];
    contract = new web3.eth.Contract(
      SimpleStorageContract.abi,
      deployedNetwork && deployedNetwork.address
    );
    //console.log(os.userInfo().username+"님 투표 가능하십니다");
    res.send({ titleMsg: os.userInfo().username + "님 투표 가능하십니다" });
  } catch (error) {
    console.error(error);
    res.send({ titleMsg: error.message });
  }
});

app.post("/api/vote", async (req, res, next) => {
  try {
    const candidate = req.body.candidate;
    const _candidate = ethers.utils.formatBytes32String(candidate);
    const _voter = req.body.voter;
    // await contract.methods.voteForCandidate(_candidate).send({ from: accounts[0] });
    const _count = await web3.eth.getTransactionCount(_voter);
    // voter가 투표를 한 경우
    if (_count) {
      res.send(JSON.stringify({ deny: 1 }));
      return;
    } else {
      //기부금 보내기
      await contract.methods.voteForCandidate(_candidate).send({ from: _voter });
      // 전체 투표 수
      const totalVoteNum = await contract.methods.get().call();
      // 후보자 득표 수
      const totalVotesFor = await contract.methods.totalVotesFor(_candidate).call();
      res.send(JSON.stringify({ totalVoteNum, candidate, totalVotesFor, contractAddress }));
    }
  } catch (error) {
    console.error(error);
    res.send({ titleMsg: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Check out the app at http://localhost:${PORT}`);
});
