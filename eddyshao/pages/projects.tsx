import ProjectCard from "../components/ProjectCard";
import grompSc from "../public/gromp-sc.jpg";
import shaoSc from "../public/shao-sc.jpg";
import haoSc from "../public/hao-sc.jpg";

export default function Projects() {
  return (
    <section className="flex flex-col justify-center" id="projects">
      <h1 className="py-5 text-center text-5xl font-medium">Projects</h1>
      <div className="flex flex-col flex-wrap justify-center gap-5 md:flex-row">
        <ProjectCard
          title="shao.lol"
          description="React webapp to track the match history with in-game stats and details of personal League of Legends accounts"
          stack={["React", "Vanilla CSS", "Vercel"]}
          img={shaoSc}
          alt="Screenshot of shao.lol"
          liveUrl="https://shao.lol/"
          githubUrl="https://github.com/shao-nz/shao.lol"
        />
        <ProjectCard
          title="Gromp"
          description="A multipurpose League of Legends Discord bot. View live game info, summoner profles and more."
          stack={["Python", "Next.js", "Tailwind CSS", "Vercel"]}
          img={grompSc}
          alt="Screenshot of Gromp"
          liveUrl="https://www.gromp.gg/"
          githubUrl="https://github.com/shao-nz/gromp"
        />
        <ProjectCard
          title="hao.works"
          description="Personal website to showcase Hao Wen's works."
          stack={["Next.js", "Vanilla CSS", "Vercel"]}
          img={haoSc}
          alt="Screenshot of hao.works"
          liveUrl="https://hao.works/"
          githubUrl="https://github.com/shao-nz/haowen"
        />
      </div>
    </section>
  );
}
