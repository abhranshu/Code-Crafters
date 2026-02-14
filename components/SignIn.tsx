import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, ArrowLeft, Lock, Mail, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabase';

interface SignInProps {
    onBack: () => void;
    onSignIn: () => void;
    onSignUpClick: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onBack, onSignIn, onSignUpClick }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
            } else {
                onSignIn();
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-mesh flex items-center justify-center px-4">
            {/* Background Particles */}
            {[...Array(10)].map((_, i) => (
                <div
                    key={i}
                    className="particle"
                    style={{
                        left: `${Math.random() * 100}% `,
                        top: `${Math.random() * 100}% `,
                        width: `${Math.random() * 4 + 2} px`,
                        height: `${Math.random() * 4 + 2} px`,
                        animationDuration: `${Math.random() * 20 + 10} s`,
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
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-slate-400 text-sm">Sign in to access your sustainability dashboard</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-white transition-colors">
                            <input type="checkbox" className="rounded border-white/20 bg-white/5 text-electricGreen focus:ring-offset-navy" />
                            <span>Remember me</span>
                        </label>
                        <a href="#" className="text-cyberCyan hover:text-electricGreen transition-colors">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-electricGreen hover:bg-electricGreen/90 text-navy font-bold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(0,245,160,0.2)] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500">
                    Don't have an account? <button onClick={onSignUpClick} className="text-white hover:text-electricGreen font-bold transition-colors">Get started</button>
                </div>
            </motion.div>
        </div>
    );
};

export default SignIn;
