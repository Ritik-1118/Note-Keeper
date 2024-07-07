import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
import {toast} from "react-toastify";

interface Props {}

export const Register: React.FC<Props> = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [error, setError] = useState({ username: "", email: "", password: "" });

    const validate = () => {
        let isValid = true;
        const errors = { username: "", email: "", password: "" };

        if (!username) {
            errors.username = "Please enter your username";
            isValid = false;
        }

        if (!email) {
            errors.email = "Please enter your email";
            isValid = false;
        }

        if (!password) {
            errors.password = "Please enter your password";
            isValid = false;
        }

        setError(errors);
        return isValid;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            // console.log({username,email,password})
            const response = await fetch(`http://localhost:5000/api/users/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (response.ok) {
                const userData = await response.json()
                console.log(userData);
                toast.success("Registration Successful!");
                navigate('/login');
            } else {
                // Handle registration error
                setError({ ...error, password: "Registration failed. Please try again." });
            }
        } catch (err) {
            console.error("Error registering:", err);
            setError({ ...error, password: "Error registering. Please try again later." });
        }
    };

    return (
        <div className="flex items-center justify-center w-full">
            <div className="flex flex-col items-center justify-center w-full bg-gray-100">
                <div className="text-2xl mb-4 mt-4 font-semibold font-serif">Register</div>
                <form onSubmit={handleRegister} className="flex flex-col w-80 bg-white p-8 rounded-lg shadow-lg">
                    <label htmlFor="username" className="text-lg mb-2">Enter your Username</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Your Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`p-2 mb-2 border rounded ${error.username ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {error.username && (
                        <span className="text-red-500 mb-2">
                            {error.username}
                        </span>
                    )}

                    <label htmlFor="email" className="text-lg mb-2">Enter your Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`p-2 mb-2 border rounded ${error.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {error.email && (
                        <span className="text-red-500 mb-2">
                            {error.email}
                        </span>
                    )}

                    <div className="relative mb-4">
                        <label htmlFor="password" className="text-lg mb-2">Enter your Password</label>
                        <input
                            type={show ? "text" : "password"}
                            name="password"
                            id="password"
                            placeholder="abc#@!123..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`p-2 border rounded w-full ${error.password ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {!show ? (
                            <AiOutlineEyeInvisible
                                className="absolute bottom-3 right-2 cursor-pointer"
                                size={20}
                                onClick={() => setShow(true)}
                            />
                        ) : (
                            <AiOutlineEye
                                className="absolute bottom-3 right-2 cursor-pointer"
                                size={20}
                                onClick={() => setShow(false)}
                            />
                        )}
                    </div>
                    {error.password && (
                        <span className="text-red-500 mb-2">
                            {error.password}
                        </span>
                    )}

                    <div className="mt-4">
                        <input type="submit" value="Register" className="w-full p-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600" />
                    </div>

                    <h5 className="text-center pt-4 text-black">
                        Already have an account?
                        <NavLink to="/login">
                            <span className="text-blue-500 pl-1 cursor-pointer" onClick={() => console.log("Login")}>
                                Login
                            </span>
                        </NavLink>
                    </h5>
                </form>
            </div>
        </div>
    );
};
