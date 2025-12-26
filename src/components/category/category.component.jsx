import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import categoryService from "../../services/category.services";
import UploadService from "../../services/FileUploadService";
import { setCurrentCategory, clearCurrentCategory } from "../../redux/cateogry/category.actions";
import { checkAdmin, checkAccess } from "../../helper/checkAuthorization";

const AddCategory = ({ selectedCategory, currentCategory, clearCurrentCategory }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [access, setAccess] = useState(false);

  const user = useSelector((state) => state.user.user);

  const isNew = !currentCategory;

  useEffect(() => {
    setAccess(checkAccess("ADD CATEGORY", user.rights));

    if (currentCategory) {
      setName(currentCategory.name);
      setDescription(currentCategory.description);
      setSelectedFiles(null);
      setMessage("");
    } else {
      setName("");
      setDescription("");
      setSelectedFiles(null);
      setMessage("");
    }
  }, [currentCategory, user]);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const upload = async (categoryId) => {
    if (!selectedFiles) return;

    const file = selectedFiles[0];
    setCurrentFile(file);
    setProgress(0);

    const ext = file.name.split(".").pop();
    let fileName = `cat${categoryId}.${ext}`;

    try {
      const response = await UploadService.upload(
        file,
        (event) => setProgress(Math.round((100 * event.loaded) / event.total)),
        fileName,
        "\\App\\uploads\\categoriesImages\\"
      );

      let imageUrl = response.data?.data?.Location || fileName;
      setMessage(response.data?.message || "File uploaded");

      await categoryService.update(categoryId, { imageUrl });
    } catch (err) {
      setMessage("Upload failed");
    }

    setSelectedFiles(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (currentCategory) {
      try {
        await categoryService.update(currentCategory.id, { name, description });
        setMessage("Category updated successfully");
        upload(currentCategory.id);
      } catch (err) {
        setMessage("Update failed");
      }
    } else {
      try {
        const response = await categoryService.create({ name, description });
        setMessage(`Category created with ID = ${response.data.id}`);
        upload(response.data.id);
      } catch (err) {
        setMessage("Creation failed");
      }
    }
  };

  const handleClear = () => {
    clearCurrentCategory();
    setName("");
    setDescription("");
    setSelectedFiles(null);
    setMessage("");
  };

  if (!access) return <h3>Access denied</h3>;

  return (
    <div className="container">
      <h2>{currentCategory ? "Update Category" : "Add New Category"}</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSave}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Category Image</label>
          <input type="file" className="form-control" onChange={handleFileChange} />

          {progress > 0 && (
            <div className="progress mt-2">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progress}%` }}
              >
                {progress}%
              </div>
            </div>
          )}
        </div>

        {currentCategory && currentCategory.imageUrl && (
          <div className="form-group mt-2">
            <label>Current Image Preview:</label>
            <br />
            <img
              src={
                import.meta.env.VITE_S3 === "True"
                  ? currentCategory.imageUrl
                  : `${import.meta.env.VITE_MIDDLEWARE}/categoriesImages/${currentCategory.imageUrl}`
              }
              alt="category"
              width="100"
              height="100"
            />
          </div>
        )}

        <button type="submit" className="btn btn-success mt-3">
          {currentCategory ? "Update" : "Add"}
        </button>

        {currentCategory && (
          <button
            type="button"
            className="btn btn-secondary mt-3 ml-2"
            onClick={handleClear}
          >
            Clear
          </button>
        )}
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentCategory: state.category.currentCategory,
});

const mapDispatchToProps = (dispatch) => ({
  clearCurrentCategory: () => dispatch(clearCurrentCategory()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCategory);
