import { Request } from "express";

export interface RequestI extends Request{
    user?:UserI
}

interface UserI{
    id: number,
    auth_id: string | null,
    username: string | null
}

interface PhoneNumberI{
    id: number,
    number: string,
    account_id?: number,
}