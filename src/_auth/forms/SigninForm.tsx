import { Button } from '@/components/ui/button'
import React from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signinValidation} from '@/lib/validation'
import { useToast } from "@/components/ui/use-toast"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from 'zod'
import Loader from '@/components/share/Loader'
import { Link,useNavigate } from 'react-router-dom'
import { useSignInAccount } from '@/lib/react-query/querisAndMotation'
import { useuserContext } from '@/context/AuthContext'


const SigninForm = () => {
    const { toast } = useToast()
    const navigate=useNavigate();
    const {mutateAsync:signInAccount ,isPending:isSigningIn}=useSignInAccount();
    const {checkAuthUser,isLoading:isUserLoading}=useuserContext();
    // 1. Define your form.
    const form = useForm<z.infer<typeof signinValidation>>({
      resolver: zodResolver(signinValidation),
      defaultValues: {
        email:'',
        password:''
      },
    })
    // 2. Define a submit handler.
 async function onSubmit(values: z.infer<typeof signinValidation>) {

    const session=await signInAccount({email:values.email,password:values.password});

    if(!session){
      return toast({
        title:"Signin failed.Please Try again",
        description:"Check your credentials and try again."
        });
    }

    const isLoggedin=await checkAuthUser();
    if(isLoggedin){
      form.reset();
      navigate('/');
    }else{
      return toast({
        title: "Sign up failed.Please Try again",
      })
    }

    
  }
  return (
     <Form {...form}>
      <div className='sm:w-420 flex-center flex-col'>
        <img src='/assets/images/logo.svg' alt='logo' />
        <h2 className='h3-bold md:h2-bold pt-5'>
          Log in to your Account
        </h2>
        <p className='text-light-3 small-medium md:base-regular mt-2 '>
          Welcome back ,please enter your details
        </p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input type='email' className='shad-input' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input type='password' className='shad-input' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='shad-button-primary' type="submit">
            {isSigningIn ? (
              <div className='flex-center gap-2'>
              <Loader /> Loading...
              </div>
            ):(
              "Sign in"
            )}
        </Button>
        <p className='text-small-regular text-light-2 text-center mt-2'>
          Dont have an account? {" "} 
          <Link to="/sign-up" className='text-primary text-purple-500 text-small-semibold ml-1'>
            Sign up
          </Link>
        </p>
      </form>
      </div>
    </Form>
  )
}

export default SigninForm