export interface PasswordDetails {
  [hasRequiredLength: string]: boolean,
  hasDigit: boolean,
  hasUpperCase: boolean,
  hasSpecialChars: boolean,
  hasLowerCase: boolean,
}
