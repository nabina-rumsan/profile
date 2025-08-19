'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ProfilesTable from './ProfilesTable'
import ProfilesForm from './ProfilesForm'
import { fetchProfiles, addProfile, updateProfile, deleteProfile } from './profilesApi'
import Login from '../auth/Login'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<{ id: string; username: string; email: string }[]>([])
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [session, setSession] = useState<any>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editUsername, setEditUsername] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (session) {
      fetchProfiles().then(setProfiles)
    }
  }, [session])

  const handleAddProfile = async () => {
    if (!username || !email) return
    const error = await addProfile({ username, email, userId: session.user.id })
    if (!error) {
      fetchProfiles().then(setProfiles)
      setUsername('')
      setEmail('')
    }
  }

  const handleEdit = (profile: any) => {
    console.log('Editing profile:', profile)
    console.log('Profile id:', profile.id)
    setEditingId(profile.id)
    setEditUsername(profile.username)
    setEditEmail(profile.email)
  }

  const handleSaveEdit = async () => {
    if (!editUsername || !editEmail || !editingId) return
    const error = await updateProfile({ user_id: editingId, username: editUsername, email: editEmail })
    const { data: { user } } = await supabase.auth.getUser()
  console.log('Logged-in user id:', user?.id)
    if (!error) {
      fetchProfiles().then(setProfiles)
      setEditingId(null)
      setEditUsername('')
      setEditEmail('')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditUsername('')
    setEditEmail('')
  }

  const handleDelete = async (id: string) => {
    const error = await deleteProfile(id)
    if (!error) {
      setProfiles(profiles.filter(p => p.id !== id))
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  if (!session) {
    return (
      <div className="p-8">
        <Login />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-end mb-4">
        <Button onClick={handleLogout} variant="outline">Logout</Button>
      </div>
      <h1 className="text-2xl font-bold mb-4">Profiles</h1>
      <ProfilesForm username={username} email={email} setUsername={setUsername} setEmail={setEmail} onAdd={handleAddProfile} />
      <ProfilesTable
        profiles={profiles}
        onEdit={handleEdit}
        onDelete={handleDelete}
        editingId={editingId}
        editUsername={editUsername}
        editEmail={editEmail}
        setEditUsername={setEditUsername}
        setEditEmail={setEditEmail}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={handleCancelEdit}
      />
    </div>
  )
}