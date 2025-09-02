"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        educationlevel: "HIGHER_EDUCATION",
    });

    // handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // handle form submit
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // prevent page reload

        try {
            setLoading(true); // set loading state
            // pass the form data in the body of the request
            console.log("Form data being sent:", formData);
            const res = await axios.post("http://localhost:8000/api/v1/auth/register", formData);
            console.log("res is : ", res);
            setLoading(false);
            const token = res.data.token;
            console.log("User registered:", res.data);
            localStorage.setItem("token", token); // store token in local storage
            router.push("/onboarding");
        } catch (error: any) {
            console.error("Registration error:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Something went wrong!");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
            <form
                onSubmit={handleSubmit}
                className="p-8 rounded-3xl shadow-lg w-full max-w-md bg-white"
            >
                <h1 className="text-2xl font-extrabold text-blue-700 text-center mb-6">Create Your Account</h1>

                <div className="mb-5">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full text-blue-700 mb-1 p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <div className="mb-5">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full text-blue-700 mb-1 p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <div className="mb-7">
                    <label htmlFor="educationlevel" className="block text-sm font-medium text-gray-700 mb-1">
                        Education Level
                    </label>
                    <select
                        id="educationlevel"
                        name="educationlevel"
                        value={formData.educationlevel}
                        onChange={handleChange}
                        className="w-full text-blue-700 p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="SCHOOL">School</option>
                        <option value="HIGHER_EDUCATION">Higher Education</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-60"
                    disabled={loading}
                >
                    {loading ? "Registering..." : "Register"}
                </button>
                <div className="text-black text-center mt-4">Already have an Account ? <Link href="/login" className="text-blue-600">Login</Link></div>

            </form>
        </div>
    );
}

export default RegisterPage;
