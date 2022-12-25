const Account = require('../../models/Account');
const OfferList = require('../../models/OfferList');

exports.getOffer = async (req, res) => {
  try {
    if (!req.query.providerAccountId || !req.query.offerId) {
      res.send({
        status: false,
        message: 'failed'
      });
    } else {
      let providerAccountId = req.query.providerAccountId;
      let offerId = req.query.offerId;

      /** Get provider info */
      let providerInfo = await Account.findOne({ accountId: providerAccountId });

      /** Get offer info */
      let offer = await OfferList.findOne({ _id: offerId });

      const resData = {
        providerInfo: providerInfo,
        offerInfo: offer
      }
      //send response
      res.send({
        status: true,
        message: 'Success',
        data: resData
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

exports.getOfferList = async (req, res) => {
  try {
    if (!req.query.accountId) {
      res.send({
        status: false,
        message: 'failed'
      });
    } else {
      let accountId = req.query.accountId;

      /** Get offer info */
      let myOffer = await OfferList.find({ 'providerInfo.accountId': accountId });
      let receivedOffer = await OfferList.find({ 'receiverInfo.accountId': accountId });

      const resData = {
        myOffer: myOffer,
        receivedOffer: receivedOffer
      }
      //send response
      res.send({
        status: true,
        message: 'Success',
        data: resData
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
}