const express = require('express')
const Moralis = require('moralis').default
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = 3001
const ABI = require('./abi.json')

app.use(cors())
app.use(express.json())

function convertArrayToObjects(arr) {
    const dataArray = arr.map((transaction, index) => ({
        key: (arr.length + 1 - index).toString(),
        type: transaction[0],
        amount: transaction[1],
        message: transaction[2],
        address: `${transaction[3].slice(0, 4)}...${transaction[3].slice(
            0,
            4
        )}`,
        subject: transaction[4],
    }))

    return dataArray.reverse()
}

app.get('/', (req, res) => {
    return res.status(200).json({"message": "web service is deployed successfully."})
})

app.get('/getNameAndBalance', async (req, res) => {
    const { userAddress } = req.query;
    try {
    const promiseName = Moralis.EvmApi.utils.runContractFunction({
        chain: process.env.CHAIN_ID,
        address: process.env.SMART_CONTRACT_ADDRESS,
        functionName: 'getMyName',
        abi: ABI,
        params: { _user: userAddress },
    })

    // 

    const promiseBalance =  Moralis.EvmApi.balance.getNativeBalance({
        chain: process.env.CHAIN_ID,
        address: userAddress,
    })

    //const jsonResponseBal = (secResponse.raw.balance / 1e18).toFixed(2)

    const promisePrice = Moralis.EvmApi.token.getTokenPrice({
        address:  process.env.CHECK_TOKEN_PRICE_SMART_CONTRACT_ADDRESS,
    })

    // const jsonResponseDollars = (
    //     thirdResponse.raw.usdPrice * jsonResponseBal
    // ).toFixed(2)

    const promiseHistory = Moralis.EvmApi.utils.runContractFunction({
        chain: process.env.CHAIN_ID,
        address: process.env.SMART_CONTRACT_ADDRESS,
        functionName: 'getMyHistory',
        abi: ABI,
        params: { _user: userAddress },
    })

    const promiseRequests  = Moralis.EvmApi.utils.runContractFunction({
        chain: process.env.CHAIN_ID,
        address: process.env.SMART_CONTRACT_ADDRESS,
        functionName: 'getMyRequests',
        abi: ABI,
        params: { _user: userAddress },
    })

    const [responseName, responseBalance, responsePrice, responseHistory, responseRequests] = await Promise.all([promiseName, promiseBalance, promisePrice, promiseHistory, promiseRequests])
    const jsonResponseName = responseName.raw
    const jsonResponseBalance = (responseBalance.raw.balance / 1e18).toFixed(2)
    const jsonResponseDollars = (
        responsePrice.raw.usdPrice * jsonResponseBalance
     ).toFixed(2);
    const jsonResponseHistory = convertArrayToObjects(responseHistory.raw);
    const jsonResponseRequests = responseRequests.raw;
    const jsonResponse = {
        name: jsonResponseName,
        balance: jsonResponseBalance,
        dollars: jsonResponseDollars,
        history: jsonResponseHistory,
        requests: jsonResponseRequests,
    }
    return res.status(200).json(jsonResponse)
    }
    catch(e) {
        return res.status(500).json({errorMessage: e.message});
    }
})

Moralis.start({
    apiKey: process.env.MORALIS_KEY,
}).then(() => {
    app.listen(port, () => {
        /* eslint-disable */
        console.log(`Listening for API Calls`)
    })
})
