import { type RouteConfig, layout, route, index } from "@react-router/dev/routes";
// Correct usage: pass options as objects
export default [
    route('sign-in', './routes/root/sign-in.tsx'),
    route('api/create-trip', './routes/api/create-trip.tsx'),
    layout(
        'routes/admin/admin-layout.tsx',
        [
            route('dashboard', './routes/admin/dashboard.tsx'),
            route('all-users', './routes/admin/all-users.tsx'),
            route('trips', './routes/admin/trips.tsx'),
            route('trips/create', './routes/admin/create-trip.tsx'),
            route('trips/:tripId', "./routes/admin/trip-detail.tsx")
        ])
] satisfies RouteConfig;