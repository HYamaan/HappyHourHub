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
                const {email,password} =credentials;
                const user = await User.findOne({email:email}).select('+password')   // Karşılaştırma yapmak için UserSchema'yı çağırdık. Daha sonra db ye bağlandık.
                if (!user) {
                    throw new Error("No user Found with email Please Sign Up..!");
                } else {
                    return signInUser({user,password,email});

                }
            }
        })
        // ...add more providers here
    ],
    callbacks: {
        async jwt({ token,user, account, profile }) {
            // Persist the OAuth access_token and or the user id to the token right after signin
            if(user && user._id){
                token.id = user._id;
            }
            return token
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token and user id from a provider.

            if(token && token.id){
                session.user.id = token.id;
                session.user.image = undefined;
            };
            return session;
        }
    },
    pages:{
        signIn:"/auth/login",
    },
    database:process.env.MONGODB_URI,
    secret:"uO+rIYxgHfxt9LDxNOPSwTSRf/Yk4Qcfz/McZGj8w7I=",
}
const signInUser = async ({user,password,email})=>{

    const isMatch= await bcrypt.compare(password,user.password)
    if(!isMatch || user.email !== email)throw new Error("Username or Password doesn't match");
    if(user.emailVerified==="false") {
        throw new Error("Please check your email activation.")
    }

    return user;
}

export default NextAuth(authOptions)