// pages/index.js
import Head from "next/head";
import NavBar from "@/components/NavBar"; 
import AboutUsSection from "@/components/sections/AboutUsSection";
import CentralContentSection from "@/components/sections/CentralContentSection";
import CarouselSection from "@/components/sections/CarouselSection";
import QuerySection from "@/components/sections/QuerySection";
import FooterSection from "@/components/layout/FooterSection";

// Import Geist fonts if you're using them
import { Geist, Geist_Mono } from "next/font/google";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Empower Her</title>
        <link rel="icon" href="/images/mainlogo1.png" type="image/png" />
      </Head>

      <div className={`${geistSans.variable} ${geistMono.variable}`}>
        <NavBar />
        <AboutUsSection />
        <CentralContentSection />
        <CarouselSection />
        <QuerySection />
        <FooterSection />
      </div>
    </>
  );
}