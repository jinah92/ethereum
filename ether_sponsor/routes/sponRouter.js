const express = require("express");
const router = express.Router();

const Sponsor = require("../truffle/build/contracts/Sponsor.json");
const Web3 = require("web3");
let web3 = new Web3();
let accounts = null;
let contract = null;

router.post("/add", async (req, res) => {
  try {
    web3.setProvider(new Web3.providers.HttpProvider("http://localhost:7545"));
    accounts = await web3.eth.getAccounts(); //모든 계정
    const networkId = await web3.eth.net.getId(); // 네트워크 ID : 5777 (네트워크에 접속)
    const deployedNetwork = Sponsor.networks[networkId];
    contract = new web3.eth.Contract(Sponsor.abi, deployedNetwork && deployedNetwork.address);
    let amount = parseInt(req.body.amount, 10);
    // let etherAmount = amount * 1000000000000000000;
    let etherAmount = web3.utils.toWei(String(amount), "ether");
    // console.log(req.body.amount, amount);
    console.log(etherAmount);
    // await contract.methods.add(amount).send({ from: accounts[0] }); //기부금 받기
    await web3.eth.sendTransaction({ to: req.body.account, from: accounts[0], value: etherAmount }); //기부금 보내기
    await console.log("sendee : " + req.body.account);
    let sendeeBalance = await web3.eth.getBalance(req.body.account);
    const sendeeBalanceTotal = web3.utils.fromWei(String(sendeeBalance), "ether");
    await console.log("sender: " + accounts[0]);
    await web3.eth.getBalance(accounts[0]).then(console.log);
    const total = await contract.methods.get().call();
    // res.send({ msg: total });
    res.send({ msg: sendeeBalanceTotal });
  } catch (error) {
    console.error(error);
    res.send({ msg: error.message });
  }
});

module.exports = router;
