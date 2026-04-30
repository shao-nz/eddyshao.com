import Navbar from "~/components/Navbar";
import About from "~/components/About";
import Contact from "~/components/Contact";
import Projects from "~/components/Projects";
import Header from "~/components/Header";
import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Eddy Shao" },
    { name: "description", content: "Index page" },
  ];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  return {
    emailjsServiceId: context.cloudflare.env.EMAILJS_SERVICE_ID || "",
    emailjsTemplateId: context.cloudflare.env.EMAILJS_TEMPLATE_ID || "",
    emailjsPublicKey: context.cloudflare.env.EMAILJS_PUBLIC_KEY || "",
  };
};

export default function Home() {
  const { emailjsServiceId, emailjsTemplateId, emailjsPublicKey } =
    useLoaderData<typeof loader>();

  return (
    <div className="container h-auto w-screen max-w-none bg-gradient-to-br from-violet-100 to-teal-100">
      <Navbar />
      <div className="flex flex-col gap-8 px-20">
        <Header />
        <About />
        <Projects />
        <Contact
          emailjsServiceId={emailjsServiceId}
          emailjsTemplateId={emailjsTemplateId}
          emailjsPublicKey={emailjsPublicKey}
        />
      </div>
    </div>
  );
}
