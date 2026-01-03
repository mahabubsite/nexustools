import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-20 pb-20 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl mb-6">About Nexus Tools</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-16">
            We are a team of developers who were tired of ad-riddled, slow, and unsafe web tools. 
            So we built the tools we wanted to use.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Mission</h2>
                <p className="text-slate-600 dark:text-slate-400">
                    To simplify the developer workflow by providing a comprehensive suite of utilities that are fast, secure, and delightful to use. We believe basic tools shouldn't be behind paywalls or buried under ads.
                </p>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Privacy Promise</h2>
                <p className="text-slate-600 dark:text-slate-400">
                    Privacy isn't a feature; it's a right. Nexus Tools processes data client-side whenever technically possible. Your JSON keys, base64 strings, and images stay on your device.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default About;