import { data } from "react-router";
import { Client,Account,Storage,Databases } from "appwrite";

export const appwriteConfig = {
    endpointUrl: import.meta.env.VITE_APPWRITE_API_ENDPOINT, // Your Appwrite Endpoint
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID, // Your Appwrite Project ID
    apiKey: import.meta.env.VITE_APPWRITE_API_KEY, // Your
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID, // Your Appwrite Database ID
    userCollectionId: import.meta.env.VITE_APPWRITE_USERS_ID, // Your Appwrite
    tripCollectionId: import.meta.env.VITE_APPWRITE_TRIPS_ID, // Your Appwrite Trips Collection ID
}

const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)

const account = new Account(client)
const database = new Databases(client)
const storage = new Storage(client)

export { client, account, database, storage };