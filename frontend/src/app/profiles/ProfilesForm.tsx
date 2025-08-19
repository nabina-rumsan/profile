import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ProfilesForm({ username, email, setUsername, setEmail, onAdd }: any) {
  return (
    <div className="flex gap-2 mb-4">
      <Input
        placeholder="Enter username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <Input
        placeholder="Enter email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        type="email"
      />
      <Button onClick={onAdd}>Add Profile</Button>
    </div>
  )
}
