interface User {
    _id?: string,
    name: string,
    email: string,
    mobile: number,
    city:string,
    password: string,
    following:Array<string>,
    isBlocked: boolean,
    image:string
}

export default User;