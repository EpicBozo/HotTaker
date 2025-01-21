import { useState } from "react";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const postData = new FormData();
    postData.append("title", formData.title);
    postData.append("description", formData.description);
    if (image) {
      postData.append("image", image);
    }

    try {
      const response = await axios.post("/api/create-posts/", postData);
      if (response.data.success) {
        // Redirect to the post detail page
        navigate(`/create-posts/${response.data.post.id}`);
      }
    } catch (err) {
      setError(err.response?.data || "An error occurred while creating the post");
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className="card">
      <div className="card-header">
        <h2>Create New Post</h2>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image</label>
            <div className="image-upload">
              <label className="upload-button">
                <span className="upload-icon">📁</span>
                Upload Image
                <input
                  type="file"
                  id="image"
                  className="hidden-input"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="submit-button">
            {isSubmitting ? (
              <span className="button-content">
                <span className="loading-spinner"></span>
                Creating Post...
              </span>
            ) : (
              "Create Post"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
