import * as z from "zod"

export const signupValidation = z.object({
    name:z.string().min(2,{message:'Too Short'}),
    username: z.string().min(2).max(50),
    email:z.string().email(),
    password:z.string().min(8,{message:'Too short'})
})
export const signinValidation = z.object({
    email:z.string().email(),
    password:z.string().min(8,{message:'Too short'})
})

export const PostValidation = z.object({
    caption: z.string().min(5, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
    file: z.custom<File[]>(),
    location: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 1000 characters." }),
    tags: z.string(),
  });
  // ============================================================
// profile
// ============================================================
export const ProfileValidation = z.object({
    file: z.custom<File[]>(),
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    username: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email(),
    bio: z.string(),
  });



