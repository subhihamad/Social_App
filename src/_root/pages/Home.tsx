import Loader from '@/components/share/Loader';
import PostCard from '@/components/share/PostCard';
import { useGetRecentPosts } from '@/lib/react-query/querisAndMotation';
import { Models } from 'appwrite';
import React from 'react'

const Home = () => {
  const {data:posts , isPending:isPosting , isError:isErrorPost}=useGetRecentPosts()
  return (
    <div className='flex flex-1'>
      <div className='home-container'>
        <div className='home-posts'>
          <h2 className='h3-bold md:h2-bold text-left w-full'>
            Home Feed
            {isPosting && !posts ? (
              <Loader />
            ):(
              <ul className='flex flex-col w-full flex-1 gap-9'>
                {posts?.documents.map((post:Models.Document)=>(
                  <PostCard key={post.$id} post={post} />
                ))}
              </ul>
            )}
          </h2>
        </div>
      </div>
    </div>
  )
}

export default Home