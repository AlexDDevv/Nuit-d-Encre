import { isStrongPassword } from "class-validator";

/** Politique de mot de passe commune à l'inscription et au changement de mot de passe. */
export const STRONG_PASSWORD_OPTIONS = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
};

export const PASSWORD_MAX_LENGTH = 255;

export const isPasswordCompliant = (password: string): boolean =>
    password.length <= PASSWORD_MAX_LENGTH &&
    isStrongPassword(password, STRONG_PASSWORD_OPTIONS);
