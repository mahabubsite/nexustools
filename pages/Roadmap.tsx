import React, { useState } from 'react';
import { ChevronUp, CheckCircle2, Clock, CircleDashed } from 'lucide-react';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  votes: number;
  status: 'planned' | 'in-progress' | 'completed';
}

const INITIAL_ITEMS: RoadmapItem[] = [
  { id: '1', title: 'PDF Tools', description: 'Merge, split, and compress PDF files directly in browser.', votes: 124, status: 'in-progress' },
  { id: '2', title: 'Dark Mode Support', description: 'Full dark theme support across the entire application.', votes: 89, status: 'completed' },
  { id: '3', title: 'API Access', description: 'Public API endpoints for developers to integrate our tools.', votes: 256, status: 'planned' },
  { id: '4', title: 'User Accounts', description: 'Save your settings and history.', votes: 150, status: 'completed' },
  { id: '5', title: 'SEO Analyzer', description: 'Deep scan websites for SEO improvements.', votes: 78, status: 'planned' },
  { id: '6', title: 'Regex Tester', description: 'Test and debug regular expressions.', votes: 45, status: 'in-progress' },
  { id: '7', title: 'Diff Checker', description: 'Compare two text files side by side.', votes: 110, status: 'planned' },
];

const Roadmap: React.FC = () => {
  const [items, setItems] = useState<RoadmapItem[]>(INITIAL_ITEMS);
  const [votedItems, setVotedItems] = useState<string[]>([]);

  const handleVote = (id: string) => {
    if (votedItems.includes(id)) {
      setItems(items.map(item => item.id === id ? { ...item, votes: item.votes - 1 } : item));
      setVotedItems(votedItems.filter(itemId => itemId !== id));
    } else {
      setItems(items.map(item => item.id === id ? { ...item, votes: item.votes + 1 } : item));
      setVotedItems([...votedItems, id]);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in-progress': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'planned': return <CircleDashed className="h-5 w-5 text-slate-400" />;
      default: return null;
    }
  };

  const Column = ({ title, status, color }: { title: string, status: string, color: string }) => (
    <div className="flex flex-col gap-4">
      <div className={`flex items-center gap-2 pb-2 border-b-2 ${color}`}>
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h3>
        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full text-xs font-semibold">
          {items.filter(i => i.status === status).length}
        </span>
      </div>
      <div className="space-y-4">
        {items.filter(i => i.status === status).sort((a, b) => b.votes - a.votes).map(item => (
          <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-4 items-start">
              <button 
                onClick={() => handleVote(item.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border min-w-[50px] transition-colors ${votedItems.includes(item.id) ? 'bg-brand-50 border-brand-200 text-brand-600 dark:bg-brand-900/20 dark:border-brand-800 dark:text-brand-400' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-brand-200 hover:text-brand-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white'}`}
              >
                <ChevronUp className="h-5 w-5" />
                <span className="font-bold text-sm">{item.votes}</span>
              </button>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 font-medium">
                   {getStatusIcon(status)}
                   <span className="capitalize">{status.replace('-', ' ')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-16 pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Product Roadmap</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            See what we're working on, what's coming next, and vote for the features you want to see.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Column title="Planned" status="planned" color="border-slate-300" />
          <Column title="In Progress" status="in-progress" color="border-blue-500" />
          <Column title="Completed" status="completed" color="border-green-500" />
        </div>
        
        <div className="mt-16 text-center">
            <p className="text-slate-500 dark:text-slate-400 mb-4">Have a feature request that's not on the list?</p>
            <a href="/contact" className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                Submit Request
            </a>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;