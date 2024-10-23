"use client"

import Link from "next/link";
import axios from "axios";
import { getAuthToken } from "@utils/getAuthToken"; // Assuming you have this function

const navs = [
  { text: "Home", route: "/" },
  { text: "Profile", route: "/profile" },
  { text: "Register", route: "/register" }
];

const Navbar = () => {
  // Helper function to make delete request with action
  const handleDeleteLobbies = async (action: string) => {
    try {
      await axios.post("/api/lobby", { action }, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });
      alert(`Action '${action}' Lobbies completed successfully`);
    } catch (error) {
      console.error(`Failed to perform '${action}'`, error);
      alert(`Error performing action '${action}'`);
    }
  };

  const handleDeleteGames = async (action: string) => {
    try {
      await axios.post("/api/game", { action }, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });
      alert(`Action '${action}' Games completed successfully`);
    } catch (error) {
      console.error(`Failed to perform '${action}'`, error);
      alert(`Error performing action '${action}'`);
    }
  };

  return (
    <nav className="fixed z-50 top-0 left-0 w-full h-16 bg-neutral-800">
      <ul className="flex gap-16 justify-center items-center h-full w-full text-neutral-50 text-xl font-bold">
        {navs.map(nav => (
          <li
            key={nav.text + "-key"}
            className="hover:bg-neutral-700 transition-all h-full flex items-center p-4"
          >
            <Link href={nav.route}>{nav.text}</Link>
          </li>
        ))}
        <li className="hover:bg-neutral-700 transition-all h-full flex items-center p-4 cursor-pointer">
          <button onClick={() => handleDeleteLobbies("deleteAll")}>
            Delete All Lobbies
          </button>
        </li>
        <li className="hover:bg-neutral-700 transition-all h-full flex items-center p-4 cursor-pointer">
          <button onClick={() => handleDeleteGames("deleteAll")}>
            Delete All Games
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
