import React from 'react';

export const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-16 pb-20 transition-colors">
      <div className="max-w-3xl mx-auto px-4 text-slate-600 dark:text-slate-300 prose prose-slate dark:prose-invert">
        <h1 className="text-slate-900 dark:text-white">Privacy Policy</h1>
        <p>Last updated: October 2023</p>
        <p>Your privacy is important to us. It is Nexus Tools' policy to respect your privacy regarding any information we may collect from you across our website.</p>
        <h3>1. Information We Collect</h3>
        <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
        <h3>2. Log Data</h3>
        <p>When you visit our website, our servers may automatically log the standard data provided by your web browser. This data is considered "non-identifying information", as it does not personally identify you on its own.</p>
        <h3>3. Processing</h3>
        <p>Most tools on this website process data client-side (in your browser). We do not store the input data from tools like JSON Formatter, Base64 Converter, etc., on our servers.</p>
      </div>
    </div>
  );
};

export const Terms: React.FC = () => {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 pt-16 pb-20 transition-colors">
        <div className="max-w-3xl mx-auto px-4 text-slate-600 dark:text-slate-300 prose prose-slate dark:prose-invert">
          <h1 className="text-slate-900 dark:text-white">Terms of Service</h1>
          <p>By accessing the website at Nexus Tools, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
          <h3>1. Use License</h3>
          <p>Permission is granted to temporarily download one copy of the materials (information or software) on Nexus Tools' website for personal, non-commercial transitory viewing only.</p>
          <h3>2. Disclaimer</h3>
          <p>The materials on Nexus Tools' website are provided on an 'as is' basis. Nexus Tools makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        </div>
      </div>
    );
  };