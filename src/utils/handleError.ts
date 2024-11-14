import axios from "axios";

const handleError = (error) => {
    try {
        switch (error) {
            case (axios.isAxiosError(error)):
                return { message: "We're having trouble contacting the server right now", status: 500 };
            case (error instanceof Error):
                return {message: error.response.data.message, status: 500 };
            default:
                const redirect = error.response.data.message==="Unauthorized: Token verification failed" ? "/register" : ""
                return { message: error.response.data.message||"An unknown error occured", status: error.status, redirect };
        }
    } catch {
        return { message: "An unknown error occured", status: 500 };
    }
};

export default handleError;