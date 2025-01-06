import "../styles/SubredditPage.css";
import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { RetryScheduleInOut } from "svix";

const SubredditPage = () => {
  const { subredditName } = useParams();
  const subreddit = useQuery(api.subreddit.getSubreddit, {
    name: subredditName || "",
  });

  if (subreddit === undefined) {
    return <div>Loading...</div>;
  }
  if (!subreddit) {
    return (
      <div className="content-container">
        <div className="not-found">
          <h1>Subreddit not found</h1>
          <p>The subreddit r/{subredditName} does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-container">
      <div className="subreddit-banner">
        <h1>r/{subreddit.name}</h1>
        {subreddit.description && <p>{subreddit.description}</p>}
      </div>
      <div className="posts-container">
        <div className="no-posts">
          <p>No posts yet . be first to post</p>
        </div>
      </div>
    </div>
  );
};
export default SubredditPage;
