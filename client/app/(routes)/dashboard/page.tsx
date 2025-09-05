"use client";
import { useState } from "react";

export default function Dashboard() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState<any>(null);

   

    return (
        <div>

            <h1>Dashboard</h1>


            <input
                type="text"
                placeholder="Enter your interests"
                className="border border-gray-300 rounded-md p-2 w-full"
                onChange={(e) => setInput(e.target.value)}
                value={input}
            />
            <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
                Generate Career Questions
            </button>



        </div>
    );
}
