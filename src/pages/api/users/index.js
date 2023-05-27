import dbConnect from "../../../utilities/dbConnect";
import User from "../../../models/User"

const handler = async (req, res) => {
    await dbConnect();
    const {method} = req;

    if (method === "GET") {
    try{
      if(req.query === "basketId"){
          const user = await User.find();
          res.status(200).json(user);
      }else{
          const users = await User.find();
          res.status(200).json(users);
      }
    }catch (err){

        console.log(err);
    }
    }
    if (method === "POST") {
        try{
            const newUsers = await User.create(req.body);
            res.status(200).json(newUsers);
        }catch (err){
            console.log(err);
        }
    }
}
export default handler;

