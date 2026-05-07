import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { updateProfileApi, changePasswordApi } from '@/api/auth'
import { toast } from 'sonner'
import { Loader2, Check } from 'lucide-react'
import { UserAvatar } from '@/components/ui/avatar'

export default function SettingsPage() {
  const { user, refreshUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [saving, setSaving] = useState(false)

  const [curPw, setCurPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [changingPw, setChangingPw] = useState(false)

  const saveProfile = async () => {
    if (!name.trim() || name === user?.name) return
    setSaving(true)
    try { await updateProfileApi({ name: name.trim() }); await refreshUser(); toast.success('Profile updated') }
    catch { toast.error('Failed to update profile') }
    finally { setSaving(false) }
  }

  const changePw = async () => {
    if (newPw !== confirmPw) { toast.error('Passwords do not match'); return }
    if (newPw.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setChangingPw(true)
    try { await changePasswordApi({ currentPassword: curPw, newPassword: newPw }); toast.success('Password changed'); setCurPw(''); setNewPw(''); setConfirmPw('') }
    catch (err: unknown) { toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to change password') }
    finally { setChangingPw(false) }
  }

  const inputCls = "h-10 w-full rounded-xl border bg-white px-3.5 text-[13px] text-[#1a1a1a] outline-none focus:border-[#FFC436] focus:ring-1 focus:ring-[#FFC436]"

  return (
    <div>


      <div className="max-w-2xl space-y-5">
        <div className="rounded-2xl border bg-white p-6" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-[15px] font-semibold text-[#1a1a1a] mb-4">Profile</h2>
          <div className="flex items-center gap-4 mb-6">
            <UserAvatar name={user?.name || 'U'} className="h-14 w-14 rounded-full text-xl" />
            <div>
              <p className="text-[15px] font-semibold text-[#1a1a1a]">{user?.name}</p>
              <p className="text-[13px] text-[#9C9590]">{user?.email}</p>
              <span className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${user?.role === 'ADMIN' ? 'bg-[#E8E0F5] text-[#7C6CAF]' : 'bg-[#D5F0E0] text-[#4A8C60]'}`}>{user?.role}</span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[13px] font-medium text-[#6B6560] mb-1.5">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} style={{ borderColor: 'var(--border-color)' }} />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#6B6560] mb-1.5">Email</label>
              <input type="email" value={user?.email || ''} disabled className="h-10 w-full rounded-xl border bg-[#FAF8F5] px-3.5 text-[13px] text-[#1a1a1a] cursor-not-allowed" style={{ borderColor: 'var(--border-color)' }} />
            </div>
          </div>
          <button onClick={saveProfile} disabled={saving || !name.trim() || name === user?.name} className="mt-4 flex items-center gap-2 rounded-lg bg-[#1C3F35] px-5 py-2.5 text-[13px] font-bold text-[#FFC436] hover:bg-[#153029] transition-colors disabled:opacity-40">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Save Changes
          </button>
        </div>

        <div className="rounded-2xl border bg-white p-6" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-[15px] font-semibold text-[#1a1a1a] mb-4">Change Password</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-[13px] font-medium text-[#6B6560] mb-1.5">Current Password</label>
              <input type="password" value={curPw} onChange={(e) => setCurPw(e.target.value)} className={inputCls} style={{ borderColor: 'var(--border-color)' }} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[13px] font-medium text-[#6B6560] mb-1.5">New Password</label>
                <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className={inputCls} style={{ borderColor: 'var(--border-color)' }} />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#6B6560] mb-1.5">Confirm Password</label>
                <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className={inputCls} style={{ borderColor: 'var(--border-color)' }} />
              </div>
            </div>
          </div>
          <button onClick={changePw} disabled={changingPw || !curPw || !newPw || !confirmPw} className="mt-4 flex items-center gap-2 rounded-lg bg-[#1C3F35] px-5 py-2.5 text-[13px] font-bold text-[#FFC436] hover:bg-[#153029] transition-colors disabled:opacity-40">
            {changingPw ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Change Password
          </button>
        </div>

        <div className="rounded-2xl border bg-white p-6" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-[15px] font-semibold text-[#1a1a1a] mb-3">About</h2>
          <p className="text-[14px] font-medium text-[#1a1a1a]">Syncra Task Manager</p>
          <p className="text-[12px] text-[#9C9590] mt-1">v1.0.0</p>
        </div>
      </div>
    </div>
  )
}
