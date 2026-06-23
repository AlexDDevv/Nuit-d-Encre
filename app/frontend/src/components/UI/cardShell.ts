/**
 * Coque commune aux cartes cliquables du catalogue (livre, auteur).
 * Bordure discrète qui s'illumine en doré au survol, léger scale, ombre portée
 * et anneau de focus visible doré - fidèle au langage visuel « Nuit d'Encre ».
 *
 * Chaque carte compose cette base avec sa mise en page propre via `cn()`.
 */
export const interactiveCardShell =
    "group bg-card border-border focus-visible:ring-ring focus-visible:ring-offset-background relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-200 ease-out hover:scale-[1.03] hover:border-primary/55 hover:shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
