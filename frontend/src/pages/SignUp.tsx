import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Check, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    condition: '',
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

  const handleConditionChange = (value: string) => {
    setFormData(prev => ({ ...prev, condition: value }))
  }

  const isPasswordValid = Object.values(passwordValidation).every(Boolean)
  const passwordsMatch = formData.password === formData.confirmPassword && formData.password !== ''
  const isFormValid = isPasswordValid && passwordsMatch && formData.name && formData.email && agreedToTerms

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) {
      setError('Please fill all fields and meet password requirements')
      return
    }
    setIsLoading(true)
    try {
      if (isFormValid) {
        setSuccess('Account created successfully! Redirecting to login...')
        setTimeout(() => navigate('/login'), 2000)
      }
    } catch {
      setError('Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
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
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors shadow-sm">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
          </Link>
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
              {/* Name */}
              <div className="space-y-2.5">
                <Label htmlFor="name" className="text-foreground/80 text-sm font-semibold ml-0.5">Full name</Label>
                <Input
                  id="name" name="name" type="text" autoComplete="name" required
                  value={formData.name} onChange={handleChange} placeholder="First Last"
                  className="bg-background/50 border-border focus-visible:ring-primary/20 rounded-xl py-6"
                />
              </div>

              {/* Email */}
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-foreground/80 text-sm font-semibold ml-0.5">Email address</Label>
                <Input
                  id="email" name="email" type="email" autoComplete="email" required
                  value={formData.email} onChange={handleChange} placeholder="name@example.com"
                  className="bg-background/50 border-border focus-visible:ring-primary/20 rounded-xl py-6"
                />
              </div>

              {/* Condition */}
              <div className="space-y-2.5">
                <Label className="text-foreground/80 text-sm font-semibold ml-0.5">Learning support</Label>
                <Select value={formData.condition} onValueChange={handleConditionChange}>
                  <SelectTrigger className="bg-background/50 border-border focus:ring-primary/20 rounded-xl py-6">
                    <SelectValue placeholder="Select if applicable" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border bg-card">
                    <SelectItem value="autism" className="rounded-lg py-2.5 cursor-pointer">Autism support</SelectItem>
                    <SelectItem value="dyslexia" className="rounded-lg py-2.5 cursor-pointer">Dyslexia support</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground/60 font-medium ml-1">Optional — helps us personalize your dashboard</p>
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