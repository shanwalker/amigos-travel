import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { User, Mail, Phone, Lock, Eye, EyeOff, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface ProfileCreationStepProps {
  title: string;
  description?: string;
  data: ProfileData;
  onChange: (data: Partial<ProfileData>) => void;
  errors?: Partial<Record<keyof ProfileData, string>>;
}

export const ProfileCreationStep = ({
  title,
  description,
  data,
  onChange,
  errors = {},
}: ProfileCreationStepProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRequirements = [
    { label: 'At least 8 characters', met: data.password.length >= 8 },
    { label: 'Contains a number', met: /\d/.test(data.password) },
    { label: 'Contains uppercase', met: /[A-Z]/.test(data.password) },
    { label: 'Passwords match', met: data.password === data.confirmPassword && data.confirmPassword.length > 0 },
  ];

  const getPasswordStrength = () => {
    const metCount = passwordRequirements.filter(r => r.met).length;
    if (metCount <= 1) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
    if (metCount === 2) return { label: 'Fair', color: 'bg-orange-500', width: '50%' };
    if (metCount === 3) return { label: 'Good', color: 'bg-yellow-500', width: '75%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const strength = getPasswordStrength();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">{title}</h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>

      <Card className="bg-card/50 border-border/50 p-6 space-y-5">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-foreground">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="firstName"
                placeholder="John"
                value={data.firstName}
                onChange={(e) => onChange({ firstName: e.target.value })}
                className={cn(
                  "pl-10 bg-background/50 border-border",
                  errors.firstName && "border-destructive"
                )}
              />
            </div>
            {errors.firstName && (
              <p className="text-xs text-destructive">{errors.firstName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              value={data.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              className={cn(
                "bg-background/50 border-border",
                errors.lastName && "border-destructive"
              )}
            />
            {errors.lastName && (
              <p className="text-xs text-destructive">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className={cn(
                "pl-10 bg-background/50 border-border",
                errors.email && "border-destructive"
              )}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className={cn(
                "pl-10 bg-background/50 border-border",
                errors.phone && "border-destructive"
              )}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              value={data.password}
              onChange={(e) => onChange({ password: e.target.value })}
              className={cn(
                "pl-10 pr-10 bg-background/50 border-border",
                errors.password && "border-destructive"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          {/* Password Strength */}
          {data.password && (
            <div className="space-y-2">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all duration-300", strength.color)}
                  style={{ width: strength.width }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Password strength: <span className={cn(
                  strength.label === 'Weak' && 'text-red-500',
                  strength.label === 'Fair' && 'text-orange-500',
                  strength.label === 'Good' && 'text-yellow-500',
                  strength.label === 'Strong' && 'text-green-500',
                )}>{strength.label}</span>
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={data.confirmPassword}
              onChange={(e) => onChange({ confirmPassword: e.target.value })}
              className={cn(
                "pl-10 pr-10 bg-background/50 border-border",
                errors.confirmPassword && "border-destructive"
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        {data.password && (
          <div className="grid grid-cols-2 gap-2 pt-2">
            {passwordRequirements.map((req, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                {req.met ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span className={req.met ? 'text-green-500' : 'text-muted-foreground'}>
                  {req.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
};
