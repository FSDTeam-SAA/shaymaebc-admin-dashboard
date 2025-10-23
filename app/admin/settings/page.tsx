"use client"

import type React from "react"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { authAPI } from "@/lib/api"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { useSession } from "next-auth/react"

export default function SettingsPage() {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const { data: session } = useSession()

  const changePasswordMutation = useMutation({
    mutationFn: () => {
      if (!session?.accessToken) throw new Error("No token")
      return authAPI.changePassword(oldPassword, newPassword, session?.accessToken)
    },
    onSuccess: () => {
      toast.success("Password changed successfully")
      setShowPasswordModal(false)
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    },
    onError: () => {
      toast.error("Failed to change password")
    },
  })

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    changePasswordMutation.mutate()
  }

  return (
    <div>
      <Header title="Setting" breadcrumbs={[{ label: "Dashboard" }, { label: "Setting" }]} />

      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => setShowPasswordModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
              Change Password
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter your current and new password</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="old-password">Current Password</Label>
              <Input
                id="old-password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordModal(false)}
                disabled={changePasswordMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={changePasswordMutation.isPending}
              >
                {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
