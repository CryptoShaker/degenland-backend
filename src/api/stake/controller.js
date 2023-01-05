/*require('dotenv').config('../.env');

const {
    Client,
    AccountId,
    PrivateKey,
    TransferTransaction,
    Hbar,
    NftId,
    TokenId,
    TransactionId,
    AccountAllowanceApproveTransaction
} = require('@hashgraph/sdk');

const axios = require('axios');


// Get operator from .env file
const networkType = process.env.NETWORK_TYPE;

const operatorId = AccountId.fromString(process.env.TREASURY_ID);
const operatorKey = PrivateKey.fromString(process.env.TREASURY_PVKEY);
const client = networkType === "mainnet" ?
    Client.forMainnet().setOperator(operatorId, operatorKey) :
    Client.forTestnet().setOperator(operatorId, operatorKey);

const NFT_STAKE_FEE = 1;
const HBAR_DECIMAL = 100000000;
const MIN_BALANCE_TO_REMAIN = 5;

const PIZZA_NFT_ID = "0.0.943525";
const ULTRA_SLICE_ID = "0.0.1353507";
*/
const StakedNfts = require('../../models/StakedNfts');

exports.loadStakedNfts = async (req_, res_) => {
  console.log("loadStakedNfts log - 1 : ", req_.query);
  console.log("---------------------------------------------------------------------");

  const _accountId = req_.query.accountId;

  const _stakedNfts = await StakedNfts.find({ accountId: _accountId });
  if (!_stakedNfts)
      return res_.send({ result: false, error: "Something wrong with load staked NFTs." });

  let _stakedNftInfo = [];
  for (let i = 0; i < _stakedNfts.length; i++) {
      console.log("loadStakedNfts log - 2 : ", parseInt((Date.now() - _stakedNfts[i].createdAt) / 86400000));
      let _stakedDays = parseInt((Date.now() - _stakedNfts[i].createdAt) / 86400000);

      _stakedNftInfo.push({
          tokenId: _stakedNfts[i].tokenId,
          serialNum: _stakedNfts[i].serialNum,
          stakedDays: _stakedDays
      })
  }

  return res_.send({ result: true, data: _stakedNftInfo });
}