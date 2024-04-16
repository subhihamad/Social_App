import { getCurrentUser } from '@/lib/appwrite/api';
import { IContextType, IUser } from '@/types';
import React from 'react'
import { createContext,useContext ,useEffect,useState} from 'react'
import { useNavigate } from 'react-router';

export const INITIAL_USER = {
    id: "",
    name: "",
    username: "",
    email: "",
    imageUrl: "",
    bio: "",
  };
  
  const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false as boolean ,
  };
  

const UserContext =createContext<IContextType>(INITIAL_STATE);
    const AuthProvider = ({children}:{children:React.ReactNode}) => {

    const navigate = useNavigate();
    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const checkAuthUser=async()=>{
        try {
            setIsLoading(true);
            const currentAccount=await getCurrentUser();
            if(currentAccount){
              setUser({
                id:currentAccount.$id,
                name:currentAccount.name,
                username:currentAccount.username,
                email:currentAccount.email,
                imageUrl:currentAccount.imageUrl,
                bio:currentAccount.bio
              })
              setIsAuthenticated(true);

              return true;
            }
        } catch (error) {
            console.log(error);
            return false
        }finally{
            setIsLoading(false);
        }
    };

    useEffect(()=>{
      const cookieFallback = localStorage.getItem("cookieFallback");
      if (
        cookieFallback === "[]" ||
        cookieFallback === null ||
        cookieFallback === undefined
      ) {
          navigate("/sign-in");
      }
      else{
        navigate("/");
      }
      checkAuthUser();
    },[])

  return (
    <UserContext.Provider value={
      {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser,
      }
    }>
      {children}
    </UserContext.Provider>
  )
}

export default AuthProvider

export const useuserContext=()=>useContext(UserContext);