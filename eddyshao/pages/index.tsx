import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import About from "./about";
import Contact from "./contact";
import Link from "next/link";
import Projects from "./projects";
import Header from "./header";

export default function Home() {
  return (
    <>
      <Head>
        <title>Eddy Shao</title>
        <meta name="description" content="Index page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="container h-auto w-screen max-w-none bg-gradient-to-br from-violet-100 to-teal-100">
        <Navbar />
        <div className="flex flex-col gap-8 px-20">
          <Header />
          <About />
          <Projects />
          <Contact />
          {/* <Footer /> */}
        </div>
      </div>
    </>
  );
}
