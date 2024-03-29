import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [borgir, setBorgir] = useState(false);

  return (
    <nav className="navbar bg-gradient-to-br from-teal-200 to-violet-200 shadow-md">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <Link
          href="/"
          className="btn-ghost btn rounded-md text-3xl normal-case"
        >
          ES.
        </Link>

        <button
          id="borgir-btn"
          className="btn-ghost btn rounded-md md:hidden"
          aria-label="Mobile menu button"
          onClick={() => setBorgir(!borgir)}
        >
          <svg
            className="h-8 w-8"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <div
          className={`w-full flex-grow md:flex md:w-auto ${
            borgir ? "flex" : "hidden"
          }`}
        >
          <ul
            className={`mt-1 flex w-full flex-col gap-3 md:flex-grow md:flex-row md:justify-end`}
          >
            <li>
              <Link
                href="/#about"
                className="block rounded-md py-1.5 pl-5 hover:bg-primary md:px-4"
                scroll={false}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/#projects"
                className="block rounded-md py-1.5 pl-5 hover:bg-primary md:px-4"
                scroll={false}
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                href="/#contact"
                className="block rounded-md py-1.5 pl-5 hover:bg-primary md:px-4"
                scroll={false}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/connectFour"
                className="block rounded-md py-1.5 pl-5 hover:bg-primary md:px-4"
                scroll={false}
              >
                C4
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
