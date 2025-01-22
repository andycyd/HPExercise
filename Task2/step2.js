exports.inviteUser = async function(req, res) {
    try {
        const invitationBody = req.body;
        const shopId = req.params.shopId;
        const authUrl = process.env.AUTH_URL || "https://url.to.auth.system.com/invitation";

        const invitationResponse = await superagent.post(authUrl).send(invitationBody);

        switch (invitationResponse.status) {
            case 201:
                const authId = invitationResponse.body.authId;
                const createdUser = await User.findOneAndUpdate(
                    { authId },
                    { authId, email: invitationBody.email },
                    { upsert: true, new: true }
                );

                const shop = await Shop.findById(shopId);
                if (!shop) {
                    res.status(400).json({ message: 'No shop found' });
                    return;
                }
                UpdateShop(shop, invitationResponse.body, createdUser);

                res.status(200).json(invitationResponse.body);
                break;
            case 200:
                res.status(409).json({
                    error: true,
                    message: 'User already invited to this shop'
                });
            break;
            default:
                res.status(500).json({ message: "Internal error" });
            break;
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal error" });
    }
};

const UpdateShop = async (shop, invitationResponse, createdUser) => {
    var shopUpdated = false;
    if (!shop.invitations.includes(invitationResponse.body.invitationId)) {
        shop.invitations.push(invitationResponse.body.invitationId);
        shopUpdated = true;
    }
    if (!shop.users.includes(createdUser._id)) {
        shop.users.push(createdUser);
        shopUpdated = true;
    }

    if (shopUpdated) {
        await shop.save();
    }
}