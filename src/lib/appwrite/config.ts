import { Client,Account,Databases,Storage,Avatars } from "appwrite"; 

export const configAppwrite={
    projectId:import.meta.env.VITE_APPWRITE_ID! ,
    endpoint: import.meta.env.VITE_APPWRITE_URL! ,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASES_ID!,
    storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID!,
    userCollectionId: import.meta.env.VITE_APPWRITE_DATABASES_COLLECTION_USERS_ID!,
    postCollectionId: import.meta.env.VITE_APPWRITE_DATABASES_COLLECTION_POSTS_ID!,
    savesCollectionId: import.meta.env.VITE_APPWRITE_DATABASES_COLLECTION_SAVES_ID!,

} 

export const client=new Client();
client.setProject(configAppwrite.projectId).setEndpoint(configAppwrite.endpoint) 

export const account=new Account(client); 

export const databases=new Databases(client); 
export const storage=new Storage(client); 
export const avatars=new Avatars(client);

