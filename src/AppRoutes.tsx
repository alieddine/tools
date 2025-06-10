import { Routes, Route } from "react-router-dom";
import Json from "./pages/Json";
import MainRoute from "./pages/MainRoute";
import Home from "./pages/Home";



const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainRoute />} >
                <Route path="/home" element={<Home />} />
                <Route path="/formate">
                    <Route path="json" element={<Json />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;
