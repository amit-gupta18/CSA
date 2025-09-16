"use client"

import type React from "react"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { GraduationCap, User, BookOpen, Calendar, Award } from "lucide-react"

export default function OnboardingPage() {
  const [formData, setFormData] = useState({
    name: "",
    educationlevel: "",
    branch: "",
    year: "",
    cgpa: "",
  })

  const router = useRouter()
  const baseurl = process.env.NEXT_PUBLIC_API_URL

  const calculateProgress = () => {
    const totalFields = formData.educationlevel === "HIGHER_EDUCATION" ? 5 : 2
    let filledFields = 0

    if (formData.name) filledFields++
    if (formData.educationlevel) filledFields++
    if (formData.educationlevel === "HIGHER_EDUCATION") {
      if (formData.branch) filledFields++
      if (formData.year) filledFields++
      if (formData.cgpa) filledFields++
    }

    return (filledFields / totalFields) * 100
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      console.log("data passing in to the backend : ", formData)
      const res = await axios.post(`${baseurl}/api/v1/auth/onboard`, formData, {
        withCredentials: true,
      })
      console.log("Onboarding success:", res.data)
      alert("Onboarding completed!")
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Error submitting onboarding:", err.response?.data || err)
      alert("Failed to submit onboarding")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Progress</span>
            <span className="text-sm font-medium text-muted-foreground">{Math.round(calculateProgress())}%</span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-balance">Welcome to Your Educational Journey!</CardTitle>
              <CardDescription className="text-lg text-muted-foreground max-w-md mx-auto text-pretty">
                Help us personalize your experience by sharing a few details about your academic background
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="h-12 text-base border-2 focus:border-primary transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="educationlevel" className="text-sm font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Education Level
                </Label>
                <Select
                  value={formData.educationlevel}
                  onValueChange={(value) => handleSelectChange("educationlevel", value)}
                  required
                >
                  <SelectTrigger className="h-12 text-base border-2 focus:border-primary">
                    <SelectValue placeholder="Select your education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SCHOOL">School</SelectItem>
                    <SelectItem value="HIGHER_EDUCATION">Higher Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.educationlevel === "HIGHER_EDUCATION" && (
                <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="branch" className="text-sm font-semibold flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        Branch/Field of Study
                      </Label>
                      <Input
                        id="branch"
                        type="text"
                        name="branch"
                        placeholder="e.g., Computer Science"
                        value={formData.branch}
                        onChange={handleChange}
                        className="h-12 text-base border-2 focus:border-primary transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year" className="text-sm font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Current Year
                      </Label>
                      <Select
                        value={formData.year}
                        onValueChange={(value) => handleSelectChange("year", value)}
                        required
                      >
                        <SelectTrigger className="h-12 text-base border-2 focus:border-primary">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                          <SelectItem value="5">5th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cgpa" className="text-sm font-semibold flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      Current CGPA/GPA
                    </Label>
                    <Input
                      id="cgpa"
                      type="number"
                      step="0.01"
                      name="cgpa"
                      placeholder="Enter your current CGPA (e.g., 8.5)"
                      value={formData.cgpa}
                      onChange={handleChange}
                      className="h-12 text-base border-2 focus:border-primary transition-colors"
                      required
                      min={0}
                      max={10}
                    />
                  </div>
                </div>
              )}

              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Complete Onboarding
                </Button>
              </div>
            </form>

            <div className="pt-4 text-center text-sm text-muted-foreground border-t">
              <p>
                By continuing, you agree to our{" "}
                <a href="#" className="text-primary hover:underline font-medium">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline font-medium">
                  Privacy Policy
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
