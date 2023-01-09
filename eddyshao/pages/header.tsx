import Link from "next/link";

export default function Header() {
  return (
    <header className="md:pt-15 flex justify-center">
      <div>
        <h1 className="py-3 text-3xl font-black sm:text-5xl">
          Hi, I&apos;m Eddy.
        </h1>
        <h2 className="text-lg font-semibold md:text-xl">
          University of Sydney - Bachelor of Computing
        </h2>
        <h3 className="text-md md:text-xl">Major: Computer Science</h3>
        <h3 className="text-md md:text-xl">Minor: Psychology</h3>
        <div className="flex flex-row justify-center gap-2 pt-2">
          <Link href="https://github.com/shao-nz" target="_blank">
            <button className="btn-sm btn text-xs">GitHub</button>
          </Link>
          <Link href="/Resume.pdf" target="_blank">
            <button className="btn-sm btn text-xs">Resume</button>
          </Link>
          <Link href="https://www.linkedin.com/in/eddyshao/" target="_blank">
            <button className="btn-sm btn text-xs">LinkedIn</button>
          </Link>
        </div>
      </div>
    </header>
  );
}
