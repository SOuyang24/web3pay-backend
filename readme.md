## Introduction

## Setup prerequisites

1. Ensure the smart contract is deployed, please see [here](https://github.com/SOuyang24/web3pay-smart-contract) for more detail on deployment.
2. Ensure you signed up the [Moralis](https://admin.moralis.io/register) and create a project along with the API key
3. Install [node](https://nodejs.org/en)
4. Create a new file called .env and populate the .env with the correct information.

## Setup
```sh
yarn install
yarn start
# test
http://localhost:3001/getNameAndBalance?userAddress=your_address_in_meta_mask
```

## Lint and Prettier
```sh
yarn lint # lint the file
yarn lint:fix # fix the lint errors
yarn prettier # format the files
```
