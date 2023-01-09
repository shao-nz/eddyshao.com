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
    <div className="card bg-base-100 shadow-2xl rounded-lg md:card-side">
      <figure className="max-w-sm md:max-w-md">
        <Image
          src={props.img}
          alt={props.alt}
          className="aspect-square object-scale-down"
        />
      </figure>
      <div className="card-body flex flex-col justify-center md:max-w-xs">
        <h2 className="card-title text-3xl">{props.title}</h2>
        <p className="flex-grow-0">{props.description}</p> <br />
        <h3 className="text-2xl">The stack:</h3>
        <div className="flex flex-wrap pb-2 justify-left">
          {props.stack.map((item: string) => {
            return <code key={item} className="border bg-violet-100 rounded-xl px-2 mt-2 mr-2">{item}</code>;
          })}
        </div>
        <div className="card-actions flex flex-col items-center">
          <Link href={props.liveUrl} className="w-full" target="_blank">
            <button className="btn-primary btn btn-sm w-full">Live</button>
          </Link>
          <Link href={props.githubUrl} className="w-full" target="_blank">
            <button className="btn-primary btn btn-sm w-full flex gap-2">
              <Image src={githubLogo} alt="Github Logo" className="w-6 aspect-square object-scale-down"/>
              <p className="flex-grow-0">Github</p>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
