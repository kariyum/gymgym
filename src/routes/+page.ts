import { Database, userProgamsRepo } from "$lib/db";

export interface WorkoutProgram {
    day: Date,
    exercices: Exercice[],
}

export interface Exercice {
    title: string,
    muscle_groups: string[],
    reps: string, // can be inf
    sets: string, // can be inf
    average_weight?: number,
    weight_per_set?: WeightPerSet[],
}

export interface WeightPerSet {
    set_number: number,
    weight: number,
}

export async function load() {
    const response: WorkoutProgram[] = [
        {
            day: new Date(),
            exercices: [
                {
                    title: "Bench Press",
                    muscle_groups: [],
                    reps: "12",
                    sets: "4",
                },
                {
                    title: "Incline Bench Press",
                    muscle_groups: [],
                    reps: "12",
                    sets: "4",
                },
                {
                    title: "Biceps",
                    muscle_groups: [],
                    reps: "12",
                    sets: "4",
                }
            ]
        }
    ]
    const db = (await Database.getInstance()).db;
    return {
        userPrograms: db ? await userProgamsRepo.getAllUserPrograms(db) : [],
        data: response,
        exercises: [
            {
                "title": "Barbell Bench Press",
                "muscle_groups": ["chest", "triceps", "front delts"],
                "reps": 8,
                "sets": 4,
                "average_weight": 165,
                "weight_per_set": [
                    { "set": 1, "weight": 155 },
                    { "set": 2, "weight": 165 },
                    { "set": 3, "weight": 170 },
                    { "set": 4, "weight": 160 }
                ]
            },
            {
                "title": "Squat",
                "muscle_groups": ["quadriceps", "glutes", "hamstrings", "core"],
                "reps": 6,
                "sets": 4,
                "average_weight": 225,
                "weight_per_set": [
                    { "set": 1, "weight": 205 },
                    { "set": 2, "weight": 225 },
                    { "set": 3, "weight": 235 },
                    { "set": 4, "weight": 225 }
                ]
            },
            {
                "title": "Deadlift",
                "muscle_groups": ["hamstrings", "glutes", "lower back", "traps"],
                "reps": 5,
                "sets": 3,
                "average_weight": 275
            },
            {
                "title": "Overhead Press",
                "muscle_groups": ["shoulders", "triceps", "upper chest"],
                "reps": 8,
                "sets": 3,
                "average_weight": 95
            },
            {
                "title": "Pull-ups",
                "muscle_groups": ["lats", "biceps", "rear delts", "upper back"],
                "reps": 10,
                "sets": 3
            },
            {
                "title": "Dumbbell Bicep Curl",
                "muscle_groups": ["biceps"],
                "reps": 12,
                "sets": 3,
                "average_weight": 30,
                "weight_per_set": [
                    { "set": 1, "weight": 25 },
                    { "set": 2, "weight": 30 },
                    { "set": 3, "weight": 30 }
                ]
            },
            {
                "title": "Tricep Rope Pushdown",
                "muscle_groups": ["triceps"],
                "reps": 15,
                "sets": 3,
                "average_weight": 50
            },
            {
                "title": "Lat Pulldown",
                "muscle_groups": ["lats", "biceps", "upper back"],
                "reps": 10,
                "sets": 3,
                "average_weight": 120
            },
            {
                "title": "Leg Press",
                "muscle_groups": ["quadriceps", "glutes", "hamstrings"],
                "reps": 12,
                "sets": 4,
                "average_weight": 360
            },
            {
                "title": "Romanian Deadlift",
                "muscle_groups": ["hamstrings", "glutes", "lower back"],
                "reps": 8,
                "sets": 3,
                "average_weight": 185
            },
            {
                "title": "Incline Dumbbell Press",
                "muscle_groups": ["upper chest", "front delts", "triceps"],
                "reps": 10,
                "sets": 3,
                "average_weight": 55
            },
            {
                "title": "Seated Cable Row",
                "muscle_groups": ["middle back", "lats", "biceps"],
                "reps": 12,
                "sets": 3,
                "average_weight": 130
            },
            {
                "title": "Lateral Raises",
                "muscle_groups": ["side delts"],
                "reps": 15,
                "sets": 3,
                "average_weight": 15
            },
            {
                "title": "Face Pulls",
                "muscle_groups": ["rear delts", "upper back", "rotator cuff"],
                "reps": 15,
                "sets": 3,
                "average_weight": 40
            },
            {
                "title": "Hanging Leg Raises",
                "muscle_groups": ["abs", "hip flexors"],
                "reps": 12,
                "sets": 3
            },
            {
                "title": "Barbell Hip Thrust",
                "muscle_groups": ["glutes", "hamstrings"],
                "reps": 10,
                "sets": 3,
                "average_weight": 185
            },
            {
                "title": "Calf Raises",
                "muscle_groups": ["calves"],
                "reps": 20,
                "sets": 3,
                "average_weight": 90
            },
            {
                "title": "Hammer Curls",
                "muscle_groups": ["brachialis", "biceps", "forearms"],
                "reps": 12,
                "sets": 3,
                "average_weight": 25
            },
            {
                "title": "Skull Crushers",
                "muscle_groups": ["triceps"],
                "reps": 10,
                "sets": 3,
                "average_weight": 40
            },
            {
                "title": "Bulgarian Split Squats",
                "muscle_groups": ["quadriceps", "glutes", "hamstrings"],
                "reps": 8,
                "sets": 3,
                "average_weight": 35
            },
            {
                "title": "Barbell Row",
                "muscle_groups": ["lats", "middle back", "biceps"],
                "reps": 8,
                "sets": 3,
                "average_weight": 135
            },
            {
                "title": "Dips",
                "muscle_groups": ["chest", "triceps", "front delts"],
                "reps": 10,
                "sets": 3
            }
        ]
    }
}