//Auth
export interface ILoginBody {
    email: string,
    password: string,
}
export interface IRegisterBody extends ILoginBody {
    name: string,
    username: string,
    gender: "male | female",
    birthdate: string,

}
//Article
export interface ISearchBody {

}