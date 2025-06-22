import { Routes, Route } from "react-router-dom";
import Json from "./pages/json/Json";
import MainRoute from "./pages/MainRoute";
import Home from "./pages/Home";
import NotFound from "./pages/notFound";
import ColorPicker from "./pages/colors/colorPicker";
import ConvertCase from "./pages/text/convertCase";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainRoute />} >
                <Route path="/home" element={<Home />} />
                <Route path="/formate">
                    <Route path="json" element={<Json />} />
                </Route>
                <Route path="/colors">
                    <Route path="picker" element={<ColorPicker />} />
                </Route>
                <Route path="/text">
                    <Route path="convert" element={<ConvertCase />} />
                </Route>
            <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
