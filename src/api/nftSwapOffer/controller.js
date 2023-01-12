const Account = require('../../models/Account');
const OfferList = require('../../models/OfferList');
const SwapCollection = require('../../models/swap/SwapCollection');

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

exports.getSwapId = async (req, res) => {
  try {
    if (!req.query.offerId) {
      res.send({
        status: false,
        message: 'failed'
      });
    } else {
      let offerId = req.query.offerId;

      /** Get offer info */
      let offer = await OfferList.findOne({ _id: offerId });

      const resData = {
        providerSwapId: offer.providerSwapId,
        receiverSwapId: offer.receiverSwapId
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
      let acceptedMyOffer = await OfferList.find({ 'providerInfo.accountId': accountId, providerClaimed: false, state: 'accepted' }).sort({date: -1});
      let myOffer = await OfferList.find({ 'providerInfo.accountId': accountId, state: 'created' }).sort({date: -1});
      let acceptedReceivedOffer = await OfferList.find({ 'receiverInfo.accountId': accountId, receiverClaimed: false, state: 'accepted' }).sort({date: -1});
      let receivedOffer = await OfferList.find({ 'receiverInfo.accountId': accountId, state: 'created' }).sort({date: -1});

      const resData = {
        acceptedOffer: acceptedMyOffer.concat(acceptedReceivedOffer),
        myOffer: myOffer,
        receivedOffer: receivedOffer
      }
      console.log(resData);
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

exports.getToken = async (req, res) => {
  try {
    if (!req.query.swapId) {
      res.send({
        status: false,
        message: 'failed'
      });
    } else {
      let _swapId = atob(req.query.swapId);

      const swapCollection = await SwapCollection.findOne({ swapId: _swapId });

      const resData = {
        hbar: swapCollection.offerHbar,
        pal: swapCollection.offerPal
      }
      console.log(resData);
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

exports.editOffer = async (req, res) => {
  try {
    if (!req.body.offerId || !req.body.newOfferInfo) {
      res.send({
        status: false,
        message: 'failed'
      });
    } else {
      let offerId = req.body.offerId;
      let newOfferInfo = req.body.newOfferInfo;
      console.log("newOfferInfo log ", newOfferInfo);

      let newOffer = await OfferList.findOneAndUpdate(
        { _id: offerId },
        { providerToken: newOfferInfo.providerToken, providerNfts: newOfferInfo.providerNfts, receiverToken: newOfferInfo.receiverToken, receiverNfts: newOfferInfo.receiverNfts },
        { new: true }
      );
      console.log(newOffer);

      //send response
      res.send({
        status: true,
        message: 'Success'
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

exports.updateOffer = async (req, res) => {
  try {
    if (!req.body.offerId || !req.body.state) {
      res.send({
        status: false,
        message: 'failed'
      });
    } else {
      let offerId = req.body.offerId;
      let state = req.body.state;

      let newOffer = await OfferList.findOneAndUpdate(
        { _id: offerId },
        { state: state },
        { new: true }
      );

      //send response
      res.send({
        status: true,
        message: 'Success'
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
}