import React from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import '../styles/globals.css'
import Layout from "../RootLayout/Layout";


export default function App({ Component, pageProps }) {
  return <React.Fragment>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </React.Fragment>
}
