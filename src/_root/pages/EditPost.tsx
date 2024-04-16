import PostForm from '@/components/forms/PostForm'
import Loader from '@/components/share/Loader';
import { useGetPostById } from '@/lib/react-query/querisAndMotation';
import React from 'react'
import { useParams } from 'react-router'

const EditPost = () => {
  const {id}=useParams();
  const {data:post,isPending}=useGetPostById(id || '');
  if (isPending)
  return (
    <div className="flex-center w-full h-full">
      <Loader />
    </div>
  );
  return (
    <div className='flex flex-1 '>
      <div className='common-container flex-start gap-3 justify-start w-full '>
        <div className='max-w-5xl flex gap-3 '>
          <img src='/assets/icons/add-post.svg' width={36} height={36} alt='add' />
          <h2 className='h3-bold md:h2-bold text-left w-full'>Edit Post</h2>
        </div>
        <PostForm  action="update" post={post} />
      </div>
    </div>
  )
}

export default EditPost