import React, { useState, useRef } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import api from '../utils/axios';
import Toast from '../components/Toast';

const MAX_IMAGES = 6;

const MediaUpload = () => {
  const fileInputRef = useRef(null);

  const [images, setImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: '', message: '' });

  const handleSelect = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter((file) => file.type.startsWith('image/'));

    if (images.length + validFiles.length > MAX_IMAGES) {
      return setToast({
        type: 'warning',
        message: `Maximum ${MAX_IMAGES} images allowed`,
      });
    }

    setImages((prev) => [...prev, ...validFiles]);
    e.target.value = null;
  };

  const handleRemoveLocal = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (images.length === 0) {
      return setToast({
        type: 'warning',
        message: 'Select at least one image',
      });
    }

    const formData = new FormData();

    images.forEach((img) => {
      formData.append('images', img);
    });

    setLoading(true);

    try {
      const res = await api.post('/media/upload', formData);

      if (res.data.success) {
        setUploadedImages(res.data.data);
        setImages([]);
        setToast({
          type: 'success',
          message: 'Images uploaded successfully',
        });
      }
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Upload failed',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFromCloudinary = async (publicId) => {
    try {
      const res = await api.delete('/media/delete', {
        data: { publicId },
      });

      if (res.data.success) {
        setUploadedImages((prev) => prev.filter((img) => img.public_id !== publicId));

        setToast({
          type: 'success',
          message: 'Image deleted successfully',
        });
      }
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Delete failed',
      });
    }
  };

  return (
    <div className="min-h-[80vh] p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Media Upload Test</h2>

        <input
          type="file"
          multiple
          hidden
          ref={fileInputRef}
          accept="image/*"
          onChange={handleSelect}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Upload size={18} />
          Select Images
        </button>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {images.map((img, index) => (
              <div key={index} className="relative border rounded-xl overflow-hidden">
                <img
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="w-full h-40 object-cover"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveLocal(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded-xl"
          >
            {loading ? 'Uploading...' : 'Upload to Server'}
          </button>
        )}

        {uploadedImages.length > 0 && (
          <>
            <h3 className="text-xl font-semibold mt-10 mb-4">Uploaded Images (From Cloudinary)</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {uploadedImages.map((img) => (
                <div key={img.public_id} className="relative border rounded-xl overflow-hidden">
                  <img src={img.url} alt="uploaded" className="w-full h-40 object-cover" />

                  <button
                    type="button"
                    onClick={() => handleDeleteFromCloudinary(img.public_id)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: '', message: '' })}
      />
    </div>
  );
};

export default MediaUpload;
