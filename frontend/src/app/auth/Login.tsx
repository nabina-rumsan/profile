"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import signInWithOtp, { verifyOtp } from './loginApi'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/profiles')
      }
    })
  }, [router])

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
    const { data, error } = await verifyOtp(email, otp)
    setLoading(false)
    if (error) {
      setMessage('Error verifying OTP: ' + error.message)
    } else {
      setMessage('Logged in successfully! Redirecting...')
      setTimeout(() => {
        router.push('/profiles')
      }, 1000)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 400, width: '100%', padding: 24, border: '1px solid #eee', borderRadius: 8, background: '#fff' }}>
        <h2 style={{ textAlign: 'center' }}>Login with Email OTP</h2>
        {!otpSent ? (
          <div>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="mb-3"
            />
            <Button onClick={handleSendOtp} disabled={loading} className="w-full">
              {loading ? 'Sending...' : 'Send OTP'}
            </Button>
          </div>
        ) : (
          <div>
            <Input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="Enter OTP code"
              required
              className="mb-3"
            />
            <Button onClick={handleVerifyOtp} disabled={loading} className="w-full">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </div>
        )}
        {message && <p style={{ marginTop: 16, textAlign: 'center' }}>{message}</p>}
      </div>
    </div>
  )
}
