import "./App.css";
import Main from "./Components/Main";
import "bootstrap/dist/css/bootstrap.min.css";
import TrendingMovies from "./Components/TrendingMovies";
import TvSeries from "./Components/TvSeries";
import Search from "./Components/Search";
import Header from "./Components/Header";
import { Routes, Route } from "react-router-dom";
import Movies from "./Components/Movies";
import BollyWoodMovies from "./Components/BollyWoodMovies";
import SingleDetails from "./Components/SingleDetails";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/react_amdb_api" element={<Main />} />
        <Route path="/bollywoodmovies" element={<BollyWoodMovies />} />
        <Route path="/:state/:id" element={<SingleDetails />} />
        <Route path="trending-movies" element={<TrendingMovies />} />
        <Route path="movies" element={<Movies />} />
        <Route path="tv-series" element={<TvSeries />} />
        <Route path="search" element={<Search />} />
      </Routes>
    </>
  );
}

export default App;
