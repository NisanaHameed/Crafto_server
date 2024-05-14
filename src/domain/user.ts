interface User {
    _id?: string,
    name: string,
    email: string,
    mobile: string,
    city:string,
    password: string,
    following:Array<string>,
    isBlocked: boolean,
    image:string,
    savedPosts: Array<string>
}

export default User;