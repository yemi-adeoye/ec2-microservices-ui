import { AbstractControl, ValidationErrors } from "@angular/forms";
import { PasswordDetails } from "../models/ValidPasswordDetails";

export const CustomValidators = {

  isValidPassword: (control: AbstractControl): ValidationErrors | null => {
    const passwordValidation: PasswordDetails = {
      hasRequiredLength: true,
      hasDigit: true,
      hasUpperCase: true,
      hasSpecialChars: true,
      hasLowerCase: true
    }
    const password = control.value
    const MIN_PASSWORD_CHAR_LENGTH: number = 6

    passwordValidation.hasDigit = password.search(/\d+/) == -1 ? true : false
    passwordValidation.hasLowerCase = password.search(/[a-z]+/) == -1 ? true : false
    passwordValidation.hasUpperCase = password.search(/[A-Z]+/) == -1 ? true : false
    passwordValidation.hasUpperCase = password.search(/[A-Z]+/) == -1 ? true : false
    passwordValidation.hasSpecialChars = password.search(/[^A-Za-z0-9\s]/) == -1 ? true : false
    passwordValidation['hasRequiredLength'] = password.length < MIN_PASSWORD_CHAR_LENGTH ? true : false

    // filter out values with only false because they no longer have errors
    const errors: any = {}

    for (let key of Object.keys(passwordValidation)) {
      if (passwordValidation[key]) {
        errors[key] = passwordValidation[key]
      }
    }

    return Object.keys(errors).length ? errors : null
  },

  noSpace: (control: AbstractControl): ValidationErrors | null => {
    const value = control.value

    return value.search(/\s/) == -1 ? null : { noSpace: true }
  }
}
