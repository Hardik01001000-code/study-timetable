import React, { useState, useMemo } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, X, CheckCircle2, Circle } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import type { Topic, Subject } from '../types';

export const CalendarView: React.FC<{ readOnly?: boolean }> = ({ readOnly = false }) => {
  const { subjects, topics, toggleTopicCompletion } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const daysInGrid = eachDayOfInterval({ start: startDate, end: endDate });

  // Map topics to their subjects for easier rendering
  const getTopicsForDay = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return topics.filter(t => t.scheduledSessions.some(s => s.date === formattedDate));
  };

  const getSubjectsForDay = (date: Date) => {
    const dayTopics = getTopicsForDay(date);
    const subjectIds = Array.from(new Set(dayTopics.map(t => t.subjectId)));
    return subjectIds.map(id => subjects.find(s => s.id === id)).filter(Boolean) as Subject[];
  };

  // For the modal
  const selectedDayTopics = useMemo(() => {
    if (!selectedDate) return [];
    return getTopicsForDay(selectedDate);
  }, [selectedDate, topics]);

  const groupedTopics = useMemo(() => {
    const groups: Record<string, { subject: Subject; topics: Topic[] }> = {};
    selectedDayTopics.forEach(topic => {
      if (!groups[topic.subjectId]) {
        const subject = subjects.find(s => s.id === topic.subjectId);
        if (subject) {
          groups[topic.subjectId] = { subject, topics: [] };
        }
      }
      if (groups[topic.subjectId]) {
        groups[topic.subjectId].topics.push(topic);
      }
    });
    return Object.values(groups);
  }, [selectedDayTopics, subjects]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Calendar</h1>
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-3 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full shadow-inner active:scale-95 transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center">
            <ChevronLeft size={20} />
          </button>
          <span className="text-lg font-medium text-zinc-200 w-32 text-center">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button onClick={nextMonth} className="p-3 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full shadow-inner active:scale-95 transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-x-auto flex-1 flex flex-col">
        <div className="min-w-[700px] flex-1 flex flex-col">
          {/* Days of week header */}
          <div className="grid grid-cols-7 border-b border-zinc-800 bg-zinc-900/50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-3 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 flex-1 auto-rows-fr">
          {daysInGrid.map((day, i) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            const daySubjects = getSubjectsForDay(day);

            return (
              <div
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`min-h-[100px] border-b border-r border-zinc-800/50 p-2 transition-colors cursor-pointer hover:bg-zinc-800/50 flex flex-col gap-1
                  ${!isCurrentMonth ? 'bg-zinc-950/50 opacity-50' : ''}
                  ${i % 7 === 6 ? 'border-r-0' : ''}
                  ${i >= daysInGrid.length - 7 ? 'border-b-0' : ''}
                `}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                    ${isToday ? 'bg-indigo-500 text-white' : 'text-zinc-400'}
                  `}>
                    {format(day, 'd')}
                  </span>
                </div>
                <div className="flex flex-col gap-1 mt-1 flex-1 overflow-y-auto overflow-x-hidden scrollbar-none">
                  {daySubjects.map(subject => (
                    <div key={subject.id} className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-800/80 shadow-inner hover:bg-zinc-700 transition-colors text-zinc-200 truncate w-full flex items-center gap-1.5" title={subject.name}>
                      <span className="text-xs flex-shrink-0">
                        {subject.priority === 'High' ? '💖' : subject.priority === 'Medium' ? '⭐️' : '🌱'}
                      </span>
                      <span className="truncate">{subject.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>

      {/* Day Details Drawer/Modal */}
      {selectedDate && (
        <div className="fixed inset-0 z-50 flex flex-col md:flex-row justify-end items-end md:items-stretch">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedDate(null)} />
          <div className="relative w-full max-w-none md:max-w-md bg-zinc-900 h-[85vh] md:h-full rounded-t-2xl md:rounded-none md:border-l border-t md:border-t-0 border-zinc-800 shadow-2xl flex flex-col animate-in slide-in-from-bottom md:slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <div>
                <h2 className="text-xl font-bold text-white">Tasks for {format(selectedDate, 'EEEE')}</h2>
                <p className="text-sm text-zinc-400">{format(selectedDate, 'MMMM d, yyyy')}</p>
              </div>
              <button onClick={() => setSelectedDate(null)} className="p-3 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full shadow-inner active:scale-95 transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {groupedTopics.length === 0 ? (
                <div className="text-center py-10 text-zinc-500">
                  <p>No topics scheduled for this day.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {groupedTopics.map(group => (
                    <div key={group.subject.id}>
                      <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span className="text-base">
                          {group.subject.priority === 'High' ? '💖' : group.subject.priority === 'Medium' ? '⭐️' : '🌱'}
                        </span>
                        {group.subject.name}
                        <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{group.topics.length}</span>
                      </h3>
                      <div className="flex flex-col gap-2">
                        {group.topics.map(topic => {
                          const session = topic.scheduledSessions.find(s => s.date === format(selectedDate, 'yyyy-MM-dd'));
                          if (!session) return null;
                          return (
                            <div key={topic.id} className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-900 shadow-md border border-zinc-800 hover:border-zinc-700 transition-all duration-200">
                              <button
                                onClick={() => !readOnly && toggleTopicCompletion(topic.id, session.date)}
                                disabled={readOnly}
                                className={`text-zinc-400 transition-colors focus:outline-none flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 -mt-2 ${!readOnly ? 'hover:text-indigo-400 active:scale-90' : 'cursor-not-allowed opacity-80'}`}
                              >
                                {session.isCompleted ? (
                                  <CheckCircle2 size={18} className="text-indigo-400" />
                                ) : (
                                  <Circle size={18} />
                                )}
                              </button>
                              <span className={`text-sm transition-all ${session.isCompleted ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                                {topic.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
