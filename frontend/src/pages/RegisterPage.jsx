import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import { User, Lock, Shield, Loader, Eye, EyeOff, AtSign, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import Reveal from '../components/Reveal';

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = React.useState(false);
  const [checkingUsername, setCheckingUsername] = React.useState(false);
  const [usernameAvailable, setUsernameAvailable] = React.useState(null);
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const watchUsername = watch('username');

  // Check username availability with debounce
  useEffect(() => {
    if (!watchUsername || watchUsername.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const checkUsername = setTimeout(async () => {
      setCheckingUsername(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/check-username/${watchUsername}`, {
          credentials: 'include'
        });
        const data = await response.json();
        setUsernameAvailable(data.available);
      } catch (error) {
        console.error('Error checking username:', error);
        setUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(checkUsername);
  }, [watchUsername]);

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
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Image & Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-green-900 overflow-hidden">
        <div className="absolute inset-0 bg-green-900/40 z-10"></div>
        <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80" 
            alt="University Library" 
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-12 text-white">
            <div>
                 <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium">
                    <ArrowLeft size={16} /> Back to Home
                </Link>
            </div>
            <div className="space-y-4 max-w-lg">
                <h1 className="text-4xl font-black leading-tight">Admin Portal <br/> Initialization</h1>
                <p className="text-lg text-green-100 font-light text-justify">
                    "Setting up the foundation for a smarter educational management system."
                </p>
            </div>
            <div className="text-xs text-white/40">
                © {new Date().getFullYear()} Smart Institute. All rights reserved.
            </div>
        </div>
      </div>

       {/* Right Side - Form */}
       <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative overflow-y-auto">
         <button onClick={() => navigate('/')} className="lg:hidden absolute top-6 left-6 text-gray-500 hover:text-green-600 transition-colors flex items-center gap-2 text-sm font-bold">
            <ArrowLeft size={16} /> Home
        </button>

        <div className="w-full max-w-md space-y-8 my-auto">
             <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-900">Create Admin</h2>
                <p className="mt-2 text-gray-500">Register a new administrative account.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Name Field */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    className={`w-full pl-10 pr-3 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="Enter full name"
                    {...register('name', { required: 'Name is required' })}
                />
                </div>
            </div>

            {/* Username Field */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Username</label>
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AtSign size={18} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    className={`w-full pl-10 pr-10 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium ${
                    errors.username ? 'border-red-500' : 
                    usernameAvailable === false ? 'border-red-500' : 
                    usernameAvailable === true ? 'border-green-500' : 'border-gray-200'
                    }`}
                    placeholder="Choose a username"
                    {...register('username', { 
                    required: 'Username is required',
                    minLength: { value: 3, message: 'Minimum 3 characters required' },
                    validate: {
                        hasLetterAndNumber: (value) => {
                            const hasLetter = /[a-zA-Z]/.test(value);
                            const hasNumber = /[0-9]/.test(value);
                            if (!hasLetter || !hasNumber) {
                                return 'Username must contain both letters and numbers';
                            }
                            return true;
                        },
                        availability: () => {
                            if (checkingUsername) {
                                return 'Please wait while we check username availability';
                            }
                            if (usernameAvailable === false) {
                                return 'Username already taken';
                            }
                            return true;
                        }
                    }
                    })}                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {checkingUsername && <Loader size={18} className="text-gray-400 animate-spin" />}
                    {!checkingUsername && usernameAvailable === true && <CheckCircle size={18} className="text-green-500" />}
                    {!checkingUsername && usernameAvailable === false && <XCircle size={18} className="text-red-500" />}
                </div>
                </div>
                {errors.username && <span className="text-xs text-red-500 mt-1 font-medium">{errors.username.message}</span>}
                {!errors.username && usernameAvailable === false && <span className="text-xs text-red-500 mt-1 font-medium">Username already taken</span>}
                {!errors.username && usernameAvailable === true && <span className="text-xs text-green-500 mt-1 font-medium">Username available!</span>}
            </div>

            {/* Role Selection */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Role</label>
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield size={18} className="text-gray-400" />
                </div>
                <select
                    className="w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-medium appearance-none cursor-pointer"
                    {...register('role', { required: true })}
                >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Branch Admin">Branch Admin</option>
                    <option value="Employee">Employee</option>
                    <option value="Teacher">Teacher</option>
                </select>
                </div>
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
                    className={`w-full pl-10 pr-10 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="••••••••"
                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
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

            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-green-500/20 text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
            >
                {isLoading ? <Loader className="animate-spin" size={20} /> : 'Create Account'}
            </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
                <Link to="/login" className="text-green-600 hover:underline font-bold">Already have an account? Login</Link>
            </div>
        </div>
       </div>
    </div>
  );
};

export default RegisterPage;