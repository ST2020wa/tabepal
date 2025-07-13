// src/utils/validation.ts
export interface ValidationResult {
    isValid: boolean
    error?: string
  }
  
  export const validateRequired = (value: string): ValidationResult => {
    if (!value || !value.trim()) {
      return {
        isValid: false,
        error: 'This field is required'
      }
    }
    return { isValid: true }
  }
  
  export const validateLength = (
    value: string, 
    minLength: number = 1, 
    maxLength: number = 100
  ): ValidationResult => {
    const trimmedValue = value.trim()
    
    if (trimmedValue.length < minLength) {
      return {
        isValid: false,
        error: `Minimum length is ${minLength} characters`
      }
    }
    
    if (trimmedValue.length > maxLength) {
      return {
        isValid: false,
        error: `Maximum length is ${maxLength} characters`
      }
    }
    
    return { isValid: true }
  }
  
  export const validateInput = (
    value: string,
    options: {
      required?: boolean
      minLength?: number
      maxLength?: number
    } = {}
  ): ValidationResult => {
    const { required = true, minLength = 1, maxLength = 100 } = options
    console.log(options.maxLength)
    if (required) {
      const requiredResult = validateRequired(value)
      if (!requiredResult.isValid) {
        return requiredResult
      }
    }
    
    const lengthResult = validateLength(value, minLength, maxLength)
    if (!lengthResult.isValid) {
      return lengthResult
    }
    
    return { isValid: true }
  }