export const nextErrorHandler = (error: unknown) => {
    console.log(error)
    if (error instanceof Error) {
        if (error.message.includes("Unique constraint failed")) {
            return { message: "Email already exists", status: 400 };
        }
        return { message: error.message, status: 500 };
    }
    return { message: 'An unknown error occurred', status: 500 };
}