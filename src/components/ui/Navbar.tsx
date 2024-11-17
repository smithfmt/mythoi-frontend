"use client"

import { useErrorHandler } from "@components/providers/ErrorContext";
import handleError from "@utils/handleError";
import { useLoading } from "@components/providers/LoadingContext";
import { deleteAllGames, deleteAllLobbies } from "@app/requests";
import { usePathname, useRouter } from "next/navigation";

const navs = [
  { text: "Home", route: "/" },
  { text: "Lobbies", route: "/lobbies" },
  { text: "Games", route: "/games" },
  { text: "Users", route: "/users" },
  { text: "Profile", route: "/profile" },
  { text: "Register", route: "/register" }
];

const Navbar = () => {
  // Helper function to make delete request with action
  const { addError } = useErrorHandler();
  const { startLoading, stopLoading } = useLoading();
  const pathname = usePathname();
  const router = useRouter();

  const handleDeleteLobbies = async () => {
    try {
      startLoading();
      await deleteAllLobbies();
      addError(handleError({ message: "Successfully deleted all lobbies", status: 200, redirect: "/lobbies" }))
    } catch (error: unknown) {
      addError(handleError(error));
    } finally {
      stopLoading();
    }
  };

  const handleDeleteGames = async () => {
    try {
      startLoading();
      await deleteAllGames();
      addError(handleError({ message: "Successfully deleted all games", status: 200, redirect: "/lobbies" }))
    } catch (error: unknown) {
      addError(handleError(error));
    } finally {
      stopLoading();
    }
  };

  const isGamePage = pathname.split("/").includes("game")

  return (
    <nav className={`fixed z-50 top-0 left-0 w-full h-16 bg-neutral-800 ${isGamePage?"hidden":""}`}>
      <ul className="flex gap-16 justify-center items-center h-full w-full text-neutral-50 text-xl font-bold">
        {navs.map(nav => (
          <li
            key={nav.text + "-key"}
            className="hover:bg-neutral-700 transition-all h-full flex items-center"
          >
            {/* <CustomLink className="p-4" href={nav.route}>{nav.text}</CustomLink> */}
            <button onClick={() => router.push(nav.route)} className="p-4">{nav.text}</button>
          </li>
        ))}
        <li className="hover:bg-neutral-700 transition-all h-full flex items-center cursor-pointer">
          <button  className="p-4" onClick={() => handleDeleteLobbies()}>
            Delete All Lobbies
          </button>
        </li>
        <li className="hover:bg-neutral-700 transition-all h-full flex items-center cursor-pointer">
          <button  className="p-4" onClick={() => handleDeleteGames()}>
            Delete All Games
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
