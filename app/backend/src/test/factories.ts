import { User } from "../database/entities/user/user";
import { Context, Roles, UserRole } from "../types/types";

/** Utilisateur en mémoire pour les tests unitaires (jamais persisté). */
export function makeUser(id: string, role: UserRole = Roles.User): User {
    const user = new User();
    user.id = id;
    user.role = role;
    user.userName = id;
    user.xp = 0;
    user.level = 1;
    return user;
}

/** Contexte GraphQL minimal : seuls `user` et `cookies` sont exploités par les resolvers testés. */
export function makeContext(user: User | null): Context {
    return {
        user,
        ip: "127.0.0.1",
        cookies: { get: jest.fn(), set: jest.fn() },
        loaders: {},
    } as unknown as Context;
}

/** Remplace `save`/`remove` d'une entité TypeORM par des no-op qui renvoient l'instance. */
export function stubPersistence(entityClass: {
    prototype: { save: unknown; remove: unknown };
}) {
    const save = jest
        .spyOn(entityClass.prototype as { save: () => Promise<unknown> }, "save")
        .mockImplementation(async function (this: unknown) {
            return this;
        });
    const remove = jest
        .spyOn(entityClass.prototype as { remove: () => Promise<unknown> }, "remove")
        .mockImplementation(async function (this: unknown) {
            return this;
        });
    return { save, remove };
}
