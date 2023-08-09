require("@nomiclabs/hardhat-waffle");
require('dotenv').config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const words = process.env.MNEMONIC.match(/[a-zA-Z]+/g).length
validLength = [12, 15, 18, 24]
if (!validLength.includes(words)) {
   console.log(`The mnemonic (${process.env.MNEMONIC}) is the wrong number of words`)
   process.exit(-1)
}

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.19",
  etherscan: {
    // Your API key for BSCScan
    // Obtain one at https://bscscan.com/
    apiKey: "Z85HEVHNRBA5J2DIMXU7G8XWJ5KPZNHEDW"
  },
  networks: {
      "opBNBTestnet":{
        url: "https://opbnb-testnet-rpc.bnbchain.org",
        chainId: 5611,
        gas: 2100000,
        gasPrice: 20000000000,
        accounts: {mnemonic: process.env.MNEMONIC },
        timeout: 2000000,
      },
      "bscTestnet": {
        url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
        chainId: 97,
        // gas: "auto",
        // gasPrice: "auto",
        accounts: {mnemonic: process.env.MNEMONIC },
        timeout: 2000000,
        gas: 5000000,
        gasPrice: 50000000000
      },
  } ,
  mocha: {
    timeout: 400000000
    },
};
