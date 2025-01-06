import "../styles/PostPage.css";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import PostCard from "../components/PostCard";
import { FaArrowLeft } from "react-icons/fa";

const PostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const post = useQuery(api.post.getPost, { id: postId });
  if (!post) {
    return (
      <div className="post-page loading">
        <div className="container">Loading...</div>
      </div>
    );
  }
  return (
    <div className="post-page">
      <div className="container">
        <div className="page-header">
          <div
            onClick={() => navigate(-1)}
            className="back-link"
            style={{ cursor: "pointer" }}
          >
            <FaArrowLeft />
          </div>
        </div>
        <PostCard post={post} expandedView={true} showSubreddit={true} />
      </div>
    </div>
  );
};
export default PostPage;
