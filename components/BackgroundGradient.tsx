import React from 'react';

export const BackgroundGradient: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-slate-50">
      {/* Liquid Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/40 blur-[100px] animate-blob-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/40 blur-[120px] animate-blob-slow-reverse"></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-pink-100/30 blur-[100px] animate-blob-medium"></div>
      <div className="absolute bottom-[20%] left-[10%] w-[35%] h-[35%] rounded-full bg-amber-100/30 blur-[110px] animate-blob-medium-reverse"></div>
      
      {/* Noise Texture for that "glass" feel */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <style>{`
        @keyframes blob-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(10%, 10%) scale(1.1); }
          66% { transform: translate(-5%, 15%) scale(0.9); }
        }
        @keyframes blob-slow-reverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-10%, -10%) scale(1.1); }
          66% { transform: translate(5%, -15%) scale(0.9); }
        }
        @keyframes blob-medium {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-15%, 5%) scale(1.2); }
        }
        @keyframes blob-medium-reverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15%, -5%) scale(1.1); }
        }
        .animate-blob-slow {
          animation: blob-slow 20s infinite ease-in-out;
        }
        .animate-blob-slow-reverse {
          animation: blob-slow-reverse 25s infinite ease-in-out;
        }
        .animate-blob-medium {
          animation: blob-medium 15s infinite ease-in-out;
        }
        .animate-blob-medium-reverse {
          animation: blob-medium-reverse 18s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};