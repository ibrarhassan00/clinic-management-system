import { useSelector } from 'react-redux';

export default function Navbar({ title }) {
  const { user } = useSelector(state => state.auth);
  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-700/50 flex items-center justify-between px-6 sticky top-0 z-40">
      <h2 className="text-lg font-bold text-white">{title}</h2>
      <div className="flex items-center gap-3">
        {user?.plan && (
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${user.plan === 'pro' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-700 text-slate-400'}`}>
            {user.plan === 'pro' ? '⭐ PRO' : 'FREE'}
          </span>
        )}
        <span className="text-sm text-slate-400">Welcome, <span className="text-white font-semibold">{user?.name}</span></span>
      </div>
    </header>
  );
}