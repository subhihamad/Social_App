import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, avatars, configAppwrite, databases, storage } from "./config";
import { ID, Query } from "appwrite";



export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );
    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    const newUser=await saveToDB({
        accountId:newAccount.$id,
        email:newAccount.email,
        name:newAccount.name,
        username:user.username,
        imageUrl:avatarUrl
    })

    return newUser;

  } catch (error:any) {
    console.log(error);
    return error.message
  }
}
export async function saveToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username: string;
}) {
    try {
        const newUser=await databases.createDocument(
            configAppwrite.databaseId,
            configAppwrite.userCollectionId,
            ID.unique(),
            user
        )
        return newUser
    } catch (error) {
        console.log(error);
    }
}

export async function signInAccount(user:{email:string;password:string}){
    try {
        const session=await account.createEmailSession(user.email,user.password);
        return session;
    } catch (error) {
        console.log(error)
    }
}

export async function getCurrentUser() {
  try {
    const currentAccount=await account.get();
    if(!currentAccount) throw Error;

    const currentUser=await databases.listDocuments(
      configAppwrite.databaseId,
      configAppwrite.userCollectionId,
      [Query.equal("accountId",currentAccount.$id)]
    )
    if(!currentAccount) throw Error;
    
    return currentUser.documents[0];

  } catch (error) {
    console.log(error)
  }
}
export async function signoutAccount(){
  try {
    return await account.deleteSession("current");
  } catch (error) {
    console.log(error)
  }
}

export async function createPost(post: INewPost) {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);
    console.log(post.file[0])

    if (!uploadedFile) { 
      throw Error;
    };

    // Get file url
    const fileUrl = await getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await databases.createDocument(
      configAppwrite.databaseId,
      configAppwrite.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;

  } catch (error:any) {
    console.log(error);
  }
}

// ============================== UPLOAD FILE
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      configAppwrite.storageId,
      ID.unique(),
      file
    )
    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET FILE URL
export async function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      configAppwrite.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(configAppwrite.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POPULAR POSTS (BY HIGHEST LIKE COUNT)
export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      configAppwrite.databaseId,
      configAppwrite.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function likePost(postId:string,likesArray:string[]){
  try {
    const updatePost=await databases.updateDocument(
      configAppwrite.databaseId,
      configAppwrite.postCollectionId,
      postId,
      {
        likes:likesArray
      }
    )
    if(!updatePost) throw Error
    return updatePost
  } catch (error) {
    console.log(error)
  }
}
// ============================== SAVE POST
export async function savePost(userId: string, postId: string) {
  try {
    const updatedPost = await databases.createDocument(
      configAppwrite.databaseId,
      configAppwrite.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
// ============================== DELETE SAVED POST
export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      configAppwrite.databaseId,
      configAppwrite.savesCollectionId,
      savedRecordId
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}
// ============================== GET POST BY ID
export async function getPostById(postId:string){
  try {
    const post=await databases.getDocument(
      configAppwrite.databaseId,
      configAppwrite.postCollectionId,
      postId
    );
    if(!post) throw Error;
    return post;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPDATE POST
export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate=post.file.length >0;
  try {
    let image={
      imageUrl:post.imageUrl,
      imageId:post.imageId,
    }
    if(hasFileToUpdate){
      // Upload file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      console.log(post.file[0])
  
      if (!uploadedFile) { 
        throw Error;
      };
  
      // Get file url
      const fileUrl = await getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
      image ={...image , imageUrl:fileUrl , imageId:uploadedFile.$id}
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const updatePost = await databases.updateDocument(
      configAppwrite.databaseId,
      configAppwrite.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    if (!updatePost) {
      await deleteFile(image.imageId);
      throw Error;
    }

    return updatePost;

  } catch (error:any) {
    console.log(error);
  }
}

// ============================== DELETE POST
export async function deletePost(postId:string , imageId:string){
  if(!postId || !imageId) throw Error;

  try {
    await databases.deleteDocument(
      configAppwrite.databaseId,
      configAppwrite.postCollectionId,
      postId
    );
    return {status:'ok',state:200};
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({pageParam}:{pageParam:number}) {
  const queries=[Query.orderDesc("$updatedAt"),Query.limit(10)];
  if(pageParam){
    queries.push(Query.cursorAfter(pageParam.toString()));
  }
  try {
    const posts=await databases.listDocuments(
      configAppwrite.databaseId,
      configAppwrite.postCollectionId,
      queries
    );
    if(!posts) throw Error;
    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function searchPosts(searchTerm:string) {
  try {
    const posts=await databases.listDocuments(
      configAppwrite.databaseId,
      configAppwrite.postCollectionId,
      [Query.search("caption",searchTerm)]
    )
    if(!posts) throw Error
    return posts;
  } catch (error) {
    console.log(error);
  }
}

// ============================== ALL USERS
export async function getAllUsers(){
  try {
    const users=await databases.listDocuments(
      configAppwrite.databaseId,
      configAppwrite.userCollectionId,
      [Query.orderDesc("$createdAt")]
      )
      if(!users) throw Error;
      return users
  } catch (error) {
    console.log(error)
  }
}


    export async function getUserById(userId: string) {
      try {
        const user = await databases.getDocument(
          configAppwrite.databaseId,
          configAppwrite.userCollectionId,
          userId
        );
        if (!user) throw Error;
        return user;

      } catch (error) {
        console.log(error);
      }
    }

// ============================== UPDATE USER
export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      configAppwrite.databaseId,
      configAppwrite.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}


