import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { CreateUserBookInput } from "../inputs/create/user/create-user-book-input";

/**
 * Class-level helper: ensure finishedAt >= startedAt (when both are provided)
 */
@ValidatorConstraint({ name: "endAfterStart", async: false })
export class EndAfterStart implements ValidatorConstraintInterface {
  validate(finishedAt: Date | undefined, args: ValidationArguments): boolean {
    const obj = args.object as CreateUserBookInput;
    if (!finishedAt || !obj.startedAt) return true; // ok if one is missing
    return finishedAt.getTime() >= obj.startedAt.getTime();
  }
  defaultMessage(): string {
    return "finishedAt must be greater than or equal to startedAt.";
  }
}