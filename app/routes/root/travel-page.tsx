import { redirect, Link } from "react-router";
import { account } from "~/appwrite/client";
import { getExistingUser } from "~/appwrite/auth";
import { getAllTrips } from "~/appwrite/trips";
import { parseTripData } from "lib/utils";
import { TripCard } from "../../../components";
import RootNavbar from "../../../components/RootNavbar";
import type { Route } from "./+types/travel-page";

export async function clientLoader() {
    try {
        const user = await account.get();

        if (!user.$id) return redirect('/sign-in');

        const existingUser = await getExistingUser(user.$id);
        
        if (!existingUser) return redirect('/sign-in');

        const { allTrips } = await getAllTrips(8, 0);

        return {
            user: existingUser,
            trips: allTrips.map(({ $id, tripDetail, imageUrls }) => ({
                id: $id,
                ...parseTripData(tripDetail),
                imageUrls: imageUrls ?? []
            }))
        };
    } catch (e) {
        console.log('Error in clientLoader', e);
        return redirect('/sign-in');
    }
}

const TravelPage = ({ loaderData }: Route.ComponentProps) => {
    const trips = loaderData.trips as Trip[] | [];

    return (
        <>
            <RootNavbar />
            <main className="min-h-screen bg-light-200 pt-24">
                <section className="wrapper py-10">
                    <div className="flex flex-col gap-8">
                        {/* Header Section with CTA */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                            <div className="flex flex-col gap-3">
                                <h1 className="text-2xl md:text-4xl font-bold text-dark-100">
                                    Discover Your Next Adventure
                                </h1>
                                <p className="text-base md:text-lg text-gray-100">
                                    Explore AI-generated travel plans tailored to your preferences
                                </p>
                            </div>
                            
                            <Link 
                                to="/create-trip" 
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-100 text-white rounded-lg font-semibold hover:bg-primary-500 transition-colors shadow-100 whitespace-nowrap"
                            >
                                <img src="/assets/icons/magic-star.svg" alt="AI" className="size-5" />
                                <span>Create AI Trip</span>
                            </Link>
                        </div>

                        {/* Trips Grid */}
                        <div className="trip-grid">
                            {trips.map((trip) => (
                                <TripCard
                                    key={trip.id}
                                    id={trip.id}
                                    name={trip.name}
                                    imageUrl={trip.imageUrls[0]}
                                    location={trip.itinerary?.[0]?.location ?? ""}
                                    tags={[trip.interests, trip.travelStyle]}
                                    price={trip.estimatedPrice}
                                />
                            ))}
                        </div>

                        {/* Empty State */}
                        {trips.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 gap-6">
                                <img 
                                    src="/assets/icons/logo.svg" 
                                    alt="TravelEase" 
                                    className="size-20 opacity-50"
                                />
                                <div className="flex flex-col gap-2 text-center">
                                    <p className="text-xl font-semibold text-dark-100">No trips available yet</p>
                                    <p className="text-base text-gray-100">Create your first AI-powered travel itinerary!</p>
                                </div>
                                <Link 
                                    to="/create-trip" 
                                    className="flex items-center justify-center gap-2 px-8 py-4 bg-primary-100 text-white rounded-lg font-semibold hover:bg-primary-500 transition-colors shadow-100"
                                >
                                    <img src="/assets/icons/magic-star.svg" alt="AI" className="size-5" />
                                    <span>Create Your First Trip</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
};

export default TravelPage;