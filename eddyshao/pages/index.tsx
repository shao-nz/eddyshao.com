import Head from "next/head";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";
import grompSc from "../public/gromp-sc.jpg";
import shaoSc from "../public/shao-sc.jpg";

export default function Home() {
  return (
    <>
      <Head>
        <title>Eddy Shao</title>
        <meta name="description" content="Index page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="container flex h-auto w-screen max-w-none flex-col gap-5">
        <Navbar />

        <section className="md:pt-15 flex justify-center">
          <div>
            <h1 className="text-6xl">I&apos;m Eddy.</h1> <br />
            <p className="text-center text-lg">a ...</p> <br />
          </div>
        </section>

        <section className="flex flex-col justify-center py-5" id="projects">
          <h1 className="py-5 text-center text-5xl font-medium">Projects</h1>
          <div className="flex flex-col flex-wrap justify-center gap-5 px-10 md:flex-row">
            <ProjectCard
              title="Gromp"
              description="Discord bot for all things League of Legends, including summoner profiles, live game information and more"
              stack={["Python", "Next.js"]}
              img={grompSc}
              alt="Screenshot of Gromp"
              liveUrl="https://www.gromp.gg/"
              githubUrl="https://github.com/shao-nz/Gromp"
            />
            <ProjectCard
              title="shao.lol"
              description="React webapp to display the match history of my League of Legends accounts"
              stack={["React"]}
              img={shaoSc}
              alt="Screenshot of shao.lol"
              liveUrl="https://shao.lol/"
              githubUrl="https://github.com/shao-nz/shao.lol"
            />
          </div>
        </section>

        <section className="flex justify-center" id="about">
          <h1 className="py-5 text-center text-5xl font-medium">About</h1>
        </section>

        <section className="flex justify-center" id="contact">
          <h1 className="py-5 text-center text-5xl font-medium">Contact</h1>
        </section>
        <Footer />
      </div>
    </>
  );
}
