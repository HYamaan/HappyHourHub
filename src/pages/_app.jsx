import React from "react";
import Layout from "../RootLayout/Layout";
import { ToastContainer } from 'react-toastify';

import {SessionProvider} from "next-auth/react"
import {Provider} from "react-redux";
import store from "../redux/store"

import Router from 'next/router'
import NProgress from "nprogress";

import "nprogress/nprogress.css";
import 'react-toastify/dist/ReactToastify.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../styles/globals.css'
Router.events.on("routeChangeStart",()=>NProgress.start());
Router.events.on("routeChangeComplete",()=>NProgress.done());
//Router.events.on("routeChangeError",()=>NProgress.error());


export default function App({Component, pageProps: {session, ...pageProps}}) {
    return(
        <SessionProvider session={session}>
            <Provider store={store}>
                <Layout>
                    <ToastContainer/>
                    <Component {...pageProps} />
                </Layout>
            </Provider>
        </SessionProvider>
    )

}
