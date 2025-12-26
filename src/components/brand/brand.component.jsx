import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchBrandStartAsync,clearCurrentBrand,setCurrentBrand} from '../../redux/brands/brands.actions';
import BrandService from '../../services/brand.service';
import UploadService from '../../services/FileUploadService';

const AddBrand = ({selectedBrand, currentBrand, fetchBrandStartAsync, clearCurrentBrand }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');



  // Prefill if currentBrand exists, otherwise keep empty
  useEffect(() => {
   

    if (currentBrand) {
      setName(currentBrand.name);
      setDescription(currentBrand.description);
      setSelectedFiles(null);
      setMessage('');
    } else {
      setName('');
      setDescription('');
      setSelectedFiles(null);
      setMessage('');
    }
  }, [currentBrand]);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const upload = async (brandId) => {
    if (!selectedFiles) return;
    const file = selectedFiles[0];
    setCurrentFile(file);
    setProgress(0);

    const lastDot = file.name.lastIndexOf('.');
    const ext = file.name.substring(lastDot + 1);
    let fileName = `brand${brandId}.${ext}`;

    try {
      const response = await UploadService.upload(file, (event) => {
        setProgress(Math.round((100 * event.loaded) / event.total));
      }, fileName, '\\App\\uploads\\brandImages\\');

      let imageUrl = response.data?.data?.Location || fileName;
      setMessage(response.data?.message || 'File uploaded');

      // Update brand with image
      await BrandService.update(brandId, { imageUrl });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
    }

    setSelectedFiles(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (currentBrand) {
      // Update existing brand
      try {
        await BrandService.update(currentBrand.id, { name, description });
        setMessage('Brand updated successfully');
        upload(currentBrand.id);
      } catch (err) {
        setMessage(err.response?.data?.message || 'Update failed');
      }
    } else {
      // Create new brand
      try {
        const response = await BrandService.create({ name, description });
        setMessage(`Brand created with ID = ${response.data.id}`);
        upload(response.data.id);
      } catch (err) {
        setMessage(err.response?.data?.message || 'Creation failed');
      }
    }
  };

  const handleClear = () => {
    clearCurrentBrand();
    setName('');
    setDescription('');
    setSelectedFiles(null);
    setMessage('');
  };

  return (
    <div className="container">
      <h2>{currentBrand ? 'Update Brand' : 'Add New Brand'}</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSave}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
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
          <label>Brand Image</label>
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

        {currentBrand && currentBrand.imageUrl && (
          <div className="form-group mt-2">
            <label>Current Image Preview:</label>
            <br />
            <img
              src={
                import.meta.env.VITE_S3 === 'True'
                  ? currentBrand.imageUrl
                  : `${import.meta.env.VITE_MIDDLEWARE}/brandImages/${currentBrand.imageUrl}`
              }
              alt="brand preview"
              width="100"
              height="100"
            />
          </div>
        )}

        <button type="submit" className="btn btn-success mt-3">
          {currentBrand ? 'Update' : 'Add'}
        </button>
        {currentBrand && (
          <button type="button" className="btn btn-secondary mt-3 ml-2" onClick={handleClear}>
            Clear
          </button>
        )}
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentBrand: state.brand.currentBrand,
});

const mapDispatchToProps = (dispatch) => ({
  fetchBrandStartAsync: () => dispatch(fetchBrandStartAsync()),
  clearCurrentBrand: () => dispatch(clearCurrentBrand()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddBrand);
