"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function QuizPage() {
  const [quiz, setQuiz] = useState<any[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.post("http://localhost:8000/api/v1/ai/generate-question", {}, { withCredentials: true });
        setQuiz(res.data.quiz); 
      } catch (err) {
        console.error("Error fetching quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (id: number, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    try {
      // const res = await axios.post("http://localhost:8000/api/v1/save-answers", {
      //   answers,
      // });
      console.log("Answers saved:", answers);
    } catch (err) {
      console.error("Error submitting answers:", err);
    }
  };

  if (loading) return <p>Loading questions...</p>;

  return (
    <div className="p-6 space-y-6">
      {quiz.map((q) => (
        <div key={q.id} className="border p-4 rounded">
          <p className="font-semibold">{q.question}</p>

          {/* Likert */}
          {q.type === "Likert" &&
            q.options.map((opt: any) => (
              <label key={opt.value} className="block">
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value={opt.value}
                  checked={answers[q.id] === opt.value}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                />
                {opt.label}
              </label>
            ))}

          {/* MultipleChoice */}
          {q.type === "MultipleChoice" &&
            q.options.map((opt: any) => (
              <label key={opt.value} className="block">
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={answers[q.id]?.includes(opt.value)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    handleAnswer(
                      q.id,
                      checked
                        ? [...(answers[q.id] || []), opt.value]
                        : answers[q.id].filter((v: string) => v !== opt.value)
                    );
                  }}
                />
                {opt.label}
              </label>
            ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Submit
      </button>
    </div>
  );
}
