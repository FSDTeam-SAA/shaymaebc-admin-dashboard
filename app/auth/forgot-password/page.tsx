"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { authAPI } from "@/lib/api"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await authAPI.forgotPassword(email)
      toast.success("OTP sent to your email")
      router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`)
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center text-4xl">🐾</div>
          </div>
          <CardTitle className="text-2xl font-bold">Reset password</CardTitle>
          <CardDescription>Enter your email to receive the OTP</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </Button>
          </form>
          <p className="text-center text-sm mt-4">
            <Link href="/auth/login" className="text-orange-500 hover:text-orange-600 font-semibold">
              Back to Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
