import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, ArrowLeft, Lock, Mail, User, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabase';

interface SignUpProps {
    onBack: () => void;
    onSignInClick: () => void;
    onSignUpSuccess: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onBack, onSignInClick, onSignUpSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (error) {
                setError(error.message);
            } else if (data.user) {
                // Check if email confirmation is required
                if (data.user.identities?.length === 0) {
                    setError('This email is already registered. Please sign in instead.');
                } else {
                    setSuccessMessage('Account created! Please check your email to confirm your account.');
                    // Optional: call onSignUpSuccess if you want to auto-login or redirect
                    // onSignUpSuccess(); 
                }
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (successMessage) {
        return (
            <div className="min-h-screen relative overflow-hidden bg-mesh flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-navy/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center"
                >
                    <div className="w-16 h-16 bg-electricGreen/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-8 h-8 text-electricGreen" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Check your email</h2>
                    <p className="text-slate-400 mb-8">{successMessage}</p>
                    <button
                        onClick={onSignInClick}
                        className="w-full h-12 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
                    >
                        Return to Sign In
                    </button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-mesh flex items-center justify-center px-4">
            {/* Background Particles */}
            {[...Array(10)].map((_, i) => (
                <div
                    key={i}
                    className="particle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${Math.random() * 4 + 2}px`,
                        height: `${Math.random() * 4 + 2}px`,
                        animationDuration: `${Math.random() * 20 + 10}s`,
                        opacity: Math.random() * 0.3
                    }}
                />
            ))}

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md bg-navy/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-electricGreen to-cyberCyan" />

                <button
                    onClick={onBack}
                    className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <div className="text-center mb-10 mt-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-electricGreen to-cyberCyan rounded-xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(0,245,160,0.3)]">
                        <Leaf className="text-navy w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-slate-400 text-sm">Join the future of sustainable finance</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-electricGreen transition-colors" />
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-electricGreen/50 focus:bg-white/10 transition-all disabled:opacity-50"
                                placeholder="John Doe"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-electricGreen transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-electricGreen/50 focus:bg-white/10 transition-all disabled:opacity-50"
                                placeholder="name@company.com"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-electricGreen transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-electricGreen/50 focus:bg-white/10 transition-all disabled:opacity-50"
                                placeholder="••••••••"
                                required
                                minLength={6}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-electricGreen hover:bg-electricGreen/90 text-navy font-bold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(0,245,160,0.2)] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500">
                    Already have an account? <button onClick={onSignInClick} className="text-white hover:text-electricGreen font-bold transition-colors">Sign In</button>
                </div>
            </motion.div>
        </div>
    );
};

export default SignUp;
