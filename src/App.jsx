import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import InvestmentPlans from "./pages/InvestmentPlans/InvestmentPlans";
import Investors from "./pages/Investors/Investors";
import Withdrawals from "./pages/Withdrawals/Withdrawals";
import Login from "./pages/Login/Login";
import UserLogginPage from "./pages/User/UserLogginPage/UserLogginPage";
import UserRegisterPage from "./pages/User/UserRegisterPage/UserRegisterPage";
import UserDashboard from "./pages/User/UserDashboard/UserDashboard";
import UserPlan from "./pages/User/UserPlan/UserPlan";
import UserDeposit from "./pages/User/UserDeposit/UserDeposit";
import UserWithdraw from "./pages/User/UserWithdraw/UserWithdraw";
import DepopsiteRequests from "./pages/DepopsiteRequests/DepopsiteRequests";
import WithdrawlRequests from "./pages/WithdrawlRequests/WithdrawlRequests";

// Root component that wraps everything with AuthProvider
const Root = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

const router = createBrowserRouter([
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/loggin",
    element: <Login />,
  },
  {
    path: "/admin/investment-plans",
    element: (
      <ProtectedRoute>
        <InvestmentPlans />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/investors",
    element: (
      <ProtectedRoute>
        <Investors />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/withdrawals",
    element: (
      <ProtectedRoute>
        <Withdrawals />
      </ProtectedRoute>
    ),
  },
  // Catch-all route for any undefined admin paths
  {
    path: "/admin/*",
    element: <Navigate to="/admin/loggin" replace />,
  },
  {
    path: "/",
    element: <UserDashboard />,
  },
  {
    path: "/user/loggin",
    element: <UserLogginPage />,
  },
  {
    path: "/user/register",
    element: <UserRegisterPage />,
  },
  {
    path: "/investment-plans",
    element: <UserPlan />,
  },
  {
    path: "/admin/deposite-request",
    element: <DepopsiteRequests />,
  },
  {
    path: "/admin/withdrawal-request",
    element: <WithdrawlRequests/>,
  },
  {
    path: "/user-deposit",
    element: <UserDeposit />,
  },
  {
    path: "/user-withdraw",
    element: <UserWithdraw />,
  },
]);

function App() {
  return <Root />;
}

export default App;
