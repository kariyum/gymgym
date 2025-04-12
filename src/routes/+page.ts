
export interface WorkoutDay {
    day: Date,
    exercices: Exercice[],
}

export interface Exercice {
    name: string,
    reps: number,
    sets: number,
    average_weight?: number,
    weight_per_set?: WeightPerSet[],
}

export interface WeightPerSet {
    set_number: number,
    weight: number,
}

export async function load() {
    const response: WorkoutDay[] = [
        {  
            day: new Date(),
            exercices: [
                {
                    name: "Bench Press",
                    reps: 12,
                    sets: 4,
                },
                {
                    name: "Incline Bench Press",
                    reps: 12,
                    sets: 4,
                },
                {
                    name: "Biceps",
                    reps: 12,
                    sets: 4,
                }
            ]
        }
    ]
    return {
        data: response
    }
}