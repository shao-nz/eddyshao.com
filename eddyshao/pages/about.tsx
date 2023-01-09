import Link from "next/link";

export default function About() {
  return (
    <section className="lg:m-auto lg:w-1/2 flex flex-col justify-center lg:px-20" id="about">
      <h1 className="py-3 text-center text-5xl font-medium">About</h1>
      <div>
        <p>
          I&apos;m passionate about building tools and products to improve our quality of life. I believe in
          lifelong learning, as such, I strive to learn more and develop my
          craft day by day.
        </p>
        <br />
        <p>
          At the moment, I&apos;m developing my skills in{" "}
          <code>JavaScript</code> and <code>CSS</code>, while learning about{" "}
          <code>Rust</code> and backend development to expand my skillset.
        </p>
        <br />
        <p>In my spare time, I enjoy <Link href="https://www.worldcubeassociation.org/persons/2012SHAO01" target="_blank" className="text-purple-400 underline">speedcubing</Link>, powerlifting, and playing League of Legends.</p>
      </div>
    </section>
  );
}
