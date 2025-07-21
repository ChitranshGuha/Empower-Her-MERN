import { Html, Head, Main, NextScript } from "next/document";
import Document from "next/document";
class MyDocument extends Document{
  render(){
    return(
      <Html>
        <Head>
          <meta name="description" content="Ecomm webs with Next.js"/>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" crossOrigin="anonymous"></link>
          <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" crossOrigin="anonymous"></script>
          <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" crossOrigin="anonymous"></script>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" crossOrigin="anonymous"></script>
        </Head>
        <body>
          <Main/>
          <NextScript/>
        </body>
      </Html>
    )
  }
}
export default MyDocument