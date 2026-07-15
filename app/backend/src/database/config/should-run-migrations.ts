/**
 * Auto-run des migrations TypeORM au démarrage.
 *
 * Actif par défaut (dev comme prod). En prod on tourne en instance unique sur
 * CapRover : pas de course multi-instances, et un échec de migration doit faire
 * échouer le boot bruyamment plutôt que de démarrer sur un schéma incohérent.
 * Poser DB_MIGRATIONS_RUN="false" pour désactiver (deploy manuel, debug).
 */
export function shouldRunMigrations(flag: string | undefined): boolean {
    return flag !== "false";
}
