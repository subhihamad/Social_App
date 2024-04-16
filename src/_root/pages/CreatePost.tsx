import PostForm from '@/components/forms/PostForm'
import React from 'react'

const CreatePost = () => {
  return (
    <div className='flex flex-1 '>
      <div className='common-container flex-start gap-3 justify-start w-full '>
        <div className='max-w-5xl flex gap-3 '>
          <img src='/assets/icons/add-post.svg' width={36} height={36} alt='add' />
          <h2 className='h3-bold md:h2-bold text-left w-full'>Create Post</h2>
        </div>
        <PostForm action='create'  />
      </div>
    </div>
  )
}

export default CreatePost