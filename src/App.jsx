import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Main from "./Components/Main";
import Home from "./Components/Home";
import TvSeries from "./Components/TvSeries";
import Search from "./Components/Search";
import Header from "./Components/Header";
import Movies from "./Components/Movies";
import BollyWoodMovies from "./Components/BollyWoodMovies";
import SingleDetails from "./Components/SingleDetails";
import PopularMovies from "./Components/PopularMovies";
import UpComing from "./Components/Upcoming";
import NowPlaying from "./Components/NowPlaying";

function App() {
  const theme = localStorage.getItem("darkMode");
  console.log(theme);
  const pages = [
    { path: "/", component: Home },
    { path: "/trending", component: Main },
    { path: "/bollywoodmovies", component: BollyWoodMovies },
    { path: "/:state/:id", component: SingleDetails },
    { path: "/popular-movies", component: PopularMovies },
    { path: "/movies", component: Movies },
    { path: "/tv-series", component: TvSeries },
    { path: "/search", component: Search },
    { path: "/upComing", component: UpComing },
    { path: "/in-theaters-now", component: NowPlaying },
  ];
  return (
    <>
      <Header />
      <Routes>
        {pages.map((page) => {
          return (
            <Route
              key={page.path}
              path={page.path}
              element={<page.component />}
            />
          );
        })}
      </Routes>
    </>
  );
}

export default App;
