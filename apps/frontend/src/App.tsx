import {
    Routes,
    Route
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Elections from "./pages/Elections";
import ElectionDetails from "./pages/ElectionDetails";
import LiveResultsPage from "./pages/LiveResultsPage";
import AdminResultEntry from "./pages/AdminResultEntry";
import Geography from "./pages/Geography";

import ProtectedRoute
    from "./components/ProtectedRoute";


function App() {

    return (

        <Routes>

            <Route
                path="/"
                element={<Home />}
            />


            <Route
                path="/login"
                element={<Login />}
            />


            <Route
                element={<ProtectedRoute />}
            >

                <Route
                    path="/dashboard"
                    element={
                        <Dashboard />
                    }
                />


                <Route
                    path="/elections"
                    element={
                        <Elections />
                    }
                />


                <Route
                    path="/elections/:id"
                    element={
                        <ElectionDetails />
                    }
                />


                <Route
                    path="/results"
                    element={
                        <LiveResultsPage />
                    }
                />


                <Route
                    path="/admin/results/entry"
                    element={
                        <AdminResultEntry />
                    }
                />
                <Route
                    path="/geography"
                    element={<Geography />}
                />

            </Route>

        </Routes>

    );

}


export default App;