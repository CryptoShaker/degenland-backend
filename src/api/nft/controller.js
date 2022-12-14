const NftList = require('../../models/NftList');

exports.setNft = async (req, res) => {
    try {
      //nft init
      let nft = await NftList.find({});
      if(nft.length == 0) {
        for(let i = 1;i < 10000;i++) {
          if(i <= 1000) {
            let grandnft = new NftList({
              name: 'Degenland',
              serial_number: i
            });
            await grandnft.save();
      
            let bignft = new NftList({
              name: 'Tycoon',
              serial_number: i
            });
            await bignft.save();
      
            let mediumnft = new NftList({
              name: 'Mogul',
              serial_number: i
            });
            await mediumnft.save();
      
            let smallnft = new NftList({
              name: 'Investor',
              serial_number: i
            });
            await smallnft.save();
          }
          else if(i <= 2000) {
            let bignft = new NftList({
              name: 'Tycoon',
              serial_number: i
            });
            await bignft.save();
      
            let mediumnft = new NftList({
              name: 'Mogul',
              serial_number: i
            });
            await mediumnft.save();
      
            let smallnft = new NftList({
              name: 'Investor',
              serial_number: i
            });
            await smallnft.save();
          }
          else if(i <= 3000) {
            let mediumnft = new NftList({
              name: 'Mogul',
              serial_number: i
            });
            await mediumnft.save();
      
            let smallnft = new NftList({
              name: 'Investor',
              serial_number: i
            });
            await smallnft.save();
          }
          else if(i <= 4000) {
            let smallnft = new NftList({
              name: 'Investor',
              serial_number: i
            });
            await smallnft.save();
          }
        }
      }

      if (!req.body.nftData) {
          res.send({
            status: false,
            message: 'failed'
          });
      } else {
        let nftData = req.body.nftData;
        for(let i = 0;i < nftData.length;i++) {
          let oldnftData = await NftList.findOne({ name: nftData[i].name, serial_number: nftData[i].serial_number });
          if(oldnftData.owner != nftData[i].owner) {
            let newnftData = await NftList.findOneAndUpdate(
              { name: nftData[i].name, serial_number: nftData[i].serial_number },
              {
                token_id: nftData[i].token_id,
                owner: nftData[i].owner
              },
              { new: true }
            );
          }
        }
        //send response
        res.send({
          status: true,
          message: 'Success',
        });
      }
    } catch (err) {
        res.status(500).send(err);
    }
}

exports.getNFTData = async (req, res) => {
  try {
    //Get all NFT Data
    let allNFTData = await NftList.find({});
    let NFTData = [];
    for(let i = 0;i < allNFTData.length;i++) {
      if(allNFTData[i].owner != null)
        NFTData.push(allNFTData[i]);
    }
    //send response
    res.send({
      status: true,
      message: 'Success',
      data: NFTData
    });
  } catch (err) {
      res.status(500).send(err);
  }
}