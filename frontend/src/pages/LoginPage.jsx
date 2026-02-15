import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import { User, Lock, Loader, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Reveal from '../components/Reveal';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = React.useState(false);
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      navigate('/');
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onSubmit = (data) => {
    dispatch(login(data));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Image & Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 overflow-hidden">
        {/* Abstract decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-[100px]"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-400 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-12 text-white">
            <div>
                <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm font-medium">
                    <ArrowLeft size={16} /> Back to Home
                </Link>
            </div>
            <div className="space-y-6 max-w-lg">
                <div className="space-y-2">
                    <h3 className="text-blue-300 font-bold tracking-widest uppercase text-sm">Authentication</h3>
                    <h1 className="text-5xl font-black leading-tight">Smart Institute <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Admin Portal</span></h1>
                </div>
                <p className="text-lg text-blue-100/80 font-light leading-relaxed">
                    Access your dashboard to manage courses, students, and institute resources efficiently.
                </p>
            </div>
            <div className="text-xs text-blue-300/60">
                © {new Date().getFullYear()} Smart Institute. Secure Login System.
            </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
         <button onClick={() => navigate('/')} className="lg:hidden absolute top-6 left-6 text-gray-500 hover:text-primary transition-colors flex items-center gap-2 text-sm font-bold">
            <ArrowLeft size={16} /> Home
        </button>

        <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
                <p className="mt-2 text-gray-500">Please access your dashboard using your credentials.</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-5">
                     {/* Username/Email Field */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Username or Email</label>
                        <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className={`w-full pl-10 pr-3 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 placeholder:text-gray-400 font-medium ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                            placeholder="Enter your username"
                            {...register('email', { required: 'Username/Email is required' })}
                        />
                        </div>
                        {errors.email && <span className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</span>}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
                        <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={18} className="text-gray-400" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            className={`w-full pl-10 pr-10 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 placeholder:text-gray-400 font-medium ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                            placeholder="••••••••"
                            {...register('password', { required: 'Password is required' })}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        </div>
                        {errors.password && <span className="text-xs text-red-500 mt-1 font-medium">{errors.password.message}</span>}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input id="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" {...register('rememberMe')} />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500">Remember me</label>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/20 text-sm font-bold text-white bg-primary hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
                >
                    {isLoading ? <Loader className="animate-spin" size={20} /> : 'Sign In to Dashboard'}
                </button>
            </form>
            
             <p className="text-center text-sm text-gray-500">
                Don't have an account? <span className="text-gray-900 font-bold">Contact Admin</span>
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;