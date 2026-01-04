import React, { useState } from 'react';
import ToolTemplate from '../../components/ToolTemplate';
import { ToolMetadata } from '../../types';
import { Database } from 'lucide-react';
import AdNative from '../../components/AdNative'; // 🔥 ad component

const SqlFormatter: React.FC<{ metadata: ToolMetadata }> = ({ metadata }) => {
  const [input, setInput] = useState('');

  // Basic formatting: newlines for major keywords and indentation
  const format = () => {
    let sql = input.replace(/\s+/g, ' ');
    const keywords = [
      "SELECT", "FROM", "WHERE", "AND", "OR", "ORDER BY", "GROUP BY", "HAVING",
      "LIMIT", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE",
      "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN"
    ];
    
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      sql = sql.replace(regex, `\n${kw.toUpperCase()}`);
    });
    
    return sql.trim();
  };

  return (
    <ToolTemplate metadata={metadata}>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Input SQL</label>
          <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              className="w-full h-96 p-4 font-mono text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="SELECT * FROM table WHERE id = 1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Formatted SQL</label>
          <textarea
              readOnly
              value={format()}
              className="w-full h-96 p-4 font-mono text-sm bg-slate-900 text-green-400 rounded-lg focus:outline-none"
          />
        </div>
      </div>

      {/* 🔥 AD PLACE — after formatted result */}
      <div className="mt-6">
        <AdNative />
      </div>
    </ToolTemplate>
  );
};

export default SqlFormatter;
