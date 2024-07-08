import { FC, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoMdLogOut, IoIosSearch } from "react-icons/io";
import { TbLogin } from "react-icons/tb";
import { BiUser } from "react-icons/bi";
import { useAuth } from "../../utils/Provider";
import {toast} from "react-toastify";

interface Props {}

export const Navbar: FC<Props> = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useAuth();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        toast.info("Logged out")
        navigate("/login");
    };

    return (
        <nav className="w-full border-gray-200 px-2 sm:px-6 py-2 bg-gray-500">
            <div className="flex items-center">
                <div className="max-w-9xl w-full mx-auto flex flex-wrap sm:justify-self-auto md:justify-between justify-between items-center">
                    <NavLink to="/" className="flex md:ml-5 items-center">
                        <span className="font-sans mb-2 md:mb-0 self-center text-3xl font-semibold text-white">
                            Notes Keeper
                        </span>
                    </NavLink>
                    <div className={`${isMobileMenuOpen && "hidden"} flex items-center xl:w-1/2 md:ml-12 border bg-white rounded-md`}>
                        <input
                            type="search"
                            name="search"
                            id="search"
                            className="px-4 py-2 rounded-md bg-transparent border-none w-full"
                        />
                        <IoIosSearch className="text-2xl mx-2 cursor-pointer" />
                    </div>
                    <div className="flex">
                        <button
                            onClick={toggleMobileMenu}
                            type="button"
                            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-cyan-700 rounded-lg md:hidden focus:outline-none dark:text-cyan-600"
                            aria-controls="navbar-sticky"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox={isMobileMenuOpen ? "0 0 24 24" : "0 0 17 14"}
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d={
                                        isMobileMenuOpen
                                            ? "M6 18L18 6M6 6l12 12"
                                            : "M1 1h15M1 7h15M1 13h15"
                                    }
                                />
                            </svg>
                        </button>
                    </div>
                    <div
                        className={`items-center justify-between w-full md:flex md:w-auto ${
                            isMobileMenuOpen ? "block" : "hidden"
                        }`}
                        id="navbar-sticky"
                    >
                        <ul className="flex flex-col md:flex-row md:space-x-8 md:mr-9 md:mt-0 md:text-sm md:font-medium">
                            <li>
                                <NavLink
                                    to="/"
                                    className="flex items-center py-2 pr-4 pl-3 text-white text-xl "
                                    aria-current="page"
                                    onClick={closeMobileMenu}
                                >
                                    <BiUser className="text-center text-xl mx-2" />
                                    Profile
                                </NavLink>
                            </li>
                            {isLoggedIn ? (
                                <li>
                                    <div
                                        className="flex items-center text-xl py-2 pr-4 pl-3 text-white cursor-pointer"
                                        onClick={()=>{
                                            handleLogout()
                                            closeMobileMenu
                                        }}
                                    >
                                        <IoMdLogOut className="text-center text-xl mx-2" />
                                        Logout
                                    </div>
                                </li>
                            ) : (
                                <>
                                    <li>
                                        <NavLink
                                            to="/login"
                                            className="flex items-center text-xl py-2 pr-4 pl-3 text-white"
                                            onClick={closeMobileMenu}
                                        >
                                            <TbLogin className="text-center text-xl mx-2" />
                                            Login
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/register"
                                            className="flex items-center text-xl py-2 pr-4 pl-3 text-white"
                                            onClick={closeMobileMenu}
                                        >
                                            <TbLogin className="text-center text-xl mx-2" />
                                            Register
                                        </NavLink>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};
