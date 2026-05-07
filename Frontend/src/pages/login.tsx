import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string; password: string }>()

  const onSubmit = async (data: { email: string; password: string }) => {
    try { setError(''); await login(data); navigate('/dashboard') }
    catch (err: unknown) { setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed. Please try again.') }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden" style={{ backgroundColor: '#F9F6F0' }}>
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-multiply" style={{ backgroundImage: 'url(/login-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />

      <div className="absolute top-0 left-0 w-full p-6 md:p-10 flex justify-between items-start z-10">
        <h1 className="text-2xl font-extrabold text-[#111] tracking-tight">Syncra</h1>
        <Link to="/register" className="text-[13px] font-bold text-gray-800 hover:text-black">Sign up</Link>
      </div>

      <div className="relative z-10 w-full max-w-[440px] bg-white rounded-[32px] p-10 mx-4 shadow-[0_8px_40px_rgb(0,0,0,0.06)]">
        <div className="text-center mb-8">
          <h2 className="text-[26px] font-bold text-[#111] mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-[13px] text-gray-500 leading-relaxed max-w-[260px] mx-auto font-medium">Enter your credentials to access your account</p>
        </div>

        {error && <div className="mb-6 rounded-xl bg-red-50 border border-red-100 p-3 text-[12px] text-red-600 text-center font-medium">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input id="email" type="email" autoComplete="email" placeholder="Email address" className="w-full h-12 rounded-xl border border-gray-200 px-4 text-[13px] font-medium text-[#111] placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} />
            {errors.email && <p className="mt-1.5 px-2 text-[11px] text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <div className="relative">
              <input id="password" type={showPw ? 'text' : 'password'} autoComplete="current-password" placeholder="Password" className="w-full h-12 rounded-xl border border-gray-200 px-4 pr-16 text-[13px] font-medium text-[#111] placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
                {...register('password', { required: 'Password is required' })} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-extrabold text-gray-800 hover:text-black">{showPw ? 'Hide' : 'Show'}</button>
            </div>
            {errors.password && <p className="mt-1.5 px-2 text-[11px] text-red-500">{errors.password.message}</p>}
          </div>
          <div className="pt-2">
            <button type="submit" disabled={isSubmitting} className="flex h-[46px] w-full items-center justify-center rounded-xl text-[14px] font-bold text-[#111] transition-opacity hover:opacity-90 disabled:opacity-70 shadow-sm" style={{ backgroundColor: '#F9C077' }}>
              {isSubmitting ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" /> : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[12px] font-medium text-gray-500">Don't have an account? <Link to="/register" className="font-extrabold text-[#111] hover:underline">Sign up</Link></p>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 w-full text-center z-10">
        <p className="text-[11px] font-bold text-gray-600">Copyright @Syncra 2024 &nbsp;|&nbsp; <a href="#" className="hover:text-black">Privacy Policy</a></p>
      </div>
    </div>
  )
}
