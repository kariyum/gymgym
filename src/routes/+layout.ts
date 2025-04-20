export const ssr = false;

import { Database, userProgamsRepo } from "$lib/db";
import { exercices } from "$lib/exercices";

export const load = async () => {
    const db = (await Database.getInstance()).db;
    return {
        exercices: exercices,
        userPrograms: db ? await userProgamsRepo.getAllUserPrograms(db) : [],
    }
}