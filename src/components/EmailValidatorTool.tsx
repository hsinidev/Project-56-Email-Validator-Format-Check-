
import React, { useState, useCallback, useEffect } from 'react';
import { validateEmailFormat } from '../utils/RegexValidator';
import { ValidationResult, ValidationCheck } from '../types';

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const CrossIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

const NeutralIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.464a.5.5 0 01.708 0h3.656a.5.5 0 010 1H6.172a.5.5 0 01-.708-1z" clipRule="evenodd" />
    </svg>
);

const StatusIcon: React.FC<{ passed: boolean | null }> = ({ passed }) => {
    if (passed === true) return <CheckIcon />;
    if (passed === false) return <CrossIcon />;
    return <NeutralIcon />;
};


export const EmailValidatorTool: React.FC = () => {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleValidation = useCallback(() => {
    if (!email) {
        setResult(null);
        return;
    }
    const validationResult = validateEmailFormat(email);
    setResult(validationResult);
  }, [email]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear previous results on new input for better UX
    if (result) {
      setResult(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleValidation();
    }
  };

  const getStatusColorClasses = () => {
    if (!result) return 'border-gray-600 bg-gray-700/50';
    return result.isValid
      ? 'border-green-500/50 bg-green-500/10'
      : 'border-red-500/50 bg-red-500/10';
  };

  const getStatusTextColor = () => {
    if (!result) return 'text-gray-300';
    return result.isValid ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-gray-900/60 backdrop-blur-md border border-gray-700/60 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-2">Email Format Validator</h1>
          <p className="text-center text-gray-400 mb-8">Instantly check if an email address has a valid structure using Regex.</p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter email address..."
              className="flex-grow bg-gray-800/70 border border-gray-600 text-white placeholder-gray-500 text-lg rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full p-4 transition-all duration-300"
              aria-label="Email address input"
            />
            <button
              onClick={handleValidation}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-lg py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!email}
            >
              Check Format
            </button>
          </div>
        </div>

        {result && (
          <div className="border-t border-gray-700/50 animate-fade-in">
            <div className={`p-6 md:p-8 border-b-4 ${getStatusColorClasses()} transition-all duration-500`}>
              <h2 className="text-2xl font-bold text-center mb-4">Validation Result</h2>
              <div className={`text-4xl font-extrabold text-center tracking-wider ${getStatusTextColor()}`}>
                {result.isValid ? 'VALID FORMAT' : 'INVALID FORMAT'}
              </div>
            </div>
            
            <div className="p-6 md:p-8 grid md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Specific Checks</h3>
                    <ul className="space-y-3">
                        {result.checks.map((check) => (
                            <li key={check.id} className="flex items-center text-gray-300">
                                <StatusIcon passed={check.passed} />
                                <span className="ml-3">{check.description}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    {result.errorMessages.length > 0 && (
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">Issues Found</h3>
                            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 space-y-2">
                                {result.errorMessages.map((msg, index) => (
                                <p key={index} className="text-red-300 text-sm">
                                    - {msg}
                                </p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
