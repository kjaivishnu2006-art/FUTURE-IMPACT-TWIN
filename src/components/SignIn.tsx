import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, Github, Mail, UserCircle, Leaf } from 'lucide-react';

interface SignInProps {
  onGoogleSignIn: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onGoogleSignIn }) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full -z-10"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex p-4 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 mb-6">
          <Leaf className="text-emerald-400 w-12 h-12" />
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4">
          Future Impact <span className="text-emerald-400">Twin</span>
        </h1>
        <p className="text-white/50 text-lg max-w-md mx-auto">
          Access your digital environmental twin and simulate the future of planetary health.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-md space-y-4"
      >
        <SignInButton 
          icon={<LogIn className="w-5 h-5" />} 
          label="Continue with Google" 
          onClick={onGoogleSignIn}
          primary
        />
        
        <div className="flex items-center gap-4 my-8">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Other Protocols</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <SignInButton 
            icon={<Github className="w-5 h-5" />} 
            label="GitHub Neural Link" 
            onClick={() => alert("GitHub integration requires environment configuration.")}
          />
          <SignInButton 
            icon={<Mail className="w-5 h-5" />} 
            label="Email Identity" 
            onClick={() => alert("Email authentication coming in v1.1")}
          />
          <SignInButton 
            icon={<UserCircle className="w-5 h-5" />} 
            label="Anonymous Ghost Mode" 
            onClick={() => alert("Anonymous mode disabled for hackathon build.")}
          />
        </div>
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold"
      >
        Encrypted via Quantum-Safe Protocols &bull; v1.0.4-beta
      </motion.p>
    </div>
  );
};

const SignInButton = ({ icon, label, onClick, primary }: { icon: React.ReactNode, label: string, onClick: () => void, primary?: boolean }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all border ${
      primary 
        ? 'bg-white text-black border-white hover:bg-emerald-400 hover:border-emerald-400 shadow-[0_0_30px_rgba(255,255,255,0.1)]' 
        : 'bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/20'
    }`}
  >
    {icon}
    <span className="uppercase tracking-widest text-sm">{label}</span>
  </button>
);

export default SignIn;
