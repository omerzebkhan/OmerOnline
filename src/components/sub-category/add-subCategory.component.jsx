import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import UploadService from "../../services/FileUploadService";
import subCategoryService from "../../services/subCategory";
import { fetchCategoryStartAsync } from '../../redux/cateogry/category.actions';
import { checkAdmin, checkAccess } from '../../helper/checkAuthorization';

const AddSubCategory = ({
  selectedSubCategory,
  CategoryData,
  currentUser,
  fetchCategoryStartAsync
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [userInput, setUserInput] = useState('');
  const [selCat, setSelCat] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [activeOption, setActiveOption] = useState(0);
  const [showOptions, setShowOptions] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [access, setAccess] = useState(false);
  const [content, setContent] = useState('');

  // Fetch categories on mount
  useEffect(() => {
    fetchCategoryStartAsync();
    checkAdmin().then(r => setContent(r));
    setAccess(checkAccess("ADD SUBCATEGORY", currentUser.rights));
  }, []);

  // Prefill fields if editing
  useEffect(() => {
    if (selectedSubCategory) {
      setName(selectedSubCategory.name || '');
      setDescription(selectedSubCategory.description || '');
      setSelCat(selectedSubCategory.category?.id || '');
      setUserInput(selectedSubCategory.category?.name || '');
      setSelectedFiles(null);
      setMessage('');
    } else {
      setName('');
      setDescription('');
      setSelCat('');
      setUserInput('');
      setSelectedFiles(null);
      setMessage('');
    }
  }, [selectedSubCategory]);

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  // Upload image
  const upload = async (id) => {
    if (!selectedFiles) return;
    const file = selectedFiles[0];
    setCurrentFile(file);
    setProgress(0);

    const lastDot = file.name.lastIndexOf('.');
    const ext = file.name.substring(lastDot + 1);
    let fileName = `subcat${id}.${ext}`;

    try {
      const response = await UploadService.upload(file, (event) => {
        setProgress(Math.round((100 * event.loaded) / event.total));
      }, fileName, '\\App\\uploads\\subCategoriesImages\\');

      const imageUrl = response.data?.data?.Location || fileName;
      setMessage(response.data?.message || 'File uploaded');

      await subCategoryService.update(id, { imageUrl });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
    }
    setSelectedFiles(null);
  };

  // Save SubCategory (Create or Update)
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = { name, description, category: selCat };

    try {
      if (selectedSubCategory) {
        await subCategoryService.update(selectedSubCategory.id, data);
        setMessage('SubCategory updated successfully');
        if (selectedFiles) await upload(selectedSubCategory.id);
      } else {
        const response = await subCategoryService.create(data);
        setMessage(`SubCategory created with ID = ${response.data.id}`);
        if (selectedFiles) await upload(response.data.id);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Save failed');
    }

    setLoading(false);
    setName('');
    setDescription('');
    setSelCat('');
    setUserInput('');
    setSelectedFiles(null);
  };

  // Autocomplete logic
  const handleCategoryInput = (e) => {
    const value = e.target.value;
    setUserInput(value);
    if (!value) {
      setShowOptions(false);
      return;
    }
    const options = CategoryData.filter(cat => 
      cat.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(options);
    setActiveOption(0);
    setShowOptions(true);
  };

  const handleOptionClick = (option) => {
    setSelCat(option.id);
    setUserInput(option.name);
    setShowOptions(false);
    setFilteredOptions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions.length) handleOptionClick(filteredOptions[activeOption]);
    } else if (e.key === 'ArrowUp') {
      if (activeOption > 0) setActiveOption(activeOption - 1);
    } else if (e.key === 'ArrowDown') {
      if (activeOption < filteredOptions.length - 1) setActiveOption(activeOption + 1);
    }
  };

  return (
    <div className="container submit-form">
      {access ? (
        <>
          <h2>{selectedSubCategory ? 'Update SubCategory' : 'Add New SubCategory'}</h2>
          {loading && <div className="alert alert-warning">Processing...</div>}
          {message && <div className="alert alert-info">{message}</div>}

          <form onSubmit={handleSave}>
            {/* Name */}
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                className="form-control"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            {/* Category Autocomplete */}
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                className="form-control"
                value={userInput}
                onChange={handleCategoryInput}
                onKeyDown={handleKeyDown}
                placeholder="Select Category"
              />
              {showOptions && filteredOptions.length > 0 && (
                <ul className="options list-group mt-1">
                  {filteredOptions.map((opt, idx) => (
                    <li
                      key={opt.id}
                      className={`list-group-item ${idx === activeOption ? 'active' : ''}`}
                      onClick={() => handleOptionClick(opt)}
                    >
                      {opt.name}
                    </li>
                  ))}
                </ul>
              )}
              {showOptions && filteredOptions.length === 0 && (
                <div className="text-muted mt-1">No options found</div>
              )}
            </div>

            {/* File Upload */}
            <div className="form-group">
              <label>SubCategory Image</label>
              <input type="file" className="form-control" onChange={handleFileChange} />
              {progress > 0 && (
                <div className="progress mt-2">
                  <div className="progress-bar" role="progressbar" style={{ width: `${progress}%` }}>
                    {progress}%
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-success mt-2">
              {selectedSubCategory ? 'Update' : 'Add'}
            </button>
          </form>
        </>
      ) : (
        <h3>Access denied for this screen</h3>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  CategoryData: state.category.category,
  currentUser: state.user.user,
});

const mapDispatchToProps = (dispatch) => ({
  fetchCategoryStartAsync: () => dispatch(fetchCategoryStartAsync()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddSubCategory);
