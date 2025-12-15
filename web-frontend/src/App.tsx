import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Entrance from "./screens/Entrance";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
      <div className="flex h-full w-full">
        <AuthProvider>
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <Entrance />
            </QueryClientProvider>
          </BrowserRouter>
        </AuthProvider>
      </div>
    </ErrorBoundary>
  );
};

export default App;
