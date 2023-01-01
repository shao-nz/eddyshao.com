import Head from "next/head";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>Eddy Shao</title>
        <meta
          name="description"
          content="Index page"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="max-h-none container flex h-screen w-screen max-w-none flex-col">
        <Navbar />

        <div className="flex justify-center md:pt-15">
          <p className="text-xl">Hi, I&quot;m Eddy.</p>
        </div>

        <Footer />
      </div>
    </>
  );
}
