import "./App.css";
import Main from "./Components/Main";
import "bootstrap/dist/css/bootstrap.min.css";
import TrendingMovies from "./Components/TrendingMovies";
import TvSeries from "./Components/TvSeries";
import YoutubeVideos from "./Components/YoutubeVideos";

function App() {
  return (
    <>
      <Main />
      <TrendingMovies />
      <TvSeries />
      <YoutubeVideos />
    </>
  );
}

export default App;
