import type { WorkoutProgram } from "$lib/schema";

export async function load({ parent }) {
    let parentData = await parent();

    return {
        userPrograms: parentData.userPrograms,
    }
}