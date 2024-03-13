interface User {
    id?: string,
    name: string,
    email: string,
    mobile: number,
    city:string,
    password: string,
    following:Array<string>,
    isBlocked: boolean
}

export default User;