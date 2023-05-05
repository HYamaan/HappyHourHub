import cookie from "cookie"
import {getJwtSecretKey} from "../../../libs/auth";
import {SignJWT} from "jose";
import {NextResponse} from "next/server";

const handler = async (req,res)=>{
    const {method}=req;
    if (method==="POST"){
        const {username,password}=req.body;
        if(username ===process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD){

            // const token = await new SignJWT({
            //     username:username,
            //     role:'admin'
            // }).setProtectedHeader({
            //     alg:'HS256'
            // })
            //     .setIssuedAt()
            //     .setExpirationTime('30s')
            //     .sign(getJwtSecretKey())
            //
            // const response = NextResponse.json({
            //     success:true,
            // },{status:200})
            // response.cookies.set({
            //     name:'token',
            //     value:token,
            //     path:'/'
            // })
            // return response

            res.setHeader("Set-Cookie",cookie.serialize("token",process.env.ADMIN_TOKEN,{
                maxAge:60*60,
                sameSite:"strict",
                path:"/",
            }));

            res.status(200).json({message:"Success"});

        }else{
            res.status(400).json({message:"Wrong Credentials"})
            //return NextResponse.json({success:false},{status:400})
        }
    }
    if (method==="PUT"){
        res.setHeader(
            "Set-Cookie",
            cookie.serialize("token",process.env.ADMIN_TOKEN,{
                maxAge:-1,
                path:"/",
            }));
        res.status(200).json({message:"Success"});

    }

}
export default handler;

