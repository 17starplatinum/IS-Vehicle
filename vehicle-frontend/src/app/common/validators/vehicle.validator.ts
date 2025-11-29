import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function positiveNumber(minExclusive = 0): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (control.value == null || control.value === '') return null;
        const v = Number(control.value);
        if (isNaN(v) || v <= minExclusive) {
            return { 
                positiveNumber: { 
                    requiredGreaterThan: minExclusive, 
                    actual: control.value 
                } 
            };
        }
        return null;
    };
}

export function nonEmptyTrim(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value == null) return { required: true };
    if (typeof control.value !== 'string') return null;
    return control.value.trim().length === 0 ? { nonEmptyTrim: true } : null;
  };
}

export function optionalPositive(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const val = control.value;
    if (val === null || val === undefined || val === '') return null;
    const n = Number(val);
    if (isNaN(n) || n <= 0) return { optionalPositive: true };
    return null;
  };
}

