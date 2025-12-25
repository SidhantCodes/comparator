import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Layers, Mail, Lock, Loader2, ArrowRight, User, Phone } from 'lucide-react'; // Added User and Phone
import { endpoints } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

export function AuthPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // 1. Updated state to include name and phone
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '',
    name: '',
    phone: '' 
  });

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const res = await endpoints.auth.login({ 
          email: formData.email, 
          password: formData.password 
        });
        await login(res.data.access_token);
        toast.success('Welcome back!');
        navigate('/');
      } else {
        // 2. Console log the extra fields for now
        console.log('Registering user with:', {
          name: formData.name,
          phone: formData.phone,
          email: formData.email
        });

        // Sending existing data to backend (update this later to include name/phone)
        await endpoints.auth.signup({
          email: formData.email,
          password: formData.password,
        });
        
        toast.success('Account created! Please sign in.');
        setIsLogin(true);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white px-4 py-8">
      <Card className="w-full max-w-md rounded-2xl border-emerald-100 shadow-xl">
        <CardHeader className="text-center space-y-2 px-6 pt-8">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
            <Layers className="h-7 w-7" />
          </div>

          <CardTitle className="text-2xl sm:text-3xl font-bold">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </CardTitle>

          <CardDescription className="text-sm sm:text-base">
            {isLogin
              ? 'Sign in to continue to PriceCompare'
              : 'Join PriceCompare and start saving'}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* 3. Conditional Name Field */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-12 h-11 focus-visible:ring-emerald-500"
                    required={!isLogin}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* 4. Conditional Phone Field */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="pl-12 h-11 focus-visible:ring-emerald-500"
                    required={!isLogin}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-12 h-11 focus-visible:ring-emerald-500"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-12 h-11 focus-visible:ring-emerald-500"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full mt-6 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign in' : 'Create account'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center text-sm">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-emerald-600 hover:underline underline-offset-4"
            >
              {isLogin
                ? 'New here? Create an account'
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}