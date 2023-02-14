import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import '../styles/globals.css'
import Layout from "../RootLayout/Layout";

import React from "react";
import {Provider} from "react-redux";
import store from "../redux/store"



export default function App({Component, pageProps}) {
    return <React.Fragment>
        <Provider store={store}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </Provider>
    </React.Fragment>
}
