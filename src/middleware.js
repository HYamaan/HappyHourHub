import {verifyJwtToken} from "./libs/auth";
import {NextResponse} from "next/server";




export function middleware(request) {



    // Setting cookies on the response using the `ResponseCookies` API
    const response = NextResponse.next()
    response.cookies.set('vercel', 'fast',{path:'/test'})
    response.cookies.set({
        name: 'vercel',
        value: 'fast',
        path: '/test'
    })
   let cookie=response.cookies.get('vercel');
    //console.log("value",cookie.value) // => { name: 'vercel', value: 'fast', Path: '/test' }
    // The outgoing response will have a `Set-Cookie:vercel=fast;path=/test` header.

     response.cookies.delete('vercel');
    return NextResponse.rewrite(request.nextUrl);
}
export const config = {
    matcher:["/about",'/auth/:path*','/profile/:path*']
}


// const AUTH_PAGES=['/api/admin'];
// const isAuthPages = (url) => AUTH_PAGES.some((page) => page.startsWith(url));
// export async function middleware(request){
// const {url,nextUrl,cookies}=request;
// const {value:token} = cookies.get('token') ?? {value:null};
// const hasVerifiedToken = token && verifyJwtToken(token);
// const isAuthPageRequested=isAuthPages(nextUrl.pathname);
// if(isAuthPageRequested){
//     if(!hasVerifiedToken){
//         const response = NextResponse.next();
//         return response;
//     }
// }
//     console.log("MİDDLEWARE")
//
//     if(!hasVerifiedToken){
//         const searchParams = new URLSearchParams(nextUrl.searchParams);
//         searchParams.set('next',nextUrl.pathname);
//
//         return NextResponse.redirect(new URL('/',url));
//     }
//
//     return NextResponse.next();
// }
// export const config={
//     matcher:[
//         '/api/admin'
//     ]
// }