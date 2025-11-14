
export interface ValidationCheck {
  id: string;
  description: string;
  passed: boolean | null;
}

export interface ValidationResult {
  isValid: boolean;
  checks: ValidationCheck[];
  errorMessages: string[];
}
