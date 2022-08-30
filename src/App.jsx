import "./App.css";
import Main from "./Components/Main";
import "bootstrap/dist/css/bootstrap.min.css";
import TrendingMovies from "./Components/TrendingMovies";
import TvSeries from "./Components/TvSeries";

function App() {
  return (
    <>
      <Main />
      <TrendingMovies />
      <TvSeries />
    </>
  );
}

export default App;
