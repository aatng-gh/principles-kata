// Reference good implementation — railway-oriented validation via composed Result stages.
// Why this design: each validate* stage is independent pure fn returning Result. Composition at top
// level via flatMap chains (or a small sequence helper) makes the happy-path linear and explicit.
// New validation rule = one new fn + one .flatMap(link) ; existing stages and error types untouched.
// No mutable bags, short-circuits on first error, side effects (if any) pushed to shell. Uses the
// shared lib/result so no per-exercise reimplementation.

import { type Result, err, flatMap, ok } from '../../../lib/result';

export interface FormInput {
  readonly name: string;
  readonly email: string;
  readonly age: number;
  readonly promoCode?: string;
}

export interface ValidForm {
  readonly name: string;
  readonly email: string;
  readonly age: number;
  readonly promoCode?: string;
  readonly normalizedEmail: string;
}

export function validateName(input: FormInput): Result<FormInput, string> {
  if (!input.name || input.name.trim().length < 2) {
    return err('name must be at least 2 chars');
  }
  return ok(input);
}

export function validateEmail(input: FormInput): Result<FormInput, string> {
  if (!input.email || !input.email.includes('@')) {
    return err('email must contain @');
  }
  return ok(input);
}

export function validateAge(input: FormInput): Result<FormInput, string> {
  if (typeof input.age !== 'number' || input.age < 18 || input.age > 120) {
    return err('age must be 18-120');
  }
  return ok(input);
}

export function normalize(input: FormInput): ValidForm {
  return {
    name: input.name.trim(),
    email: input.email,
    age: input.age,
    promoCode: input.promoCode,
    normalizedEmail: input.email.trim().toLowerCase(),
  };
}

export function checkPromo(form: ValidForm): Result<ValidForm, string> {
  if (form.promoCode === 'BANNED') {
    return err('promo code no longer valid');
  }
  return ok(form);
}

export function processRegistration(input: FormInput): Result<ValidForm, string> {
  // Pure flatMap composition (railway short-circuits automatically)
  return flatMap((afterAge: FormInput) => checkPromo(normalize(afterAge)))(
    flatMap(validateAge)(flatMap(validateEmail)(validateName(input)))
  );
}
