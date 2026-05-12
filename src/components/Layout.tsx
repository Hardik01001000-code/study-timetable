import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Calendar, BookOpen, LogOut, ShieldCheck } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

interface LayoutProps {
  readOnly?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ readOnly = false }) => {
  const { subjects } = useStore();
  const navigate = useNavigate();
  const basePath = readOnly ? '' : '/admin';

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-950 text-zinc-200">
      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:flex w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex-col gap-6 sticky top-0 h-screen">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white mb-2 flex items-center gap-2">
            Study Tracker
            {!readOnly && <ShieldCheck size={18} className="text-indigo-400" />}
          </h1>
          {readOnly && <p className="text-xs text-zinc-500 mb-6 px-1 uppercase tracking-wider font-semibold">Public View</p>}
          {!readOnly && <div className="h-6"></div>}
          
          <div className="flex flex-col gap-2">
            <NavLink
              to={basePath || '/'}
              end={basePath === ''}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-full transition-all active:scale-95 ${
                  isActive ? 'bg-indigo-500/10 text-indigo-400 font-medium shadow-inner' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`
              }
            >
              <Calendar size={18} />
              Calendar
            </NavLink>
            <NavLink
              to={`${basePath}/subjects`}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-full transition-all active:scale-95 ${
                  isActive ? 'bg-indigo-500/10 text-indigo-400 font-medium shadow-inner' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`
              }
            >
              <BookOpen size={18} />
              All Subjects
            </NavLink>
          </div>
        </div>

        {/* Subjects List in Sidebar */}
        <div className="flex-1 overflow-y-auto">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-3">
            Your Subjects
          </h2>
          <div className="flex flex-col gap-1">
            {subjects.map((subject) => (
              <NavLink
                key={subject.id}
                to={`${basePath}/subjects/${subject.id}`}
                className={({ isActive }) =>
                  `block px-4 py-2 text-sm rounded-full truncate transition-all active:scale-95 ${
                    isActive ? 'text-white bg-zinc-800 shadow-inner' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`
                }
              >
                {subject.name}
              </NavLink>
            ))}
            {subjects.length === 0 && (
              <p className="text-sm text-zinc-500 px-3 italic">No subjects yet.</p>
            )}
          </div>
        </div>

        {/* Auth / Admin Actions */}
        <div className="pt-4 border-t border-zinc-800 flex flex-col gap-2">
          {!readOnly ? (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-full text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all active:scale-95 w-full font-medium"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          ) : (
            <NavLink
              to="/login"
              className="flex items-center gap-3 px-4 py-3 rounded-full text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all active:scale-95 w-full font-medium"
            >
              <ShieldCheck size={18} />
              Admin Login
            </NavLink>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        {/* Mobile Header with Auth actions */}
        <div className="md:hidden flex items-center justify-between p-4 bg-zinc-900 border-b border-zinc-800">
          <h1 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
            Study Tracker
            {!readOnly && <ShieldCheck size={16} className="text-indigo-400" />}
          </h1>
          {!readOnly ? (
            <button onClick={handleSignOut} className="p-2 text-zinc-400 hover:text-red-400 rounded-full bg-zinc-800/50 active:scale-95">
              <LogOut size={18} />
            </button>
          ) : (
            <NavLink to="/login" className="p-2 text-zinc-400 hover:text-indigo-400 rounded-full bg-zinc-800/50 active:scale-95">
              <ShieldCheck size={18} />
            </NavLink>
          )}
        </div>

        <div className="max-w-5xl mx-auto p-4 md:p-10">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-zinc-900 border-t border-zinc-800 flex items-center justify-around z-40 pb-safe">
        <NavLink
          to={basePath || '/'}
          end={basePath === ''}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-3 m-1 flex-1 rounded-2xl transition-all active:scale-95 ${
              isActive ? 'text-indigo-400 bg-zinc-800/50 shadow-inner' : 'text-zinc-400 hover:text-zinc-200'
            }`
          }
        >
          <Calendar size={20} />
          <span className="text-[10px] font-medium">Calendar</span>
        </NavLink>
        <NavLink
          to={`${basePath}/subjects`}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-3 m-1 flex-1 rounded-2xl transition-all active:scale-95 ${
              isActive ? 'text-indigo-400 bg-zinc-800/50 shadow-inner' : 'text-zinc-400 hover:text-zinc-200'
            }`
          }
        >
          <BookOpen size={20} />
          <span className="text-[10px] font-medium">Subjects</span>
        </NavLink>
      </nav>
    </div>
  );
};
