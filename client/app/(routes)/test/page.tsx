"use client";

import React, { useState } from "react";

export default function TestPage() {
  const [interestInput, setInterestInput] = useState("");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!interestInput.trim()) {
      setError("Please describe your interests.");
      return;
    }
    setError("");
    // Here, you can call your LLM API or backend to fetch questions based on interestInput
    // Example: router.push(`/test/questions?interest=${encodeURIComponent(interestInput)}`);
    alert(`Your interests: "${interestInput}"\n\n(This will be used to generate your personalized test.)`);
  };

  return (
    <div className="max-w-lg mx-auto py-16 px-4">
      <h1 className="text-2xl font-bold mb-6">
        Tell us about your interests
      </h1>
      <p className="mb-4 text-gray-600">
        Briefly describe what you are passionate about, your favorite subjects, or what excites you most about your studies or career. This will help us tailor your skill assessment.
      </p>
      <textarea
        className="w-full rounded border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 min-h-[100px]"
        placeholder="e.g. I love building websites, solving puzzles, and learning about AI."
        value={interestInput}
        onChange={e => setInterestInput(e.target.value)}
      />
      {error && (
        <p className="text-red-500 mt-2">{error}</p>
      )}
      <div className="mt-6">
        <button
          onClick={handleNext}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow"
        >
          Next
        </button>
      </div>
    </div>
  );
}
