import { PasswordRule } from "@/types/types";

/** Critères de robustesse du mot de passe (miroir de `IsStrongPassword` côté backend). */
export const PASSWORD_RULES: PasswordRule[] = [
    { id: "len", label: "Au moins 8 caractères", test: (v) => v.length >= 8 },
    { id: "upper", label: "Une majuscule (A-Z)", test: (v) => /[A-Z]/.test(v) },
    { id: "lower", label: "Une minuscule (a-z)", test: (v) => /[a-z]/.test(v) },
    { id: "digit", label: "Un chiffre (0-9)", test: (v) => /[0-9]/.test(v) },
    {
        id: "sym",
        label: "Un symbole (!?@#…)",
        test: (v) => /[^A-Za-z0-9]/.test(v),
    },
];

/** Nombre de critères satisfaits (0 à 5). */
export const passwordScore = (value: string): number =>
    PASSWORD_RULES.reduce((n, rule) => n + (rule.test(value) ? 1 : 0), 0);

/** Vrai si le mot de passe satisfait tous les critères. */
export const isPasswordStrong = (value: string): boolean =>
    passwordScore(value) === PASSWORD_RULES.length;
