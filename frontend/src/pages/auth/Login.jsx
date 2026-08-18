import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, Tooth } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import './Login.css';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    try {
      await login(data);
      navigate('/dashboard');
    } catch (error) {
      setServerError(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login__card">
        <div className="login__header">
          <div className="login__logo">
            <Tooth size={32} color="var(--color-primary)" />
          </div>
          <h1 className="login__title">Welcome Back</h1>
          <p className="login__subtitle">Sign in to your DentalCare Pro account</p>
        </div>

        {serverError && (
          <div className="login__error-banner">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="login__form">
          <Input
            label="Email Address"
            type="email"
            placeholder="doctor@clinic.com"
            icon={Mail}
            error={errors.email?.message}
            {...register('email')}
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="login__actions">
            <label className="login__remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="login__forgot">
              Forgot password?
            </Link>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            isLoading={isLoading}
            className="login__submit"
          >
            Sign In
          </Button>
        </form>

        <div className="login__footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="login__link">
              Register as Staff
            </Link>
          </p>
          <Link to="/" className="login__back">
            ← Back to Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;