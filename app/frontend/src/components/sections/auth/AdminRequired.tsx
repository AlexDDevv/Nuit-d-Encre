/**
 * @fileoverview Admin role required component that displays when a user try to access to admin panel
 * @module AdminRequired
 */

import { Lock } from "lucide-react";
import { Button } from "@/components/UI/Button";

/**
 * AdminRequired Component
 *
 * Displays a message when a simple user try to acces to admin panel.
 * Provides a link to return to the home page.
 *
 * @component
 * @returns {JSX.Element} The rendered AdminRequired component
 */
export default function AdminRequired() {
	return (
		<div className="mx-auto flex max-w-md items-center justify-center">
			<div className="bg-card border-border flex w-full flex-col gap-6 rounded-xl border p-8 text-center">
				<div className="flex justify-center">
					<Lock className="text-card-foreground h-12 w-12" />
				</div>
				<div className="flex flex-col gap-2">
					<h1 className="text-card-foreground text-2xl font-bold">
						Accès refusé
					</h1>
					<p className="text-card-foreground">
						Vous ne disposez pas des droits administrateur pour accéder à
						cette page.
					</p>
				</div>
				<nav className="flex items-center justify-center">
					<Button
						to="/books"
						ariaLabel="Retourner à la page d'accueil"
						role="link"
					>
						Retour à l'accueil
					</Button>
				</nav>
			</div>
		</div>
	);
}
