const { createHash } = require('crypto');
const Account = require('../../models/Account');

exports.createNewPlayer = async (req_, res_) => {
    console.log("uploadName log - 1 : ", req_.body);

    const c_accountId = req_.body.accountId;
    const c_playerId = req_.body.playerId;
    const c_avatarName = req_.body.avatarName;

    const c_findAccountId = await Account.find({ accountId: c_accountId });
    console.log("uploadName log - 2 : ", c_findAccountId);

    if (c_findAccountId?.length > 0)
        return res_.send({ result: false, error: "This account is already registered!" });

    const c_findPlayerId = await Account.find({ playerId: c_playerId });
    console.log("uploadName log - 3 : ", c_findPlayerId);

    if (c_findPlayerId?.length > 0)
        return res_.send({ result: false, error: "This player Id is already used!" });

    const c_newPlayerData = new Account({
        accountId: c_accountId,
        playerId: c_playerId,
        avatarUrl: "avatars/" + c_avatarName
    });

    const c_insertNewResult = await c_newPlayerData.save();
    console.log("uploadName log - 4 : ", c_insertNewResult)
    if (!c_insertNewResult)
        return res_.send({ result: false, error: "Something wrong with creating" });

    return res_.send({ result: true, data: c_insertNewResult });
}

exports.uploadAvatar = async (req_, res_) => {
    console.log("uploadAvatar log - 1 : ", req_.files);
    try {
        if (!req_.files) {
            console.log("uploadAvatar log - 2");
            res_.send({
                result: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let u_avatar = req_.files.avatar;

            let u_nameList = u_avatar.name.split(".");
            let u_ext = u_nameList[u_nameList.length - 1];
            let u_preHashStr = u_avatar.name + Date.now();
            const u_hashStr = createHash('sha1').update(u_preHashStr).digest('hex');
            const u_newName = u_hashStr + "." + u_ext;

            //Use the mv() method to place the file in the upload directory (i.e. "uploads")
            u_avatar.mv(`./uploads/avatars/` + u_newName);

            //send response
            res_.send({
                result: true,
                data: {
                    name: u_newName,
                    mimetype: u_avatar.mimetype,
                    size: u_avatar.size
                }
            });
        }
    } catch (err) {
        res_.send({
            result: false,
            message: 'Something wrong.'
        });
    }
}

exports.getPlayerInfo = async (req_, res_) => {
    console.log("getPlayerInfo log - 1 : ", req_.query);

    const g_accountId = req_.query.accountId;

    const g_findAccountId = await Account.find({ accountId: c_accountId });
    console.log("uploadName log - 2 : ", c_findAccountId);

    if (!g_findAccountId?.length > 0)
        return res_.send({ result: false, error: "This account is already registered!" });

}