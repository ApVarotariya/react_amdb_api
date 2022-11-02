import "./App.css";
import Main from "./Components/Main";
import "bootstrap/dist/css/bootstrap.min.css";
import TrendingMovies from "./Components/TrendingMovies";
import TvSeries from "./Components/TvSeries";
import Search from "./Components/Search";
import Header from "./Components/Header";
import { Routes, Route } from "react-router-dom";
import Movies from "./Components/Movies";
import SingleMovie from "./Components/SingleMovie";
import SingleTv from "./Components/SingleTv";
import SinglePerson from "./Components/SinglePerson";
import BollyWoodMovies from "./Components/BollyWoodMovies";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/react_amdb_api" element={<Main />} />
        <Route path="/bollywoodmovies" element={<BollyWoodMovies />} />
        <Route path="/movie/:id" element={<SingleMovie />} />
        <Route path="/tv/:id" element={<SingleTv />} />
        <Route path="/person/:id" element={<SinglePerson />}></Route>
        <Route path="trending-movies" element={<TrendingMovies />} />
        <Route path="movies" element={<Movies />} />
        <Route path="tv-series" element={<TvSeries />} />
        <Route path="search" element={<Search />} />
      </Routes>
    </>
  );
}

export default App;
