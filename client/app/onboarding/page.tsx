"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    educationLevel: "",
    grade: "",
    board: "",
    branch: "",
    year: "",
    cgpa: "",
    college: "",
  });

  const router = useRouter();

  const token = localStorage.getItem('token');
  if(!token){
    router.push('/register');
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };``

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      console.log("token in the local storage : ", token);
      console.log("data passing in to the backedn : ", formData);
      const res = await axios.post("http://localhost:8000/api/v1/auth/onboard", formData, {
        headers: { Authorization: `Bearer ${token}` }
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Onboarding</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <div>Select Education Level</div>
        <select
          name="educationLevel"
          value={formData.educationLevel}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="SCHOOL">SCHOOL</option>
          <option value="HIGHER_EDUCATION">HIGHER EDUCATION</option>
        </select>

        {/* Conditionally render fields based on education level */}
        {formData.educationLevel === "SCHOOL" && (
          <>
            <input
              type="text"
              name="grade"
              placeholder="Grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              name="board"
              placeholder="Board"
              value={formData.board}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </>
        )}

        {formData.educationLevel === "HIGHER_EDUCATION" && (
          <>
            <input
              type="text"
              name="branch"
              placeholder="Branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="number"
              name="year"
              placeholder="Year"
              value={formData.year}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="number"
              step="0.1"
              name="cgpa"
              placeholder="CGPA"
              value={formData.cgpa}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              name="college"
              placeholder="College"
              value={formData.college}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
