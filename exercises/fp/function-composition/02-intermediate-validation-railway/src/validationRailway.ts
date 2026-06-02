// exercises/fp/function-composition/02-intermediate-validation-railway/src/validationRailway.ts
// STARTER — mutable error bag + early returns for multi-stage form.

import { type Result, err, isOk, ok } from '../../../lib/result';

export interface FormInput {
  name: string;
  email: string;
  age: number;
  promoCode?: string;
}

export interface ValidatedForm {
  name: string;
  email: string;
  age: number;
  tier: 'standard' | 'loyal';
}

export function processForm(input: FormInput): Result<ValidatedForm, string[]> {
  const errors: string[] = [];

  if (!input.name || input.name.trim().length < 2) errors.push('name too short');
  if (!input.email.includes('@')) errors.push('bad email');
  if (input.age < 18 || input.age > 120) errors.push('age out of range');

  if (errors.length > 0) return err(errors);

  let tier: 'standard' | 'loyal' = 'standard';
  if (input.promoCode === 'LOYAL') tier = 'loyal';

  return ok({
    name: input.name.trim(),
    email: input.email.toLowerCase(),
    age: input.age,
    tier,
  });
}
