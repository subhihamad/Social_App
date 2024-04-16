import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { useQuery, useMutation,useQueryClient,useInfiniteQuery } from "@tanstack/react-query";
import { createPost, createUserAccount, deletePost, deleteSavedPost, getAllUsers, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, getUserById, likePost, savePost, searchPosts, signInAccount, signoutAccount, updatePost, updateUser } from "../appwrite/api";
import { QUERY_KEYS } from "./queryKeys";

export const useCreateUserAccount=()=>{
    return useMutation({
        mutationFn:(user:INewUser)=>createUserAccount(user),
    })
}

export const useSignInAccount=()=>{
    return useMutation({
        mutationFn:(user:{email:string;password:string})=>signInAccount(user),
    })
}

export const useSignoutAccount=()=>{
    return useMutation({
        mutationFn:()=>signoutAccount(),
    })
}

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (post: INewPost) => createPost(post),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
      },
    });
  };

  export const useGetRecentPosts = () => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      queryFn: getRecentPosts,
    });
  };

  export const useLikePost=()=>{
    const queryClient=useQueryClient();
    return useMutation({
      mutationFn:({postId,likesArray}:{postId:string;likesArray:string[]})=>likePost(postId,likesArray),
      onSuccess:(data)=>{
        queryClient.invalidateQueries({
          queryKey:[QUERY_KEYS.GET_POST_BY_ID,data?.$id],
        })
        queryClient.invalidateQueries({
          queryKey:[QUERY_KEYS.GET_RECENT_POSTS],
        })
        queryClient.invalidateQueries({
          queryKey:[QUERY_KEYS.GET_POSTS],
        })
        queryClient.invalidateQueries({
          queryKey:[QUERY_KEYS.GET_CURRENT_USER],
        })
      }
    })
  }

  export const useSavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
        savePost(userId, postId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
      },
    });
  };

  export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

  export const useGetCurrentUser=()=>{
    return useQuery({
      queryFn:getCurrentUser,
      queryKey:[QUERY_KEYS.GET_CURRENT_USER] 
    })
  }

  export const useGetPostById=(postId:string)=>{
    return useQuery({
      queryKey:[QUERY_KEYS.GET_POST_BY_ID],
      queryFn:()=>getPostById(postId),
      enabled:!!postId,
    })
  }

  export const useUpdatePost=()=>{
    const queryClient=useQueryClient();
    return useMutation({
      mutationFn:(post:IUpdatePost)=>updatePost(post),
      onSuccess:(data)=>{
        queryClient.invalidateQueries({
          queryKey:[QUERY_KEYS.GET_POST_BY_ID , data?.$id]
        })
      }
    })
  }

  export const useDeletePost=()=>{
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn:({postId,imageId}:{postId:string,imageId:string})=>deletePost(postId,imageId),
      onSuccess:()=>{
        queryClient.invalidateQueries({
          queryKey:[QUERY_KEYS.GET_RECENT_POSTS],
        })
      }
    })
  }

export const useGetInfinitePosts=()=>{
  return useQuery({
    queryKey:[QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn:getInfinitePosts,
    getnextPageParam:(lastPage:any)=>{
      if(lastPage && lastPage.documents.length === 0) return null;
      const lastId=lastPage.documents[lastPage.documents.length-1].$id;
      return lastId;
    },

  })
}


export const useSearchPosts=(searchTerm:string)=>{
  return useQuery({
    queryKey:[QUERY_KEYS.SEARCH_POSTS,searchTerm],
    queryFn:()=>searchPosts(searchTerm),
    enabled:!!searchTerm,
  })
}
export const useGetAllUsers=()=>{
  return useQuery({
    queryKey:[QUERY_KEYS.GET_USERS],
    queryFn:getAllUsers
  })
}

export const useGetUserById=(userId:string)=>{
  return useQuery({
    queryKey:[QUERY_KEYS.GET_USER_BY_ID],
    queryFn:()=>getUserById(userId),
    enabled:!!userId,
  })
}
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
    },
  });
};