
import React from 'react';
import { ThemeLayout } from './components/ThemeLayout';
import { EmailValidatorTool } from './components/EmailValidatorTool';
import { SeoArticle } from './utils/SeoArticle';

const App: React.FC = () => {
  return (
    <ThemeLayout>
        <div className="w-full flex flex-col items-center gap-16">
            <EmailValidatorTool />
            <SeoArticle />
        </div>
    </ThemeLayout>
  );
};

export default App;
