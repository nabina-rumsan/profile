import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Pencil, Trash } from 'lucide-react'

export default function ProfilesTable({ profiles, onEdit, onDelete, editingId, editUsername, editEmail, setEditUsername, setEditEmail, onSaveEdit, onCancelEdit }: any) {
  return (
    <Table className="min-w-full border border-gray-300 rounded-md">
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {profiles.map((profile: any) => (
          <TableRow key={profile.id}>
            <TableCell>
              {editingId === profile.id ? (
                <input
                  value={editUsername}
                  onChange={e => setEditUsername(e.target.value)}
                  style={{ width: '200px', padding: '8px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px', background: '#fff' }}
                  placeholder="Edit username"
                  autoFocus
                />
              ) : (
                profile.username
              )}
            </TableCell>
            <TableCell>
              {editingId === profile.id ? (
                <input
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  style={{ width: '250px', padding: '8px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px', background: '#fff' }}
                  placeholder="Edit email"
                />
              ) : (
                profile.email
              )}
            </TableCell>
            <TableCell className="flex gap-2">
              {editingId === profile.id ? (
                <>
                  <Button onClick={onSaveEdit}>Save</Button>
                  <Button onClick={onCancelEdit} variant="outline">Cancel</Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(profile)}>
                    <Pencil size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(profile.id)}>
                    <Trash size={16} />
                  </Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
