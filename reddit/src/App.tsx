import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import SubredditPage from "./pages/SubredditPage";
import SubmitPage from "./pages/SubmitPage";
import "./styles/App.css";
function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} /> // index here allows the homepage to be default to go to.
          <Route path="post/:postId" element={<PostPage />} /> // : colon specifies a variable in the url
          <Route path="u/:username" element={<ProfilePage />} />
          <Route path="r/:subredditName" element={<SubredditPage />} />
          <Route path="r/:subredditName/submit" element={<SubmitPage />} />
          <Route path="*" element={<Navigate to="/" replace/>} /> // if we go to some page that's not defined above then it redirects to homepage by replacing us to whatever page we're on
        </Route>
      </Routes>
      
    </BrowserRouter>
  )
}

export default App
