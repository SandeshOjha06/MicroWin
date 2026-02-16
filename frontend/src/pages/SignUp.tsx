import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Check, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { getOAuthLoginUrl } from '@/lib/api'

interface ValidationChecks {
  minLength: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasNumber: boolean
  hasSpecial: boolean
}

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })


  const [passwordValidation, setPasswordValidation] = useState<ValidationChecks>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()
  const { signup } = useAuth()

  const validatePassword = (password: string) => {
    setPasswordValidation({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*]/.test(password),
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (name === 'password') validatePassword(value)
    setError('')
  }

  const isPasswordValid = Object.values(passwordValidation).every(Boolean)
  const passwordsMatch = formData.password === formData.confirmPassword && formData.password !== ''
  const isFormValid = isPasswordValid && passwordsMatch && formData.email && agreedToTerms

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) {
      setError('Please fill all fields and meet password requirements')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      // Pass undefined for fullName so it isn't set, triggering the modal later
      await signup(formData.email, formData.password)
      setSuccess('Account created successfully! Redirecting...')
      setTimeout(() => navigate('/dashboard'), 1000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create account. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = () => {
    window.location.href = getOAuthLoginUrl('google')
  }


  const ValidationItem = ({ label, isValid }: { label: string; isValid: boolean }) => (
    <div className="flex items-center gap-2.5">
      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${isValid ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground/40'}`}>
        {isValid ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
      </div>
      <span className={`text-[11px] font-semibold ${isValid ? 'text-foreground/80' : 'text-muted-foreground/50'}`}>{label}</span>
    </div>
  )


  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 transition-colors duration-500">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">

          <h1 className="text-3xl font-bold text-foreground tracking-tight">Create account</h1>
          <p className="text-muted-foreground text-sm mt-2 font-medium">Join us and start your journey today</p>
        </div>

        <Card className="bg-card/40 border-border shadow-2xl backdrop-blur-md rounded-2xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-bold">Sign up</CardTitle>
            <CardDescription className="text-muted-foreground font-medium">Fill in your details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-foreground/80 text-sm font-semibold ml-0.5">Email address</Label>
                <Input
                  id="email" name="email" type="email" autoComplete="email" required
                  value={formData.email} onChange={handleChange} placeholder="name@example.com"
                  className="bg-background/50 border-border focus-visible:ring-primary/20 rounded-xl py-6"
                />
              </div>

              {/* Password */}
              <div className="space-y-2.5">
                <Label htmlFor="password" className="text-foreground/80 text-sm font-semibold ml-0.5">Password</Label>
                <div className="relative">
                  <Input
                    id="password" name="password" type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password" required value={formData.password}
                    onChange={handleChange} placeholder="••••••••"
                    className="bg-background/50 border-border focus-visible:ring-primary/20 rounded-xl py-6 pr-12"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-4 p-4 bg-muted/20 rounded-xl border border-border/60 space-y-2.5">
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1">Passcode Checks</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                      <ValidationItem label="8+ chars" isValid={passwordValidation.minLength} />
                      <ValidationItem label="Uppercase" isValid={passwordValidation.hasUppercase} />
                      <ValidationItem label="Lowercase" isValid={passwordValidation.hasLowercase} />
                      <ValidationItem label="Number" isValid={passwordValidation.hasNumber} />
                      <ValidationItem label="Special char" isValid={passwordValidation.hasSpecial} />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm */}
              <div className="space-y-2.5">
                <Label htmlFor="confirmPassword" className="text-foreground/80 text-sm font-semibold ml-0.5">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword" name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password" required value={formData.confirmPassword}
                    onChange={handleChange} placeholder="••••••••"
                    className={`bg-background/50 border-border focus-visible:ring-primary/20 rounded-xl py-6 pr-12 transition-all ${formData.confirmPassword
                      ? passwordsMatch ? 'border-primary/40 bg-primary/5' : 'border-destructive/40 bg-destructive/5'
                      : ''
                      }`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.confirmPassword && !passwordsMatch && (
                  <p className="text-[11px] text-destructive font-bold flex items-center gap-1.5 ml-1 animate-fade-in"><X className="w-3 h-3" /> Passwords do not match</p>
                )}
                {passwordsMatch && formData.confirmPassword && (
                  <p className="text-[11px] text-primary font-bold flex items-center gap-1.5 ml-1 animate-fade-in"><Check className="w-3 h-3" /> Passwords match</p>
                )}
              </div>

              {/* Error / Success */}
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl animate-fade-in">
                  <span className="text-destructive text-sm font-medium">{error}</span>
                </div>
              )}
              {success && (
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl animate-fade-in">
                  <span className="text-primary text-sm font-medium">{success}</span>
                </div>
              )}

              {/* Terms */}
              <label className="flex items-start gap-3.5 cursor-pointer group px-1">
                <input type="checkbox" checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded-md border-border bg-background/50 accent-primary cursor-pointer" />
                <span className="text-xs text-muted-foreground group-hover:text-foreground/80 font-medium transition-colors leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-primary hover:underline font-bold transition-colors">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="text-primary hover:underline font-bold transition-colors">Privacy Policy</a>
                </span>
              </label>

              {/* Submit */}
              <Button type="submit" disabled={!isFormValid || isLoading}
                className="w-full rounded-xl py-7 text-sm font-bold shadow-lg shadow-primary/10 mt-2" size="lg">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </span>
                ) : 'Create account'}
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
                  Sign up with Google
                </Button>
              </div>

            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline transition-colors decoration-2 underline-offset-4">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}