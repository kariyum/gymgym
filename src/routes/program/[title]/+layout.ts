export const load = async ({ params, parent }) => {
    const title = params.title;
    const data = await parent();

    return {
        userProgram: data.userPrograms.find((up) => up.title === title)
    }
}