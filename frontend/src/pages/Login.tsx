import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { getOAuthLoginUrl } from '@/lib/api'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      await login(formData.email, formData.password)
      navigate('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to login. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = () => {
    window.location.href = getOAuthLoginUrl('google')
  }


  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 transition-colors duration-500">
      {/* Subtle glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">

          <h1 className="text-3xl font-bold text-foreground tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground text-sm mt-2 font-medium">Achievement starts with one small step.</p>
        </div>

        <Card className="bg-card/40 border-border shadow-2xl backdrop-blur-md rounded-2xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-bold">Sign in</CardTitle>
            <CardDescription className="text-muted-foreground font-medium">Access your micro-win dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-foreground/80 text-sm font-semibold ml-0.5">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="bg-background/50 border-border focus-visible:ring-primary/20 rounded-xl py-6"
                />
              </div>

              {/* Password */}
              <div className="space-y-2.5">
                <Label htmlFor="password" className="text-foreground/80 text-sm font-semibold ml-0.5">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="bg-background/50 border-border focus-visible:ring-primary/20 rounded-xl py-6 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl animate-fade-in">
                  <span className="text-destructive text-sm font-medium">{error}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between text-sm px-1">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded-md border-border bg-background/50 accent-primary cursor-pointer" />
                  <span className="text-muted-foreground group-hover:text-foreground text-xs font-semibold transition-colors">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-primary hover:text-primary/80 text-xs font-bold transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <Button type="submit" disabled={isLoading} className="w-full rounded-xl py-7 text-sm font-bold shadow-lg shadow-primary/10" size="lg">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign in'}
              </Button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/60" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-4 text-muted-foreground/60 font-bold tracking-widest">or</span>
                </div>
              </div>

              {/* Social */}
              <div className="grid grid-cols-1 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleSocialLogin}
                  className="rounded-xl py-6 border-border bg-background/30 hover:bg-muted/30 font-semibold shadow-sm transition-all"
                >
                  <svg className="w-4 h-4 mr-2.5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign in with Google
                </Button>
              </div>

            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground font-medium">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary font-bold hover:underline transition-colors decoration-2 underline-offset-4">Create account</Link>
            </p>
          </CardContent>
        </Card>

        <p className="mt-10 text-center text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest leading-loose">
          Secure, Private & Neuro-Inclusive
        </p>
      </div>
    </div>
  )
}