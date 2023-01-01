import Head from "next/head";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact</title>
        <meta
          name="description"
          content="Contact Eddy Shao"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="max-h-none container flex h-screen w-screen max-w-none flex-col">
        <Navbar />

        <div className="flex justify-center md:pt-15">
          <p className="text-3xl">Contact me</p>
        </div>

        <Footer />
      </div>
    </>
  );
}
