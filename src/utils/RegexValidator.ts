
import { ValidationResult, ValidationCheck } from '../types';

const initialChecks: ValidationCheck[] = [
  { id: 'format', description: 'Overall email format is valid (e.g. user@domain.com)', passed: null },
  { id: 'noSpaces', description: 'No leading/trailing spaces', passed: null },
  { id: 'atSymbol', description: "'@' symbol is present", passed: null },
  { id: 'localPart', description: 'Has a valid username part (before @)', passed: null },
  { id: 'domainPart', description: 'Has a valid domain name part (after @)', passed: null },
  { id: 'tld', description: 'Domain has a valid Top-Level-Domain (e.g. .com, .org)', passed: null },
];

export const validateEmailFormat = (email: string): ValidationResult => {
  const checks = JSON.parse(JSON.stringify(initialChecks)) as ValidationCheck[];
  const errorMessages: string[] = [];

  if (!email) {
    return {
      isValid: false,
      checks: checks.map(c => ({ ...c, passed: false })),
      errorMessages: ['Email address cannot be empty.'],
    };
  }

  const check = (id: string, condition: boolean, errorMessage: string) => {
    const item = checks.find(c => c.id === id);
    if (item) {
      item.passed = condition;
      if (!condition) {
        errorMessages.push(errorMessage);
      }
    }
    return condition;
  };
  
  // Check 1: No leading/trailing spaces
  const hasNoSpaces = email.trim() === email;
  check('noSpaces', hasNoSpaces, 'Email should not have leading or trailing spaces.');
  const trimmedEmail = email.trim();

  // Check 2: '@' symbol presence
  const hasAtSymbol = trimmedEmail.includes('@');
  check('atSymbol', hasAtSymbol, "A valid email must contain an '@' symbol.");

  if(hasAtSymbol) {
    const parts = trimmedEmail.split('@');
    const hasSingleAt = parts.length === 2;
    if (!hasSingleAt) {
      check('atSymbol', false, "Email must contain exactly one '@' symbol.");
    }
    
    const [localPart, domainPart] = parts;
    
    // Check 3: Local part validation
    const localPartRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+$/;
    const isLocalPartValid = localPart.length > 0 && localPartRegex.test(localPart) && localPart[0] !== '.' && localPart[localPart.length - 1] !== '.' && !localPart.includes('..');
    check('localPart', isLocalPartValid, 'The username part of the email (before @) is invalid.');

    // Check 4: Domain part validation
    const isDomainPartValid = domainPart.length > 0 && domainPart.includes('.');
    check('domainPart', isDomainPartValid, 'The domain part of the email (after @) is invalid or missing a dot.');

    // Check 5: TLD validation
    if(isDomainPartValid) {
        const domainParts = domainPart.split('.');
        const tld = domainParts[domainParts.length - 1];
        const tldRegex = /^[a-zA-Z]{2,}$/;
        const isTldValid = tld.length > 1 && tldRegex.test(tld);
        check('tld', isTldValid, 'The Top-Level-Domain (e.g., .com) is invalid or too short.');
    } else {
        check('tld', false, 'Cannot check TLD because the domain part is invalid.');
    }
  } else {
    check('localPart', false, 'Cannot check username part without an @ symbol.');
    check('domainPart', false, 'Cannot check domain part without an @ symbol.');
    check('tld', false, 'Cannot check TLD without an @ symbol.');
  }

  // Final overall check
  const overallRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isOverallValid = overallRegex.test(trimmedEmail);
  check('format', isOverallValid, 'The email format does not match the standard pattern.');

  const finalIsValid = checks.every(c => c.passed);

  return {
    isValid: finalIsValid,
    checks,
    errorMessages,
  };
};
