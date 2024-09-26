'use client';
import { useState } from 'react';
import { useDispatch } from 'react-redux'; 
import { setCredentials } from '../store/slices/authSlice'; 
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const dispatch = useDispatch();
    const router = useRouter(); 

    // Email validation
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address');
            return false;
        }
        setEmailError('');
        return true;
    };

    // Password validation
    const validatePassword = (password) => {
        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return false;
        }
        setPasswordError('');
        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (isEmailValid && isPasswordValid) {
            try {
                const response = await fetch('https://devapi.propsoft.ai/api/interview/login', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email, password }),
                });
        
                const data = await response.json();
        
                if (response.ok && data.status_code === "1") {
                
                  setSuccessMessage('Login Successful!');

                  // Dispatch the email and token to Redux
                  dispatch(setCredentials({ email: data.user_data.email, token: data.access_token }));
                  
                  document.cookie = `token=${data.access_token}; path=/; secure;`;
                  // Redirect to the dashboard
                  router.push('/dashboard');

                  console.log('Login successful. Access token:', data.access_token);
                  console.log('User data:', data.user_data);
                } else {
                  setSuccessMessage('Login failed. Please check email and pass.');
                  console.error('Error:', data.status_message);
                }
            } catch (error) {
                console.error('Error during login:', error);
                setSuccessMessage('An error occurred. Please try again.');
            }
        } else {
            setSuccessMessage('');
        }
    };
    
    return (
        <div className="flex flex-col lg:flex-row">
            <div className="relative w-full lg:w-5/12 bg-gradient-to-r from-blue-600 to-blue-700" style={{ height: '100vh' }}>
                <Image
                    src="/assets/shape.png"
                    alt="round object"
                    width={60}
                    height={60}
                    className="absolute w-1/4"
                />

                <Image
                    src="/assets/shape2.png"
                    alt="My Shape"
                    className="absolute bottom-0 right-0 w-1/2"
                    width={120}
                    height={120}
                />

                {/* Text content on the left side */}
                <div className="absolute mr-4 md:mr-16 mt-8 pt-6 md:ml-6 lg:ml-16 pl-8 lg:pl-14 flex flex-col justify-between" style={{ height: '80%' }}>
                    <div>
                        <h3 className="text-white font-extrabold text-3xl md:text-4xl lg:text-5xl font-poppins mb-6">
                            Welcome to <br /> our community
                        </h3>
                        <span className="text-white text-sm md:text-base lg:text-lg font-normal font-poppins" style={{ color: '#CBD5E1' }}>
                            Clarity gives you the blocks & components you need to create a truly professional website.
                        </span>
                    </div>

                    <div>
                        <Image
                            src="/assets/Review.png"
                            alt="review"
                            width={60}
                            height={60}
                            className="w-1/4 mb-4"
                        />

                        <span className="font-normal font-poppins text-sm md:text-base lg:text-xl text-white">
                            "We love Landingfolio! Our designers were using it for their projects, so we already knew what kind of design they want."
                        </span>

                        <div className="mt-4 flex flex-row gap-3">
                            <Image
                                src="/assets/round-image.png"
                                alt="review"
                                width={50}
                                height={50}
                                className="rounded-full"
                            />

                            <div className="flex flex-col">
                                <span className="text-white font-semibold text-sm md:text-base">
                                    Devon Lane
                                </span>
                                <span className="text-white font-semibold text-sm md:text-base" style={{ color: '#CBD5E1' }}>
                                    Co-Founder, Design.co
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-7/12 flex items-center justify-center p-4 lg:p-16">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="mb-16">
                        <h3 className="font-poppins font-semibold text-2xl lg:text-5xl mb-4">
                            Welcome back!
                        </h3>
                        <span className="font-poppins font-normal text-sm md:text-base lg:text-lg" style={{ color: '#52525B' }}>
                            Clarity gives you the blocks and components you need to create a truly professional website.
                        </span>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-md">
                            {successMessage}
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-3" onSubmit={handleSubmit}>
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full px-3 py-2 mt-1 border rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-2 ${
                                    emailError ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                                }`}
                                placeholder="Enter your email"
                            />
                            {emailError && <p className="mt-1 text-xs text-red-600">{emailError}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full px-3 py-2 mt-1 border rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-2 ${
                                    passwordError ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                                }`}
                                placeholder="Enter your password"
                            />
                            {passwordError && <p className="mt-1 text-xs text-red-600">{passwordError}</p>}
                        </div>

                        <div className="mt-14">
                            <button
                                type="submit"
                                className="mt-4 px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
    
}
