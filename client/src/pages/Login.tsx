import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import {toast} from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../utils/Provider";

interface Props { }

export const Login: React.FC<Props> = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [error, setError] = useState({ email: "", password: "" });

    const validate = () => {
        let isValid = true;
        const errors = { email: "", password: "" };

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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const userData = await response.json()
                console.log(userData);
                login(userData.userId);
                toast.success("Login Successfully!");
                navigate('/');

            } else {
                setError({ ...error, password: "Invalid email or password" });
            }
        } catch (err) {
            console.error("Error logging in:", err);
            setError({ ...error, password: "Error logging in. Please try again later." });
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-fit">
            <div className="flex flex-col items-center justify-center w-full bg-gray-100">
                <div className="text-3xl mb-4 mt-4 font-semibold font-serif">Login</div>
                <form onSubmit={ handleLogin } className="flex flex-col w-80 bg-white p-8 rounded-lg shadow-lg">
                    <label htmlFor="email" className="text-lg mb-2">Enter your Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="example@gmail.com"
                        value={ email }
                        onChange={ (e) => setEmail(e.target.value) }
                        className={ `p-2 mb-2 border rounded ${error.email ? 'border-red-500' : 'border-gray-300'}` }
                    />
                    { error.email && (
                        <span className="text-red-500 mb-2">
                            { error.email }
                        </span>
                    ) }

                    <div className="relative mb-4">
                        <label htmlFor="password" className="text-lg mb-2">Enter your Password</label>
                        <input
                            type={ show ? "text" : "password" }
                            name="password"
                            id="password"
                            placeholder="abc#@!123..."
                            value={ password }
                            onChange={ (e) => setPassword(e.target.value) }
                            className={ `p-2 border rounded w-full ${error.password ? 'border-red-500' : 'border-gray-300'}` }
                        />
                        { !show ? (
                            <AiOutlineEyeInvisible
                                className="absolute bottom-3 right-2 cursor-pointer"
                                size={ 20 }
                                onClick={ () => setShow(true) }
                            />
                        ) : (
                            <AiOutlineEye
                                className="absolute bottom-3 right-2 cursor-pointer"
                                size={ 20 }
                                onClick={ () => setShow(false) }
                            />
                        ) }
                    </div>
                    { error.password && (
                        <span className="text-red-500 mb-2">
                            { error.password }
                        </span>
                    ) }

                    <div className="mt-4">
                        <input type="submit" value="Login" className="w-full p-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600" />
                    </div>

                    <h5 className="text-center pt-4 text-black">
                        Not have any account?
                        <NavLink to="/register">
                            <span className="text-blue-500 pl-1 cursor-pointer" onClick={ () => console.log("Sign up") }>
                                Sign up
                            </span>
                        </NavLink>
                    </h5>
                </form>
            </div>
        </div>
    );
};
