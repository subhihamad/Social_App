import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignoutAccount } from '@/lib/react-query/querisAndMotation'
import { useuserContext } from '@/context/AuthContext'
const TopBar = () => {
   const {mutate:signOut,isSuccess}=useSignoutAccount();
   const navigate=useNavigate();
   const {user}=useuserContext();
   useEffect(()=>{
    if(isSuccess) navigate(0);
   },[isSuccess])

  return (
    <section className='topbar'>
        <div className='flex-between py-4 px-5 '>
            <Link to='/' className='gap-3 flex items-center '>
                <img src='/assets/images/logo.svg' alt='logo' width={130} height={325}/>
            </Link>
            <div className='flex items-center gap-4'>
                <Button variant='ghost' onClick={()=>signOut()} className='shad-button_ghost items-center'>
                    <img src='/assets/icons/logout.svg' alt='logout' />
                </Button>
                <Link to={`/profile/${user.id}`} className='flex-center gap-3'>
                    <img src={user.imageUrl || '/assets/icons/profile-placeholder.svg'} alt='profile'
                    className='h-8 w-8 rounded-full'
                    />
                </Link>
            </div> 
        </div>
    </section>
  )
}

export default TopBar