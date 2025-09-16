"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [formData, setFormData] = useState({
    name: "",
    educationlevel: "",
    branch: "",
    year: "",
    cgpa: ""
  });

  const router = useRouter();
  const baseurl = process.env.NEXT_PUBLIC_API_URL;

  // const token = localStorage.getItem('token');
  // // console.log("first token is : " , token);
  // if(!token){
  //   router.push('/register');
  // }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };``

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log("data passing in to the backend : ", formData);
      const res = await axios.post(`${baseurl}/api/v1/auth/onboard`, formData, {
        withCredentials: true
      });
      console.log("Onboarding success:", res.data);
      alert("Onboarding completed!");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Error submitting onboarding:", err.response?.data || err);
      alert("Failed to submit onboarding");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg space-y-6"
      >
      <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-2">Onboarding</h2>
      <p className="text-center text-gray-500 mb-4">Please fill in your details to continue</p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
        Full Name
        </label>
        <input
        id="name"
        type="text"
        name="name"
        placeholder="Enter your full name"
        value={formData.name}
        onChange={handleChange}
        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="educationlevel">
        Education Level
        </label>
        <select
        id="educationlevel"
        name="educationlevel"
        value={formData.educationlevel}
        onChange={handleChange}
        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        required
        >
        <option value="">Select</option>
        <option value="SCHOOL">School</option>
        <option value="HIGHER_EDUCATION">Higher Education</option>
        </select>
      </div>

      {formData.educationlevel === "HIGHER_EDUCATION" && (
        <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="branch">
          Branch
          </label>
          <input
          id="branch"
          type="text"
          name="branch"
          placeholder="Branch"
          value={formData.branch}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="year">
          Year
          </label>
          <input
          id="year"
          type="number"
          name="year"
          placeholder="Year"
          value={formData.year}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
          min={1}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cgpa">
          CGPA
          </label>
          <input
          id="cgpa"
          type="number"
          step="0.1"
          name="cgpa"
          placeholder="CGPA"
          value={formData.cgpa}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
          min={0}
          max={10}
          />
        </div>
        </>
      )}

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
      >
        Submit
      </button>
      </form>
    </div>
  );
}
