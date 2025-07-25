import { User } from "../database/entities/user"
import { register } from "../services/auth-service"
import { Roles, UserRole } from "../types/types"

async function createAdmin() {
	const email = process.env.ADMIN_EMAIL
	const password = process.env.ADMIN_PASSWORD
	const userName = process.env.ADMIN_USERNAME
		? (process.env.ADMIN_ROLE as UserRole)
		: Roles.User

	// Verify environment variables
	if (!email) {
		console.error("❌ ADMIN_EMAIL is not defined.")
		return
	}
	if (!password) {
		console.error("❌ ADMIN_PASSWORD is not defined.")
		return
	}
	if (!userName) {
		console.error("❌ ADMIN_NAME is not defined.")
		return
	}

	try {
		// Verify if an admin exists in database
		const result = await User.find({
			where: { email },
			select: ["id", "email"], // Don't want to get hashedPassword
		})

		const existingAdmin = result[0]

		if (existingAdmin) {
			return
		}

		// Create an Admin user if doesn't exist in database
		const user = await register(
			email,
			password,
			userName,
			Roles.Admin
		)

		console.log(`✅ Admin user created: ${user.email}`)
	} catch (error) {
		console.error("❌ Failed to create admin user:", error)
	}
}

export { createAdmin }
