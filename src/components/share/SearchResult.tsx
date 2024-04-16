import { Models } from 'appwrite';
import React from 'react'
import Loader from './Loader';
import GridPostList from './GridPostList';
import GridPostListSearch from './GridPostListSearch';
type props={
  isSearchFetching:boolean;
  searchPosts:Models.DocumentList<Models.Document> | undefined | Models.Document
}

const SearchResult = ({isSearchFetching,searchPosts}:props) => {
  if(isSearchFetching){
    return(
      <div className='w-full h-full flex-center'>
        <Loader />
      </div>
    )
  }
  if(searchPosts && searchPosts.documents.length > 0){
    return(
      <GridPostListSearch posts={searchPosts.documents} showUser={true} showState={true}  />
    )
  }
  return (
    <p className='text-light-4 mt-10 text-center w-full'>No Results found</p>
  )
}

export default SearchResult