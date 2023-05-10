import User from "../../../models/User";
import dbConnect from "../../../utilities/dbConnect";

const handler = async (req, res) => {
    await dbConnect();
    const {method} = req;
    const userId = req.query.slug[0].split('=')[1]
    const addressId = req.query.slug[1]?.split('=')[1]

    if (method === "GET") {
        try {

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({message: 'User not found!'});
            }
            if (addressId) {
                const address = user.address.id(addressId);
                res.status(200).json(address);
            }
            res.status(200).json(user);

        } catch (err) {
            console.log(err);
        }
    }

    if (method === "PATCH") {
        try {
            const {addressType, country, city, district, phoneNumber, address1} = req.body.newValues;
            if (!addressType || !country || !city || !phoneNumber || !address1 || !district) {
                return res.status(400).send({message: 'Please provide all the required fields.'});
            }

            if (addressId) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: userId, 'address._id': addressId},
                    {
                        $set: {
                            'address.$.addressType': addressType,
                            'address.$.country': country,
                            'address.$.city': city,
                            'address.$.district': district,
                            'address.$.phoneNumber': phoneNumber,
                            'address.$.address1': address1
                        }
                    },
                    {new: true}
                );

                res.status(200).json(updatedUser);
            } else {
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    {$push: {address: {addressType, country, city, district, phoneNumber, address1}}},
                    {new: true}
                );
                res.status(200).json(updatedUser);
            }
        } catch (err) {
            console.log(err);
        }

    }

    if (method === "DELETE") {
        try {

            if (!userId) {
                return res.status(400).send({ message: 'Please provide the _id field.' });
            }

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $pull: { address: { _id:addressId} } },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).send({ message: 'User not found.' });
            }

            res.status(200).json(updatedUser);
        } catch (err) {
            console.log(err);
        }
    }

};

export default handler;