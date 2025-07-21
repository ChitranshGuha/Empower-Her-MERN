import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import NavBar from "../components/NavBar";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Empower Her</title>
        <link rel="icon" href="/images/mainlogo1.png" type="image/png" />
      </Head>
      <NavBar />
      <div style={{ padding: "2rem" }}>
        <h1>Hello, world!</h1>
      </div>
    </>
  );
}
