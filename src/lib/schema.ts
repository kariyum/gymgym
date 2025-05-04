export interface UserProgram {
    id?: number,
    title: string,
    exercices: Exercice[],
}


export interface WorkoutProgram {
    day: Date,
    exercices: Exercice[],
}

export interface Exercice {
    title: string,
    muscle_groups: string[],
    repset: Repset[],
    average_weight?: number,
    weight_per_set?: WeightPerSet[],
}

export interface Repset {
    reps: string,
    sets: string
}

export interface WeightPerSet {
    set_index: number,
    weight: number,
}
