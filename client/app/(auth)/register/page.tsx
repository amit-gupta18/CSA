"use client"

import type React from "react"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, Lock, GraduationCap } from "lucide-react"

function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // excess api url form the .env.local
  const baseurl = process.env.NEXT_PUBLIC_API_URL

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    educationlevel: "HIGHER_EDUCATION",
  })

  // handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      educationlevel: value,
    })
  }

  // handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // prevent page reload

    try {
      setLoading(true) // set loading state
      // pass the form data in the body of the request
      console.log("Form data being sent:", formData)
      const res = await axios.post(`${baseurl}/api/v1/auth/register`, formData)
      console.log("res is : ", res)
      setLoading(false)
      const token = res.data.token
      console.log("User registered:", res.data)
      localStorage.setItem("token", token) // store token in local storage
      router.push("/onboarding")
    } catch (error: any) {
      console.error("Registration error:", error.response?.data || error.message)
      alert(error.response?.data?.message || "Something went wrong!")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-foreground">Join Us Today!</CardTitle>
          <CardDescription className="text-muted-foreground">Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="educationlevel" className="text-sm font-medium">
                Education Level
              </Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                <Select value={formData.educationlevel} onValueChange={handleSelectChange}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Select your education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SCHOOL">School</SelectItem>
                    <SelectItem value="HIGHER_EDUCATION">Higher Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterPage
