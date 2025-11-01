// import { type RouteConfig, route, index } from "@react-router/dev/routes";

// export default [
//     // Just the sign-in route for now
//     index('./routes/root/sign-in.tsx'),
//     route('sign-in', './routes/root/sign-in.tsx'),
// ] satisfies RouteConfig;


import { type RouteConfig, layout, route, index } from "@react-router/dev/routes";

export default [
    // Root landing page
    index('./routes/root/travel-page.tsx'),
    
    // Sign in route
    route('sign-in', './routes/root/sign-in.tsx'),
    
    // API routes
    route('api/create-trip', './routes/api/create-trip.tsx'),
    
    // Travel detail route (for users)
    route('travel/:tripId', './routes/root/travel-detail.tsx'),
    
    // Admin routes with layout
    layout('routes/admin/admin-layout.tsx', [
        route('dashboard', './routes/admin/dashboard.tsx'),
        route('all-users', './routes/admin/all-users.tsx'),
        route('trips', './routes/admin/trips.tsx'),
        route('trips/create', './routes/admin/create-trip.tsx'),
        route('trips/:tripId', './routes/admin/trip-detail.tsx')
    ])
] satisfies RouteConfig;