import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import "../styles/CreateCommunityModal.css";

interface CreateCommunityModalProps {
  onClose: () => void;
  isOpen: boolean;
}

const CreateCommunityModal = ({
  onClose,
  isOpen,
}: CreateCommunityModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isLoading, SetIsLoading] = useState(false);
  const createSubreddit = useMutation(api.subreddit.create);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name) {
      setError("Community name is required");
      return;
    }
    if (name.length < 3 || name.length > 21) {
      setError("Community name must be betweem 3 and 21 characters");
      return;
    }
    // RegExp.test(string: string): boolean
    // Returns a Boolean value that indicates whether or not a pattern exists in a searched string.
    if (!/^[a-zA-Z0-9]+/.test(name)) {
      setError("Community name must only contain letters and numbers");
    }

    SetIsLoading(true);
    await createSubreddit({ name, description })
      .then((result) => {
        console.log(result);
        onClose();
      })
      .catch((err) => {
        setError(`Failed to create community. ${err.data.message}`);
      })
      .finally(() => {
        SetIsLoading(false);
      });
  };
  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-container">
        <div className="modal-header">
          <h2>Create a Community</h2>
          <button className="close-button" onClick={onClose}>
            &times;{/* X button */}
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <div className="input-prefix">r/</div>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="community_name"
              maxLength={21}
              disabled={isLoading}
            />
            <p className="input-help">
              Community names including capitalization cannot be changed.
            </p>
          </div>
          <div className="form-group">
            <label htmlFor="description">
              Description <span>(Optional)</span>{" "}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your community"
              maxLength={100}
              disabled={isLoading}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-folder">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="create-button"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Community"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateCommunityModal;
