import Link from "next/link";
import Image, { StaticImageData } from "next/image";

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
    <div className="card bg-base-100 shadow-xl md:card-side">
      <figure className="max-w-md">
        <Image
          src={props.img}
          alt={props.alt}
          className="aspect-square object-scale-down"
        />
      </figure>
      <div className="card-body flex flex-col md:max-w-xs">
        <h2 className="card-title text-3xl">{props.title}</h2>
        <p>{props.description}</p> <br />
        <h3 className="text-2xl">The stack:</h3>
        <div className="flex space-x-4">
          {props.stack.map((item: string) => {
            return <code key={item}>{item}</code>;
          })}
        </div>
        <div className="card-actions flex flex-col items-center">
          <Link href={props.liveUrl} className="w-full" target="_blank">
            <button className="btn-primary btn w-full">Live</button>
          </Link>
          <Link href={props.githubUrl} className="w-full" target="_blank">
            <button className="btn-primary btn w-full">Github</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
