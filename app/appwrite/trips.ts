import { Query } from "appwrite"
import { appwriteConfig ,database} from "./client"
import { attributes } from "@syncfusion/ej2-base"

export const getAllTrips = async(limit:number , offset: number) => {
    const allTrips = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.tripCollectionId,
        [Query.limit(limit), Query.offset(offset), Query.orderDesc('createdAt')] 
    )

    if (allTrips.total === 0){
        console.error('No trips found')
        return {allTrips:[], total: 0}
    }
    return {
        allTrips: allTrips.documents,
        total: allTrips.total,
    }
}

export const getTripById = async (tripId: string) => {
    const trip = await database.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.tripCollectionId,
        tripId
    )

    if (!trip || !trip.$id){
        console.log("trip not found")
        return null

    }
    return trip;
}


