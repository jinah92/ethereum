var Sponsor = artifacts.require("Sponsor");
module.exports = function (_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(Sponsor);
};
