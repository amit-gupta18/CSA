"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        educationLevel: "SCHOOL",
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
            console.log("res is : " , res);
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
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="p-6 rounded-2xl shadow-md w-full max-w-md"
            >
                <h1 className="text-xl font-bold text-black text-center mb-4">Register</h1>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full text-blue-600 mb-3 p-2 border rounded"
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full text-blue-600 mb-3 p-2 border rounded"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full text-blue-600 mb-3 p-2 border rounded"
                    required
                />

                <select
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleChange}
                    className="w-full text-blue-600 mb-3 p-2 border rounded"
                >
                    <option value="SCHOOL">School</option>
                    <option value="HIGHER_EDUCATION">Higher Education</option>

                </select>

                <button
                    type="submit"
                    className="w-full bg-blue-600 cursor-pointer text-white py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
}

export default RegisterPage;
