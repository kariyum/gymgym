import type { Exercice } from "../routes/+page";

export interface UserProgram {
    title: string,
    exercices: Exercice[],
}