export const load = async ({ params, parent }) => {
    const id = parseInt(params.id);
    const data = await parent();

    return {
        userProgram: data.userPrograms.find((up) => up.id === id)
    }
}