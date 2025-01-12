import "../styles/ProfilePage.css";
import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import PostCard from "../components/PostCard";

const ProfilePage = () => {
  const { username } = useParams();
  // const user = useQuery(api.users.getUserProfile, {username: username!});
  const posts = useQuery(api.post.userPosts, {
    authorUsername: username || "",
  });
  const stats = useQuery(api.users.getPublicUser, { username: username || "" });
  if (posts === undefined)
    return (
      <div className="content-container">
        <div className="profile-header">
          <h1>u/{username}</h1>
        </div>
        <div className="loading">Loading Posts...</div>
      </div>
    );
  return (
    <div className="content-container">
      <div className="profile-header">
        <h1>u/{username}</h1>
        <p style={{ color: "#7c7c7c" }}>Posts: {stats?.posts ?? 0}</p>
      </div>
      <div className="posts-container">
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts yet</p>
          </div>
        ) : (
          posts.map((post) => {
            return <PostCard post={post} key={post._id} showSubreddit={true} />;
          })
        )}
      </div>
    </div>
  );
};
export default ProfilePage;
