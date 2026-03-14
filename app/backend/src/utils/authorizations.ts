import { Context, Roles } from "../types/types"

/**
 * Checks if the current user is either the owner of the resource or has admin role.
 *
 * @param ownerId - The user ID of the resource owner.
 * @param currentUser - The currently authenticated user from the GraphQL context.
 *
 * @returns `true` if the current user is the owner or has an admin role; otherwise `false`.
 *
 * @example
 * ```ts
 * const isAuthorized = isOwnerOrAdmin(book.user.id, context.user)
 * if (!isAuthorized) {
 *   throw new AppError("Not authorized", 403, "ForbiddenError")
 * }
 * ```
 */
export function isOwnerOrAdmin(
	ownerId: number,
	currentUser: Context["user"]
): boolean {
	if (!currentUser) return false
	return ownerId === currentUser.id || currentUser.role === Roles.Admin
}
