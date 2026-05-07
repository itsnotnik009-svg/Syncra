import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'

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

  const inputCls = "w-full h-12 rounded-xl border border-gray-200 px-4 text-[13px] font-medium text-[#111] placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"

  return (
    <div className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden" style={{ backgroundColor: '#F9F6F0' }}>
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-multiply" style={{ backgroundImage: 'url(/login-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />

      <div className="absolute top-0 left-0 w-full p-6 md:p-10 flex justify-between items-start z-10">
        <h1 className="text-2xl font-extrabold text-[#111] tracking-tight">Syncra</h1>
        <Link to="/login" className="text-[13px] font-bold text-gray-800 hover:text-black">Login</Link>
      </div>

      <div className="relative z-10 w-full max-w-[440px] bg-white rounded-[32px] p-10 mx-4 my-8 shadow-[0_8px_40px_rgb(0,0,0,0.06)] max-h-[90vh] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="text-center mb-8">
          <h2 className="text-[26px] font-bold text-[#111] mb-2 tracking-tight">Create Account</h2>
          <p className="text-[13px] text-gray-500 leading-relaxed max-w-[260px] mx-auto font-medium">Enter your details to get started</p>
        </div>

        {error && <div className="mb-6 rounded-xl bg-red-50 border border-red-100 p-3 text-[12px] text-red-600 text-center font-medium">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input type="text" placeholder="Full Name" className={inputCls} {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 chars' } })} />
            {errors.name && <p className="mt-1.5 px-2 text-[11px] text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <input type="email" placeholder="Email address" className={inputCls} {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} />
            {errors.email && <p className="mt-1.5 px-2 text-[11px] text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} placeholder="Password" className={`${inputCls} pr-16`} {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 chars' } })} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-extrabold text-gray-800 hover:text-black">{showPw ? 'Hide' : 'Show'}</button>
            </div>
            {errors.password && <p className="mt-1.5 px-2 text-[11px] text-red-500">{errors.password.message}</p>}
          </div>
          <div className="pt-2">
            <button type="submit" disabled={isSubmitting} className="flex h-[46px] w-full items-center justify-center rounded-xl text-[14px] font-bold text-[#111] transition-opacity hover:opacity-90 disabled:opacity-70 shadow-sm" style={{ backgroundColor: '#F9C077' }}>
              {isSubmitting ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" /> : 'Sign Up'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[12px] font-medium text-gray-500">Already have an account? <Link to="/login" className="font-extrabold text-[#111] hover:underline">Log in</Link></p>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 w-full text-center z-10 hidden sm:block">
        <p className="text-[11px] font-bold text-gray-600">Copyright @Syncra 2024 &nbsp;|&nbsp; <a href="#" className="hover:text-black">Privacy Policy</a></p>
      </div>
    </div>
  )
}
