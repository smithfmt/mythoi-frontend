import Link from "next/link";

const navs = [{text: "Home", route: "/"}, {text: "Profile", route: "/profile"}, {text: "Register", route: "/register"}]

const Navbar = () => {
    return  <nav className="fixed z-50 top-0 left-0 w-full h-16 bg-neutral-800">
        <ul className="flex gap-16 justify-center items-center h-full w-full text-neutral-50 text-xl font-bold">
            {navs.map(nav => <li className="hover:bg-neutral-700 transition-all h-full flex items-center p-4">
                <Link href={nav.route}>{nav.text}</Link>
            </li>)}
        </ul>
    </nav>
};

export default Navbar;