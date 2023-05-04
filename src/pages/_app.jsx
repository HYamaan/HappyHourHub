import React from "react";
import Layout from "../RootLayout/Layout";
import { ToastContainer } from 'react-toastify';

import {SessionProvider} from "next-auth/react"
import {Provider} from "react-redux";
import store from "../redux/store"
import {persistor} from "../redux/store";
import {PersistGate} from "redux-persist/integration/react";
import {QueryClient,QueryClientProvider} from "@tanstack/react-query";


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


const  queryClient =new QueryClient();
export default function App({Component, pageProps: {session, ...pageProps}}) {

    return(

           <SessionProvider session={session}>
               <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <PersistGate persistor={persistor}>
                    <Layout>
                        <ToastContainer/>
                        <Component {...pageProps} />
                    </Layout>
                </PersistGate>
            </QueryClientProvider>
               </Provider>
           </SessionProvider>

    )

}
