import { StatsCards, TripCards } from 'components'
import Header from 'components/Header'
import { dashboardStats, user,allTrips } from '~/constants'

const {totalUsers, usersJoined, totalTrips ,tripsCreated, userRole} = dashboardStats


const dashboard = () => {


 
  return (
    <main className='dashboard wrapper'>
      <Header 
       title={`Welcome ${user?.name ?? "Guest"} 👋`}
       description="Track activity, trends and poplular destinations in real time."
      />
      <section className='flex flex-cols gap-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 w-full'>
          <StatsCards
            headerTitle="Total Trips"
            total={totalTrips}
            currentMonthCount={tripsCreated.currentMonth}
            lastMonthCount={tripsCreated.lastMonth}
          />
          <StatsCards
            headerTitle="Total Users"
            total={totalUsers}
            currentMonthCount={usersJoined.currentMonth}
            lastMonthCount={usersJoined.lastMonth}
          />
          <StatsCards
            headerTitle="Active Users"
            total={userRole.total}
            currentMonthCount={userRole.currentMonth}
            lastMonthCount={userRole.lastMonth}
          />
        </div>
      </section>
      <section className='container'>
        <h1 className='text-xl font-semibold text-dark-100'>
          Created Trips
        </h1>
         <div className='trip-grid'>
            {allTrips.map((trip) => (
                <TripCards
                    key={trip.id}
                    id={trip.id.toString()}
                    name={trip.name!}
                    imageUrl={trip.imageUrls[0]}
                    location={trip.itinerary?.[0]?.location ?? ''}
                    tags={trip.tags}
                    price={trip.estimatedPrice!}
                />
            ))}
        </div>
      </section>
    </main>
  )
}

export default dashboard