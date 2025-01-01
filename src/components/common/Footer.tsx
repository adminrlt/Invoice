import React from 'react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500">
          © {currentYear} Invoice Intelligence. All rights reserved. 
          <br />
          <span className="text-xs">
            A product of{' '}
            <a 
              href="https://researchlabtech.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-500"
            >
              ResearchLabTech.com
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
};