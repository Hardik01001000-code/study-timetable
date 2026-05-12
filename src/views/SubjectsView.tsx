import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, ChevronRight } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import type { Priority } from '../types';

export const SubjectsView: React.FC = () => {
  const { subjects, addSubject, deleteSubject, updateSubjectPriority } = useStore();
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectPriority, setNewSubjectPriority] = useState<Priority>('Medium');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubjectName.trim()) {
      addSubject(newSubjectName.trim(), newSubjectPriority);
      setNewSubjectName('');
      setNewSubjectPriority('Medium');
      setIsAdding(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">All Subjects</h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-full shadow-md active:scale-95 transition-all duration-200 text-sm font-medium min-w-[44px] min-h-[44px]"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Add Subject</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddSubmit} className="mb-8 p-5 bg-zinc-900 shadow-inner rounded-3xl flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="text"
            autoFocus
            placeholder="e.g. Data Structures, Operating Systems..."
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            className="w-full flex-1 bg-zinc-950 border border-zinc-800 rounded-full px-5 py-3 text-zinc-200 focus:outline-none focus:border-indigo-500 shadow-inner"
          />
          <select
            value={newSubjectPriority}
            onChange={(e) => setNewSubjectPriority(e.target.value as Priority)}
            className="w-full sm:w-auto bg-zinc-950 border border-zinc-800 rounded-full px-5 py-3 text-zinc-200 focus:outline-none focus:border-indigo-500 shadow-inner appearance-none min-w-[120px]"
          >
            <option value="High">💖 High</option>
            <option value="Medium">⭐️ Medium</option>
            <option value="Low">🌱 Low</option>
          </select>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="submit"
              disabled={!newSubjectName.trim()}
              className="flex-1 sm:flex-none bg-indigo-500 hover:bg-indigo-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-6 py-3 rounded-full shadow-md active:scale-95 transition-all duration-200 text-sm font-medium min-w-[44px] min-h-[44px]"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="flex-1 sm:flex-none text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-full shadow-md active:scale-95 transition-all duration-200 text-sm min-w-[44px] min-h-[44px]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {subjects.length === 0 && !isAdding ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl text-zinc-500">
          <p>No subjects added yet. Create one to get started.</p>
        </div>
      ) : (
        <>
          {/* Mobile Cards Layout */}
          <div className="md:hidden flex flex-col gap-4">
            {[...subjects].sort((a, b) => {
              const order = { High: 1, Medium: 2, Low: 3 };
              return order[a.priority] - order[b.priority];
            }).map((subject) => (
              <div key={subject.id} className="bg-zinc-900 rounded-3xl p-5 shadow-md flex flex-col gap-4">
                <div className="flex justify-between items-start gap-4">
                  <Link to={`/subjects/${subject.id}`} className="text-zinc-200 font-medium flex items-center gap-3 hover:text-indigo-400 transition-colors">
                    <span className="text-lg">
                      {subject.priority === 'High' ? '💖' : subject.priority === 'Medium' ? '⭐️' : '🌱'}
                    </span>
                    <span className="text-lg truncate">{subject.name}</span>
                    <ChevronRight size={18} className="text-zinc-500" />
                  </Link>
                  <button
                    onClick={() => deleteSubject(subject.id)}
                    className="text-zinc-500 hover:text-red-400 bg-zinc-950 hover:bg-zinc-800 p-3 rounded-full shadow-inner active:scale-95 transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
                    title="Delete Subject"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <select
                  value={subject.priority}
                  onChange={(e) => updateSubjectPriority(subject.id, e.target.value as Priority)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-full px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500 shadow-inner appearance-none cursor-pointer"
                >
                  <option value="High">💖 High</option>
                  <option value="Medium">⭐️ Medium</option>
                  <option value="Low">🌱 Low</option>
                </select>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block bg-zinc-900 rounded-3xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/50">
                    <th className="px-6 py-4 text-sm font-medium text-zinc-400 uppercase tracking-wider">Subject Name</th>
                    <th className="px-6 py-4 text-sm font-medium text-zinc-400 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-4 text-sm font-medium text-zinc-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {[...subjects].sort((a, b) => {
                    const order = { High: 1, Medium: 2, Low: 3 };
                    return order[a.priority] - order[b.priority];
                  }).map((subject) => (
                    <tr key={subject.id} className="hover:bg-zinc-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <Link to={`/subjects/${subject.id}`} className="text-zinc-200 font-medium flex items-center gap-3 hover:text-indigo-400 transition-colors w-fit">
                          <span className="text-base">
                            {subject.priority === 'High' ? '💖' : subject.priority === 'Medium' ? '⭐️' : '🌱'}
                          </span>
                          {subject.name}
                          <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={subject.priority}
                          onChange={(e) => updateSubjectPriority(subject.id, e.target.value as Priority)}
                          className="bg-zinc-950 border border-zinc-800 rounded-full px-4 py-2 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500 shadow-inner cursor-pointer appearance-none min-w-[120px]"
                        >
                          <option value="High">💖 High</option>
                          <option value="Medium">⭐️ Medium</option>
                          <option value="Low">🌱 Low</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => deleteSubject(subject.id)}
                          className="text-zinc-500 hover:text-red-400 bg-zinc-950 hover:bg-zinc-800 p-2 rounded-full shadow-inner active:scale-95 transition-all duration-200 min-w-[44px] min-h-[44px] inline-flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Delete Subject"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
