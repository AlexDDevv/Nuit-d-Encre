import { PaginationProps } from "@/types/types"
import {
	PaginationContainer,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "./PaginationContainer"

export default function Pagination({
	currentPage,
	totalCount,
	perPage,
	onPageChange,
	className,
}: PaginationProps) {
	const totalPages = Math.ceil(totalCount / perPage)

	if (totalPages <= 1) return null

	const goToPage = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			onPageChange(page)
		}
	}

	// Fenêtre glissante de 3 pages autour de la page courante (5 boutons avec
	// Précédent/Suivant) : au-delà, la barre déborde en largeur sur mobile.
	const paginationRange = () => {
		const start = Math.max(1, Math.min(currentPage - 1, totalPages - 2))
		const end = Math.min(totalPages, start + 2)
		const pages: number[] = []

		for (let i = start; i <= end; i++) pages.push(i)

		return pages
	}

	const pages = paginationRange()

	return (
		<PaginationContainer className={className}>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href="#"
						onClick={() => goToPage(currentPage - 1)}
						aria-disabled={currentPage === 1}
					/>
				</PaginationItem>
				{pages.map(page => (
					<PaginationItem key={page}>
						<PaginationLink
							href="#"
							isActive={page === currentPage}
							onClick={e => {
								e.preventDefault()
								goToPage(page)
							}}
						>
							{page}
						</PaginationLink>
					</PaginationItem>
				))}
				<PaginationItem>
					<PaginationNext
						href="#"
						onClick={() => goToPage(currentPage + 1)}
						aria-disabled={currentPage === totalPages}
					/>
				</PaginationItem>
			</PaginationContent>
		</PaginationContainer>
	)
}
