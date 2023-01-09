import { ChangeEvent, useState, useRef, Ref, FormEvent } from "react";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const emailjsServiceId: string = process.env
    .NEXT_PUBLIC_EMAILJS_SERVICE_ID as string;
  const emailjsTemplateId: string = process.env
    .NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string;
  const emailjsPublicKey: string = process.env
    .NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string;

  const form = useRef<HTMLFormElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    console.log("Name", e.target.value);
  };
  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    console.log("Email", e.target.value);
  };
  const onMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    console.log("Message", e.target.value);
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setMessage("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentForm = form.current;

    if (currentForm == null) {
      alert(
        "Sorry, error sending email. Please contact me directly at dev@eddyshao.com"
      );
      resetForm();
      return;
    }

    if (
      currentForm.user_name.value.length === 0 ||
      currentForm.user_email.value.length === 0 ||
      currentForm.message.value.length === 0
    ) {
      alert("All fields are required!");
    }

    emailjs
      .sendForm(
        emailjsServiceId,
        emailjsTemplateId,
        currentForm,
        emailjsPublicKey
      )
      .then(
        (res) => {
          console.log(res.text);
          alert("Email sent successfully!");
        },
        (err) => {
          console.log(err.text);
          alert(
            "Sorry, error sending email. Please contact me directly at dev@eddyshao.com"
          );
        }
      );

    resetForm();
  };

  return (
    <section
      className="m-auto flex flex-col justify-center gap-2 pb-10 md:w-1/2"
      id="contact"
    >
      <h1 className="text-center text-5xl font-medium">Contact Me</h1>
      <div className="rounded-lg bg-base-100 px-10 py-4 shadow-2xl">
        <form
          className="form-control md:grid md:grid-cols-1"
          onSubmit={handleSubmit}
          ref={form}
        >
          <div className="w-full">
            <label className="label">
              <span className="text-bold label-text label-text text-xl">
                Name
              </span>
            </label>
            <input
              type="text"
              name="user_name"
              className="input-primary input input-sm w-full rounded-lg"
              value={name}
              onChange={(e) => onNameChange(e)}
            />
            <label className="label">
              <span className="text-bold label-text label-text text-xl">
                Email
              </span>
            </label>
            <input
              type="email"
              name="user_email"
              className="input-primary input input-sm w-full rounded-lg"
              value={email}
              onChange={(e) => onEmailChange(e)}
            />
            <label className="label w-10">
              <span className="text-bold label-text label-text text-xl">
                Message
              </span>
            </label>
            <textarea
              name="message"
              className="textarea-primary textarea h-40 w-full rounded-lg"
              value={message}
              onChange={(e) => onMessageChange(e)}
            />
          </div>
          <button
            className="btn-xs btn mt-2 w-full justify-self-center md:btn-sm"
            type="submit"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
