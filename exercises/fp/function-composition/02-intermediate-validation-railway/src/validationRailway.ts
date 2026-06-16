// exercises/fp/function-composition/02-intermediate-validation-railway/src/validationRailway.ts
import { type Result, err, flatMap, ok } from '../../../lib/result';

export interface FormInput {
  readonly name: string;
  readonly email: string;
  readonly age: number;
  readonly promoCode?: string;
}

export interface ValidatedForm {
  readonly name: string;
  readonly email: string;
  readonly age: number;
  readonly tier: 'standard' | 'loyal';
}

const validateName = (input: FormInput): Result<FormInput, string[]> =>
  input.name.trim().length >= 2 ? ok(input) : err(['name too short']);

const validateEmail = (input: FormInput): Result<FormInput, string[]> =>
  input.email.includes('@') ? ok(input) : err(['bad email']);

const validateAge = (input: FormInput): Result<FormInput, string[]> =>
  input.age >= 18 && input.age <= 120 ? ok(input) : err(['age out of range']);

const normalizeForm = (input: FormInput): FormInput => ({
  ...input,
  name: input.name.trim(),
  email: input.email.toLowerCase(),
});

const normalizeFormResult = (input: FormInput): Result<FormInput, string[]> =>
  ok(normalizeForm(input));

const enrichLoyaltyTier = (input: FormInput): Result<ValidatedForm, string[]> =>
  ok({
    name: input.name,
    email: input.email,
    age: input.age,
    tier: input.promoCode === 'LOYAL' ? 'loyal' : 'standard',
  });

export const processForm = (input: FormInput): Result<ValidatedForm, string[]> => {
  const afterName = validateName(input);
  const afterEmail = flatMap(validateEmail)(afterName);
  const afterAge = flatMap(validateAge)(afterEmail);
  const afterNormalize = flatMap(normalizeFormResult)(afterAge);
  return flatMap(enrichLoyaltyTier)(afterNormalize);
};
