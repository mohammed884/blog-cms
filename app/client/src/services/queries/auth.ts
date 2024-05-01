import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { login, register } from "../api/auth";
import { IRegisterData, ILoginData } from "../types/auth";
import { USER_QUERY_KEY } from "../keys";
interface ILoginErrorBody {
    response: {
        data: {
            success: boolean,
            isLoggedIn: boolean,
            message: string
        }
    }
};
interface IRegisterErrorBody {
    response: {
        data: {
            success: boolean,
            isLoggedIn: boolean,
            message: string,
            usedEmail: boolean,
            usedUsername: boolean
        }
    }
}
export const useLoginMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<{ success: boolean, username: string; }, ILoginErrorBody, ILoginData>({
        mutationFn: (data) => login(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY, { username: "profile" }] });
        },
        // onSuccess: (data) => {
        //     const navigate = useNavigate();
        //     navigate(`/user/${data.username}`)
        // },
    })
};
export const useRegisterMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<{ success: boolean, username: string; }, IRegisterErrorBody, IRegisterData>({
        mutationFn: (data) => register(data),
        onMutate: () => {
            queryClient.invalidateQueries({ queryKey: ["user", { username: "profile" }] });
        },
        onSuccess: (data) => {
            const navigate = useNavigate();
            navigate(`/user/${data.username}`)
        },
    })
}