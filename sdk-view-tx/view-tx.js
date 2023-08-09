#! /usr/local/bin/node

// View transfers between L1 and L2 using the Optimism SDK

const ethers = require("ethers")
const optimismSDK = require("@eth-optimism/sdk")
require('dotenv').config()

// Global variable because we need them almost everywhere
let crossChainMessenger 


const setup = async() => {

  l1SignerOrProvider = new ethers.providers.JsonRpcProvider(process.env.L1URL)
  l2SignerOrProvider = new ethers.providers.JsonRpcProvider(process.env.L2URL)

  crossChainMessenger = new optimismSDK.CrossChainMessenger({
    l1ChainId: 97,    // 97 for  BSC  Testnet
    l2ChainId: 5611,  // 5611 for opBNB mainnet     
    l1SignerOrProvider: l1SignerOrProvider,
    l2SignerOrProvider: l2SignerOrProvider,
    bedrock: true,
    contracts: {
      l1: {
        "AddressManager": "0x0000000000000000000000000000000000000000",
        "StateCommitmentChain": "0x0000000000000000000000000000000000000000",
        "CanonicalTransactionChain": "0x0000000000000000000000000000000000000000",
        "BondManager": "0x0000000000000000000000000000000000000000",
        "L1CrossDomainMessenger": "0xD506952e78eeCd5d4424B1990a0c99B1568E7c2C",
        "L1StandardBridge": "0x677311Fd2cCc511Bbc0f581E8d9a07B033D5E840",
        "OptimismPortal": "0x4386C8ABf2009aC0c263462Da568DD9d46e52a31",
        "L2OutputOracle": "0xFf2394Bb843012562f4349C6632a0EcB92fC8810"
      },
      l2: optimismSDK.DEFAULT_L2_CONTRACT_ADDRESSES,
    }
})
}    // setup


// Only the part of the ABI we need to get the symbol
const ERC20ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
        {
            "name": "",
            "type": "string"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]     // ERC20ABI



const getSymbol = async l1Addr => {
  if (l1Addr == '0x0000000000000000000000000000000000000000')
    return "ETH"
  const l1Contract = new ethers.Contract(l1Addr, ERC20ABI, crossChainMessenger.l1SignerOrProvider)
  return await l1Contract.symbol()  
}   // getSymbol

// Describe a cross domain transaction, either deposit or withdrawal
const describeTx = async tx => {
  console.log(`tx:${tx.transactionHash}`)
  // Assume all tokens have decimals = 18
  console.log(`\tAmount: ${tx.amount/1e18} ${await getSymbol(tx.l1Token)}`)
  console.log(`\tRelayed: ${await crossChainMessenger.getMessageStatus(tx.transactionHash)  
                              == optimismSDK.MessageStatus.RELAYED}`)
}  // describeTx


const main = async () => {    
    await setup()

    // The address we trace
    const addr = "0xf56aa90fea6c07eb0c190552caa166357a824a39";

    const deposits = await crossChainMessenger.getDepositsByAddress(addr)
    console.log(`Deposits by address ${addr}`)
    for (var i=0; i<deposits.length; i++)
      await describeTx(deposits[i])

    const withdrawals = await crossChainMessenger.getWithdrawalsByAddress(addr)
    console.log(`\n\n\nWithdrawals by address ${addr}`)
    for (var i=0; i<withdrawals.length; i++)
      await describeTx(withdrawals[i])
      
}  // main



main().then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })