import { Fragment } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
// import { Cross } from '@heroicons/react/24/solid'
// import styles from "./navbar.module.css";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const AvatarDropdown = () => {
  const { data, status } = useSession();
  const isLoading = status === "loading";
  const isNotAuthed = status === "unauthenticated";
  const img = data?.user.image ?? null;

  if (isNotAuthed) {
    return (
      <div>
        <button
          className="btn 10 bg-teal-700 text-white"
          onClick={() => void signIn()}
        >
          Sign in
        </button>
      </div>
    );
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <Menu.Button
            className={classNames(
              open ? "ring-4 ring-gray-300 dark:ring-gray-600" : "",
              isLoading ? "animate-pulse" : "",
              "mr-3 flex  rounded-full bg-gray-800 text-sm md:mr-0",
            )}
          >
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="h-8 w-8 rounded-full"
                src={img}
                alt="user photo"
              />
            ) : (
              <svg
                className="h-8 w-8 text-gray-200 dark:text-gray-700"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
              </svg>
            )}
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm",
                      )}
                    >
                      Account settings
                    </Link>
                  )}
                </Menu.Item>
                <form method="POST" action="#">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => void signOut()}
                        type="submit"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block w-full px-4 py-2 text-left text-sm",
                        )}
                      >
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </form>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export const Navbar = () => {
  return (
    <nav className="border-gray-200 bg-white dark:bg-gray-900">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <Link href="/" className="flex items-center">
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
            Platform
          </span>
        </Link>
        <div className="flex items-center md:order-2">
          <AvatarDropdown />
        </div>

        {/* Menu items */}
        {/* <div
          className="hidden w-full items-center justify-between md:order-1 md:flex md:w-auto"
          id="navbar-user"
        >
          <ul className={styles.list}>
            <li>
              <Link href="/" className={styles.link}>
                Home
              </Link>
            </li>
            <li>
              <Link href="#" className={styles.link}>
                About
              </Link>
            </li>
            <li>
              <Link href="#" className={styles.link}>
                Services
              </Link>
            </li>
            <li>
              <Link href="#" className={styles.link}>
                Pricing
              </Link>
            </li>
            <li>
              <Link href="#" className={styles.link}>
                Contact
              </Link>
            </li>
          </ul>
        </div> */}
      </div>
    </nav>
  );
};
