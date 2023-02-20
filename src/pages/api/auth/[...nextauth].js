import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import User from "../../../models/User"
import dbConnect from "../../../utilities/dbConnect";

import bcrypt from "bcryptjs";

export const authOptions = {
    //adapter: MongoDBAdapter(clientPromise),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),

        CredentialsProvider({

            name: "Credentials",

            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },

            },
            async authorize(credentials) {
                dbConnect().catch(error=>{error:"Connection Failed!"});
                const email = credentials.email;
                const password = credentials.password;
                const user = await User.findOne({email:email})   // Karşılaştırma yapmak için UserSchema'yı çağırdık. Daha sonra db ye bağlandık.
                if (!user) {
                    throw new Error("No user Found with email Please Sign Up..!");
                } else {
                    return signInUser({user,password,email});

                }
            }
        })
        // ...add more providers here
    ],
    pages:{
        signIn:"/auth/login",
    },
    database:process.env.MONGODB_URI,
    secret:"secret",
}
const signInUser = async ({user,password,email})=>{
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch || user.email !== email)throw new Error("Username or Password doesn't match");

    return user;
}

export default NextAuth(authOptions)