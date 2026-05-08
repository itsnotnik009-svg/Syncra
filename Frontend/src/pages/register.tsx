import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { Logo } from '@/components/ui/logo'

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ name: string; email: string; password: string }>()

  const onSubmit = async (data: { name: string; email: string; password: string }) => {
    try { setError(''); await registerUser({ ...data, role: 'MEMBER' }); navigate('/dashboard') }
    catch (err: unknown) { setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed.') }
  }

  return (
    <div className="min-h-screen flex items-center justify-center font-sans bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Create account</h2>
          <p className="text-sm text-slate-500">Let's get your workspace set up</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-100 p-4 text-sm font-medium text-red-600 flex items-center gap-3">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. Jane Doe" 
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1C3F35] focus:outline-none focus:ring-1 focus:ring-[#1C3F35] transition-colors"
              {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 chars' } })} 
            />
            {errors.name && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Work Email</label>
            <input 
              type="email" 
              placeholder="jane@company.com" 
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1C3F35] focus:outline-none focus:ring-1 focus:ring-[#1C3F35] transition-colors"
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} 
            />
            {errors.email && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <input 
                type={showPw ? 'text' : 'password'} 
                placeholder="••••••••" 
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1C3F35] focus:outline-none focus:ring-1 focus:ring-[#1C3F35] transition-colors"
                {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 chars' } })} 
              />
              <button 
                type="button" 
                onClick={() => setShowPw(!showPw)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-slate-600"
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.password.message}</p>}
          </div>
          
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full flex justify-center items-center rounded-lg bg-[#1C3F35] py-2.5 text-sm font-semibold text-white hover:bg-[#153029] disabled:opacity-70 transition-colors"
            >
              {isSubmitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                'Create account'
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[#1C3F35] hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
