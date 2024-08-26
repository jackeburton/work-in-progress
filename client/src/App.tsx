import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AllUsers from './AllUsers'

const queryClient = new QueryClient()

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AllUsers />
        </QueryClientProvider>
    )
}
