import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import githubLogo from "../public/github-mark.svg";

type cardProps = {
  title: string;
  description: string;
  stack: Array<string>;
  img: StaticImageData;
  alt: string;
  liveUrl: string;
  githubUrl: string;
};

export default function ProjectCard(props: cardProps) {
  return (
    <div className="card rounded-lg bg-base-100 shadow-2xl">
      <figure className="max-w-sm md:max-w-md">
        <Image
          src={props.img}
          alt={props.alt}
          className="aspect-square object-scale-down"
        />
      </figure>
      <div className="card-body flex flex-col justify-center gap-0 md:max-w-md">
        <h2 className="card-title text-2xl font-bold md:text-3xl">
          {props.title}
        </h2>
        <p className="flex-grow-0">{props.description}</p>
        <h3 className="pt-2 text-xl font-medium md:text-2xl">The stack:</h3>
        <div className="justify-left flex flex-wrap pb-2">
          {props.stack.map((item: string) => {
            return (
              <code
                key={item}
                className="mt-2 mr-2 rounded-xl border bg-violet-100 px-2 text-xs md:text-base"
              >
                {item}
              </code>
            );
          })}
        </div>
        <div className="card-actions flex flex-col items-center mt-auto">
          <Link href={props.liveUrl} className="w-full" target="_blank">
            <button className="btn-primary btn-xs btn w-full md:btn-sm">
              Live
            </button>
          </Link>
          <Link href={props.githubUrl} className="w-full" target="_blank">
            <button className="btn-primary btn-xs btn flex w-full gap-2 md:btn-sm">
              <Image
                src={githubLogo}
                alt="Github Logo"
                className="aspect-square w-4 object-scale-down md:w-6"
              />
              <p className="flex-grow-0">Github</p>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
