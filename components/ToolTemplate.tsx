import React from 'react';
import { ToolMetadata, FAQItem } from '../types';
import { ChevronRight, Home, Info, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ToolTemplateProps {
  metadata: ToolMetadata;
  children: React.ReactNode;
  faqs?: FAQItem[];
  howItWorks?: string;
}

const ToolTemplate: React.FC<ToolTemplateProps> = ({ metadata, children, faqs, howItWorks }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-12 transition-colors duration-300">
      {/* Breadcrumb & Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link to="/" className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
                  <Home className="h-4 w-4" />
                </Link>
              </li>
              <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
              <li>
                <Link to="/tools" className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">Tools</Link>
              </li>
              <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
              <li>
                <Link to={`/category/${metadata.category}`} className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 capitalize">
                  {metadata.category}
                </Link>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">{metadata.name}</h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400 max-w-3xl">{metadata.description}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Tool Interaction Area (Left/Center 2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
               {/* This is where the specific tool logic goes */}
               {/* We wrap children in a text color container for consistency */}
               <div className="text-slate-900 dark:text-slate-100">
                  {children}
               </div>
            </div>

            {/* How It Works Section */}
            {howItWorks && (
              <div className="bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">How It Works</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert text-slate-600 dark:text-slate-400 leading-relaxed">
                  {howItWorks}
                </div>
              </div>
            )}
            
            {/* FAQ Section */}
            {faqs && faqs.length > 0 && (
              <div className="bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                 <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-4">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0 last:pb-0">
                      <h3 className="font-medium text-slate-900 dark:text-slate-200 mb-1">{faq.question}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (Ads, Related, Info) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Pro Upgrade CTA */}
            <div className="bg-gradient-to-br from-brand-600 to-brand-700 dark:from-brand-700 dark:to-brand-800 rounded-xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-2">Upgrade to Pro</h3>
              <p className="text-brand-100 text-sm mb-4">Get unlimited usage, no ads, and faster processing speeds.</p>
              <Link to="/pricing" className="block w-full bg-white text-brand-700 font-semibold py-2 px-4 rounded-lg hover:bg-brand-50 transition-colors text-sm text-center">
                View Pricing
              </Link>
            </div>

            {/* Placeholder for Related Tools or Ads */}
             <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm uppercase tracking-wide">Related Tools</h4>
                <ul className="space-y-2">
                    <li className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors">JSON Minifier</li>
                    <li className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors">XML Formatter</li>
                    <li className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors">YAML Validator</li>
                </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ToolTemplate;