import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, CheckCircle2, Circle, Calendar, X, ChevronLeft, ChevronRight, XCircle } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

const MultiSelectCalendarModal: React.FC<{
  initialDates: string[];
  onClose: () => void;
  onSave: (dates: string[]) => void;
}> = ({ initialDates, onClose, onSave }) => {
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set(initialDates));
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const daysInGrid = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const toggleDate = (dateStr: string) => {
    const newSet = new Set(selectedDates);
    if (newSet.has(dateStr)) {
      newSet.delete(dateStr);
    } else {
      newSet.add(dateStr);
    }
    setSelectedDates(newSet);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#1a1b26] rounded-3xl shadow-2xl border border-zinc-800 p-6 animate-in zoom-in-95 duration-200 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Schedule Dates</h3>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-full shadow-inner active:scale-95 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full shadow-inner active:scale-95 transition-all duration-200 flex items-center justify-center">
            <ChevronLeft size={20} />
          </button>
          <span className="text-base font-medium text-zinc-200">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button onClick={nextMonth} className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full shadow-inner active:scale-95 transition-all duration-200 flex items-center justify-center">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-zinc-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-6">
          {daysInGrid.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isSelected = selectedDates.has(dateStr);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <button
                key={dateStr}
                onClick={() => toggleDate(dateStr)}
                className={`
                  aspect-square rounded-full flex items-center justify-center text-sm font-medium transition-all active:scale-90
                  ${!isCurrentMonth ? 'opacity-30' : ''}
                  ${isSelected 
                    ? 'bg-indigo-500 shadow-lg text-white' 
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 shadow-inner'
                  }
                  ${isToday && !isSelected ? 'border border-indigo-500/50 text-indigo-400' : ''}
                `}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onSave(Array.from(selectedDates))}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-4 rounded-full shadow-md active:scale-95 transition-all duration-200 text-base font-medium min-w-[44px] min-h-[44px]"
        >
          Done
        </button>
      </div>
    </div>
  );
};


export const SubjectDetailsView: React.FC<{ readOnly?: boolean }> = ({ readOnly = false }) => {
  const { id } = useParams<{ id: string }>();
  const { subjects, topics, addTopic, deleteTopic, toggleTopicCompletion, removeTopicSession, setTopicSessions } = useStore();
  
  const subject = subjects.find((s) => s.id === id);
  
  const scheduledTopics = topics.filter((t) => t.subjectId === id && t.scheduledSessions.length > 0);
  const unscheduledTopics = topics.filter((t) => t.subjectId === id && t.scheduledSessions.length === 0);

  const [isAdding, setIsAdding] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDate, setNewTopicDate] = useState('');
  
  // State for scheduling an unscheduled topic
  const [schedulingTopicId, setSchedulingTopicId] = useState<string | null>(null);

  if (!subject) {
    return (
      <div className="text-center py-20 text-zinc-500">
        <p>Subject not found.</p>
        <Link to="/subjects" className="text-indigo-400 hover:underline mt-4 inline-block">Go back to Subjects</Link>
      </div>
    );
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTopicName.trim()) {
      addTopic(subject.id, newTopicName.trim(), newTopicDate || undefined);
      setNewTopicName('');
      setNewTopicDate('');
      setIsAdding(false);
    }
  };

  const getInitialDatesForTopic = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return [];
    return topic.scheduledSessions.map(s => s.date);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <Link to="/subjects" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 mb-6 transition-colors">
        <ArrowLeft size={16} />
        Back to Subjects
      </Link>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
            <span className="text-2xl">
              {subject.priority === 'High' ? '💖' : subject.priority === 'Medium' ? '⭐️' : '🌱'}
            </span>
            {subject.name}
          </h1>
          <p className="text-zinc-400">Manage topics and schedule for this subject.</p>
        </div>
        {!readOnly && (
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-full shadow-md active:scale-95 transition-all duration-200 text-sm font-medium min-w-[44px] min-h-[44px]"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Topic</span>
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAddSubmit} className="mb-8 p-5 bg-zinc-900 shadow-inner rounded-3xl flex flex-col md:flex-row gap-4 items-end md:items-center">
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-zinc-400 mb-1 pl-2">Topic Name</label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Graph Algorithms"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-full px-5 py-3 text-zinc-200 focus:outline-none focus:border-indigo-500 shadow-inner"
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-xs font-medium text-zinc-400 mb-1 pl-2">First Session (Optional)</label>
            <input
              type="date"
              value={newTopicDate}
              onChange={(e) => setNewTopicDate(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-full px-5 py-3 text-zinc-200 focus:outline-none focus:border-indigo-500 shadow-inner [color-scheme:dark]"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              type="submit"
              disabled={!newTopicName.trim()}
              className="flex-1 md:flex-none bg-indigo-500 hover:bg-indigo-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-6 py-3 rounded-full shadow-md active:scale-95 transition-all duration-200 text-sm font-medium min-w-[44px] min-h-[44px]"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="flex-1 md:flex-none text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-full shadow-md active:scale-95 transition-all duration-200 text-sm min-w-[44px] min-h-[44px]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Topic Bank (Unscheduled) */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          Topic Bank (Unscheduled)
          <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{unscheduledTopics.length}</span>
        </h2>
        {unscheduledTopics.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-zinc-800 rounded-3xl text-zinc-500">
            <p>No unscheduled topics in the bank.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {unscheduledTopics.map((topic) => (
              <div key={topic.id} className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl shadow-md border border-zinc-800 hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-base text-zinc-200 pl-2">
                    {topic.name}
                  </span>
                </div>
                {!readOnly && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSchedulingTopicId(topic.id)}
                      className="text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-4 py-2 rounded-full shadow-inner active:scale-95 transition-all duration-200 min-h-[44px] flex items-center gap-2"
                      title="Schedule Dates"
                    >
                      <Calendar size={18} />
                      <span className="text-sm font-medium">Schedule</span>
                    </button>
                    <button
                      onClick={() => deleteTopic(topic.id)}
                      className="text-zinc-500 hover:text-red-400 bg-zinc-950 hover:bg-zinc-800 p-2 rounded-full shadow-inner active:scale-95 transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title="Delete Topic"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scheduled Topics */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          Scheduled Topics
          <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{scheduledTopics.length}</span>
        </h2>
        {scheduledTopics.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-zinc-800 rounded-3xl text-zinc-500">
            <p>No scheduled topics.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {scheduledTopics.map((topic) => (
              <div key={topic.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-zinc-900 rounded-2xl shadow-md border border-zinc-800 hover:border-zinc-700 transition-colors gap-4">
                <div className="flex-1">
                  <div className="text-base font-medium text-zinc-200 mb-3 pl-2">
                    {topic.name}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {topic.scheduledSessions.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(session => (
                      <div
                        key={session.date}
                        className={`group flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-xs font-medium transition-all ${
                          session.isCompleted 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}
                      >
                        <button
                          onClick={() => !readOnly && toggleTopicCompletion(topic.id, session.date)}
                          disabled={readOnly}
                          className={`flex items-center gap-1.5 focus:outline-none transition-all ${!readOnly ? 'hover:opacity-80 active:scale-90' : 'cursor-not-allowed opacity-80'}`}
                          title="Toggle Completion"
                        >
                          {session.isCompleted ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                          <span className={session.isCompleted ? 'line-through opacity-70' : ''}>
                            {new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </button>
                        {!readOnly && (
                          <>
                            <div className="w-px h-3 bg-zinc-700/50 mx-0.5"></div>
                            <button
                              onClick={() => removeTopicSession(topic.id, session.date)}
                              className="text-zinc-500 hover:text-red-400 transition-colors active:scale-90"
                              title="Remove Date"
                            >
                              <XCircle size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                    {!readOnly && (
                      <button
                        onClick={() => setSchedulingTopicId(topic.id)}
                        className="flex items-center justify-center bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 w-8 h-8 rounded-full shadow-inner active:scale-95 transition-all"
                        title="Manage Dates"
                      >
                        <Plus size={16} />
                      </button>
                    )}
                  </div>
                </div>
                {!readOnly && (
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => deleteTopic(topic.id)}
                      className="text-zinc-500 hover:text-red-400 bg-zinc-950 hover:bg-zinc-800 p-2 rounded-full shadow-inner active:scale-95 transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
                      title="Delete Topic"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scheduling Modal */}
      {schedulingTopicId && (
        <MultiSelectCalendarModal
          initialDates={getInitialDatesForTopic(schedulingTopicId)}
          onClose={() => setSchedulingTopicId(null)}
          onSave={(dates) => {
            setTopicSessions(schedulingTopicId, dates);
            setSchedulingTopicId(null);
          }}
        />
      )}
    </div>
  );
};
