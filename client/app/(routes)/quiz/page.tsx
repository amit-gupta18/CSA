"use client"
import { useState } from "react"
import axios from "axios"
import { analyzePersonality } from "@/utils/ai.utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface QuizOption {
  label: string
  value: string
}

interface QuizQuestion {
  id: number
  question: string
  type: "Likert" | "MultipleChoice"
  options: QuizOption[]
}

interface PersonalityAnalysis {
  personalitySummary: string
  strengths: string[]
  weaknesses: string[]
  behavioralTendencies: string[]
}

export default function QuizPage() {
  const [quiz, setQuiz] = useState<QuizQuestion[]>([])
  const [answers, setAnswers] = useState<{ [key: string]: string | string[] }>({})
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<PersonalityAnalysis | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const res = await axios.post("http://localhost:8000/api/v1/ai/generate-question", {}, { withCredentials: true })
      setQuiz(res.data.quiz)
      setCurrentQuestion(0)
    } catch (err) {
      console.error("Error fetching quiz:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (id: number, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async () => {
    setAnalyzing(true)
    try {
      console.log("Answers saved:", answers)
      const result = await analyzePersonality(quiz, answers)
      setAnalysis(result)
    } catch (err) {
      console.error("Error submitting answers:", err)
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-lg">Loading questions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      {!analysis ? (<div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-balance">Personality Quiz</h1>
        <p className="text-muted-foreground mt-2">Answer the questions one by one to discover your personality insights</p>
      </div>) : null}

      {quiz.length === 0 && !analysis && (
        <Button onClick={fetchQuestions}>Generate Quiz</Button>
      )}

      {quiz.length > 0 && !analysis && (
        <Card key={quiz[currentQuestion].id} className="w-full">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-balance">
              Q{currentQuestion + 1}: {quiz[currentQuestion].question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quiz[currentQuestion].type === "Likert" && (
              <RadioGroup
                value={(answers[quiz[currentQuestion].id] as string) || ""}
                onValueChange={(value) => handleAnswer(quiz[currentQuestion].id, value)}
                className="space-y-3"
              >
                {quiz[currentQuestion].options.map((opt) => (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt.value} id={`${quiz[currentQuestion].id}-${opt.value}`} />
                    <Label htmlFor={`${quiz[currentQuestion].id}-${opt.value}`}>{opt.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {quiz[currentQuestion].type === "MultipleChoice" && (
              <div className="space-y-3">
                {quiz[currentQuestion].options.map((opt) => (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${quiz[currentQuestion].id}-${opt.value}`}
                      checked={
                        Array.isArray(answers[quiz[currentQuestion].id]) &&
                        (answers[quiz[currentQuestion].id] as string[]).includes(opt.value)
                      }
                      onCheckedChange={(checked) => {
                        const currentAnswers = (answers[quiz[currentQuestion].id] as string[]) || []
                        handleAnswer(
                          quiz[currentQuestion].id,
                          checked
                            ? [...currentAnswers, opt.value]
                            : currentAnswers.filter((v: string) => v !== opt.value),
                        )
                      }}
                    />
                    <Label htmlFor={`${quiz[currentQuestion].id}-${opt.value}`}>{opt.label}</Label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation buttons */}
      {quiz.length > 0 && !analysis && (
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion((prev) => prev - 1)}
          >
            Previous
          </Button>

          {currentQuestion < quiz.length - 1 ? (
            <Button
              onClick={() => setCurrentQuestion((prev) => prev + 1)}
              disabled={!answers[quiz[currentQuestion].id]}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={analyzing || Object.keys(answers).length < quiz.length}
              size="lg"
              className="min-w-32"
            >
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Submit Quiz"
              )}
            </Button>
          )}
        </div>
      )}

      {/* Results */}
      {analysis && (
        <div className="mt-12 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-balance">Your Personality Analysis</h2>
            <p className="text-muted-foreground mt-2">Based on your responses, here's what we discovered about you</p>
          </div>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">📋 Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-balance leading-relaxed">{analysis.personalitySummary}</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">💪 Strengths</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.strengths.map((strength, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                    <span className="text-balance">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                🎯 Areas for Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.weaknesses.map((weakness, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-orange-600 dark:text-orange-400 mt-1">•</span>
                    <span className="text-balance">{weakness}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                🧠 Behavioral Tendencies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.behavioralTendencies.map((tendency, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                    <span className="text-balance">{tendency}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
