export interface ILoginData {
    email: string;
    password: string;
};
export interface IRegisterData {
    username: string,
    password: string,
    email: string,
    topics?: Array<string>
}