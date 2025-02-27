import z from "zod"

export const signupSchema = z.object({
    userName: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string()
})
export const signinSchema = z.object({
    userName: z.string(),
    password: z.string()
})