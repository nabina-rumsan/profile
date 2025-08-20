"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithOtp, verifyOtp } from './actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')

  const handleSendOtp = async () => {
    setLoading(true)
    setMessage('')
    const { error } = await signInWithOtp(email)
    setLoading(false)
    if (error) {
      setMessage('Error sending OTP: ' + error.message)
    } else {
      setMessage('OTP sent! Check your email.')
      setOtpSent(true)
    }
  }

  const handleVerifyOtp = async () => {
    setLoading(true)
    setMessage('')
    const { error } = await verifyOtp(email, otp)
    setLoading(false)
    if (error) {
      setMessage('Error verifying OTP: ' + error.message)
    } else {
      setMessage('OTP verified! Redirecting...')
      router.push('/profiles')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md min-w-[350px]">
        <h2 className="text-center mb-4 text-lg font-semibold">Login with Email OTP</h2>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading || otpSent}
          className="mb-4"
        />
        {!otpSent ? (
          <Button onClick={handleSendOtp} disabled={loading || !email} className="w-full">
            Send OTP
          </Button>
        ) : (
          <>
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              disabled={loading}
              className="mb-4 mt-4"
            />
            <Button onClick={handleVerifyOtp} disabled={loading || !otp} className="w-full">
              Verify OTP
            </Button>
          </>
        )}
        {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  )
}
