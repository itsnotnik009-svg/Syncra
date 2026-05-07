import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { Logo, LogoLight } from '@/components/ui/logo'

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
    <div className="min-h-screen flex font-sans bg-white">
      {/* Left Panel: Glowing Mesh Gradient */}
      <div className="hidden lg:flex w-[45%] bg-[#0B1914] flex-col justify-between p-16 relative overflow-hidden">
        {/* Animated Orbs */}
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#1C3F35] blur-[120px] mix-blend-screen opacity-80 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#FFC436]/20 blur-[100px] mix-blend-screen opacity-60" />
        <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] rounded-full bg-emerald-500/20 blur-[120px] mix-blend-screen opacity-50" />
        
        {/* Subtle grid pattern for depth */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] opacity-40 pointer-events-none" />

        <div className="relative z-10 mt-10">
          <div className="inline-flex h-12 items-center justify-center rounded-2xl bg-white/5 px-4 pr-6 backdrop-blur-xl border border-white/10 mb-8 shadow-2xl">
            <LogoLight />
          </div>
          <p className="text-[32px] font-extrabold text-white leading-[1.15] tracking-tight max-w-md">
            Streamline your team's workflow with intelligent task management.
          </p>
        </div>
        
        <div className="relative z-10 mb-10">
          <div className="inline-flex items-center gap-3 rounded-full bg-black/40 px-5 py-3 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <span className="text-[12px] font-extrabold text-emerald-50 tracking-widest uppercase">Platform Online</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Tactile Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 relative bg-white">
        <div className="absolute top-10 right-10 z-10 hidden sm:block">
          <p className="text-[14px] font-bold text-slate-400">Don't have an account? <Link to="/register" className="text-[#1C3F35] hover:text-[#FFC436] transition-colors ml-1">Sign up</Link></p>
        </div>

        <div className="w-full max-w-[420px]">
          <div className="lg:hidden mb-12 flex justify-between items-center">
            <Logo />
            <Link to="/register" className="text-[14px] font-bold text-[#1C3F35]">Sign up</Link>
          </div>

          <div className="mb-12">
            <h2 className="text-[36px] font-extrabold text-[#1a1a1a] mb-3 tracking-tight leading-tight">Welcome back</h2>
            <p className="text-[15px] text-slate-500 font-medium">Please enter your details to sign in.</p>
          </div>

          {error && <div className="mb-8 rounded-2xl bg-red-50 border border-red-100 p-4 text-[14px] font-bold text-red-600 flex items-center gap-3 shadow-sm"><div className="h-2 w-2 rounded-full bg-red-500" />{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-[14px] font-bold text-[#1a1a1a] mb-2.5 ml-1">Email address</label>
              <input id="email" type="email" autoComplete="email" placeholder="name@company.com" className="h-[56px] w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-5 text-[15px] font-semibold text-[#1a1a1a] placeholder:text-slate-400 placeholder:font-medium outline-none transition-all hover:border-slate-200 focus:bg-white focus:border-[#FFC436] focus:ring-4 focus:ring-[#FFC436]/15 shadow-sm"
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} />
              {errors.email && <p className="mt-2 px-2 text-[13px] font-bold text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-[14px] font-bold text-[#1a1a1a] mb-2.5 ml-1">Password</label>
              <div className="relative">
                <input id="password" type={showPw ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••" className="h-[56px] w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-5 pr-16 text-[15px] font-semibold text-[#1a1a1a] placeholder:text-slate-400 placeholder:font-medium outline-none transition-all hover:border-slate-200 focus:bg-white focus:border-[#FFC436] focus:ring-4 focus:ring-[#FFC436]/15 shadow-sm"
                  {...register('password', { required: 'Password is required' })} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[13px] font-extrabold text-slate-400 hover:text-[#1a1a1a] transition-colors">{showPw ? 'HIDE' : 'SHOW'}</button>
              </div>
              {errors.password && <p className="mt-2 px-2 text-[13px] font-bold text-red-500">{errors.password.message}</p>}
            </div>
            
            <div className="pt-6">
              <button type="submit" disabled={isSubmitting} className="group relative flex h-[56px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#1C3F35] to-[#122A23] text-[15px] font-extrabold text-[#FFC436] shadow-[0_8px_20px_-8px_rgba(28,63,53,0.6)] hover:shadow-[0_12px_24px_-10px_rgba(28,63,53,0.8)] hover:scale-[1.01] disabled:opacity-70 disabled:hover:scale-100 transition-all active:scale-[0.98] overflow-hidden">
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#FFC436]/30 border-t-[#FFC436]" /> : 'Sign in securely'}
                </span>
              </button>
            </div>
          </form>

          <div className="mt-14 sm:hidden text-center">
            <p className="text-[14px] font-bold text-slate-500">Don't have an account? <Link to="/register" className="text-[#1C3F35] hover:text-[#FFC436] transition-colors">Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
