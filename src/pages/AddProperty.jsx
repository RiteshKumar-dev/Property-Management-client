import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Trash2,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Upload,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import Toast from '../components/Toast';
import usePropertyStore from '../store/propertyStore';

const MAX_IMAGES = 6;

const AddProperty = () => {
  const { fetchProperties, fetchMyProperties } = usePropertyStore();

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // EDIT MODE CHECK
  const location = useLocation();
  const editData = location.state?.editData;
  const isEditMode = !!editData;

  const [step, setStep] = useState(1); // New state for multi-step UI
  const [toast, setToast] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    type: 'Apartment',
    bedrooms: '',
    bathrooms: '',
    area: '',
  });

  useEffect(() => {
    if (isEditMode) {
      setForm({
        title: editData.title || '',
        description: editData.description || '',
        price: editData.price || '',
        location: editData.location || '',
        type: editData.type || 'Apartment',
        bedrooms: editData.bedrooms || '',
        bathrooms: editData.bathrooms || '',
        area: editData.area || '',
      });
      // Existing images are handled differently since they are URLs, not Files
      // Agar images update nahi karni toh hum step 1 ke baad seedha submit kar sakte hain
    }
  }, [editData, isEditMode]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Logic remains exactly as yours
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter((file) => file.type.startsWith('image/'));
    if (validImages.length !== files.length) {
      setToast({ type: 'warning', message: 'Only image files are allowed' });
    }
    if (images.length + validImages.length > MAX_IMAGES) {
      return setToast({
        type: 'warning',
        message: `Max ${MAX_IMAGES} images allowed`,
      });
    }
    setImages((prev) => [...prev, ...validImages]);
    e.target.value = null;
  };

  const handleDeleteImage = (index) => setImages((prev) => prev.filter((_, i) => i !== index));

  const handleReplaceImage = (index, file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const updated = [...images];
    updated[index] = file;
    setImages(updated);
  };

  const isDetailsValid = useMemo(() => {
    return (
      form.title.trim() &&
      form.description.trim().length >= 10 &&
      Number(form.price) > 0 &&
      form.location.trim() &&
      Number(form.bedrooms) > 0 &&
      Number(form.bathrooms) > 0 &&
      Number(form.area) > 0
    );
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!isEditMode && images.length === 0) {
      setToast({ type: 'warning', message: 'Please upload at least one image' });
      return;
    }

    const formData = new FormData();

    Object.keys(form).forEach((key) => formData.append(key, form[key].toString().trim()));
    if (images.length > 0) {
      images.forEach((img) => formData.append('images', img));
    }
    setLoading(true);
    try {
      let res;
      if (isEditMode) {
        // CALL PUT ROUTE
        res = await api.put(`/properties/${editData._id}`, formData);
      } else {
        // CALL POST ROUTE
        res = await api.post('/properties', formData);
      }

      if (res.data.success) {
        setToast({
          type: 'success',
          message: isEditMode ? 'Property updated successfully!' : 'Property added successfully!',
        });
        fetchProperties(true);
        fetchMyProperties(true);
        setTimeout(() => (isEditMode ? navigate('/my-properties') : navigate('/')), 1200);
      }
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to create property',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start pt-10 px-4 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-4xl border border-gray-100"
      >
        {/* Progress Header */}
        <div className="bg-indigo-600 p-8 text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-extrabold flex items-center gap-3">
              <Building2 size={32} /> {isEditMode ? 'Edit Property' : 'Add New Property'}{' '}
            </h2>
            <span className="bg-white/20 px-4 py-1 rounded-full text-sm backdrop-blur-md">
              {isEditMode ? 'Quick Update' : `Step ${step} of 2`}
            </span>
          </div>
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '50%' }}
              animate={{ width: step === 1 ? '50%' : '100%' }}
              className="bg-white h-full"
            />
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 ? (
                /* STEP 1: Property Details */
                <motion.div
                  key="step1"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  <div className="col-span-2 space-y-1">
                    <label className="text-sm font-semibold text-gray-600 ml-1">
                      Property Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="e.g. Modern Luxury Villa"
                      className="w-full border-gray-200 border rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      value={form.title}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-2 space-y-1">
                    <label className="text-sm font-semibold text-gray-600 ml-1">Description</label>
                    <textarea
                      name="description"
                      placeholder="Describe the amazing features..."
                      rows={4}
                      className="w-full border-gray-200 border rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      value={form.description}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Replace Price & Location inputs with this layout */}
                  <div className="grid md:grid-cols-2 gap-6 col-span-2">
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-gray-600 ml-1">Price ($)</label>
                      <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="Price"
                        className="w-full border-gray-200 border rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-gray-600 ml-1">
                        Property Type
                      </label>
                      <div className="relative">
                        <select
                          name="type"
                          value={form.type}
                          onChange={handleChange}
                          className="w-full appearance-none border-gray-200 border rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white cursor-pointer"
                        >
                          <option value="Apartment">Apartment</option>
                          <option value="Villa">Villa</option>
                          <option value="House">House</option>
                          <option value="Commercial">Commercial</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
                          <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 space-y-1">
                    <label className="text-sm font-semibold text-gray-600 ml-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="City, State"
                      className="w-full border-gray-200 border rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 col-span-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Bedrooms</label>
                      <input
                        type="number"
                        name="bedrooms"
                        value={form.bedrooms}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3 focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Bathrooms</label>
                      <input
                        type="number"
                        name="bathrooms"
                        value={form.bathrooms}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3 focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Area (Sqft)
                      </label>
                      <input
                        type="number"
                        name="area"
                        value={form.area}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-3 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="col-span-2 flex justify-end pt-4">
                    <button
                      type="button"
                      disabled={!isDetailsValid}
                      onClick={() => setStep(2)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:grayscale"
                    >
                      Next: Upload Photos <ArrowRight size={20} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* STEP 2: Image Upload */
                <motion.div
                  key="step2"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-3xl bg-slate-50/50">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      hidden
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                    />
                    <div className="flex flex-col items-center">
                      <div className="bg-indigo-100 p-4 rounded-full text-indigo-600 mb-4">
                        <Upload size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {isEditMode ? 'Update Photos (Optional)' : 'Upload Property Images'}
                      </h3>
                      <p className="text-gray-500 mb-6">
                        {isEditMode
                          ? "If you don't select new images, the existing ones will be kept."
                          : `Select up to ${MAX_IMAGES} high-quality photos`}
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-6 py-2 rounded-xl font-bold transition-all"
                      >
                        {images.length > 0
                          ? `Selected ${images.length} Files`
                          : 'Choose Files'}{' '}
                      </button>
                    </div>
                  </div>

                  {/* Image Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((img, index) => (
                      <motion.div
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={index}
                        className="group relative h-48 rounded-2xl overflow-hidden shadow-lg"
                      >
                        <img
                          src={URL.createObjectURL(img)}
                          alt="preview"
                          className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end justify-center pb-4 gap-3">
                          <label className="bg-white/20 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-white/40 transition">
                            <RefreshCw size={18} className="text-white" />
                            <input
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={(e) => handleReplaceImage(index, e.target.files[0])}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(index)}
                            className="bg-red-500/80 backdrop-blur-md p-2 rounded-full hover:bg-red-600 transition"
                          >
                            <Trash2 size={18} className="text-white" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-gray-500 font-semibold flex items-center gap-2 hover:text-indigo-600 transition"
                    >
                      <ArrowLeft size={20} /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={(!isEditMode && images.length === 0) || loading}
                      className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-green-200 transition-all disabled:opacity-50"
                    >
                      {loading
                        ? 'Processing...'
                        : isEditMode
                          ? 'Update Property'
                          : 'Publish Property'}
                    </button>
                  </div>
                  {isEditMode && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-700 text-sm italic">
                      Note: Selecting new images will replace all previous images for this property.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </motion.div>

      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: '', message: '' })}
      />
    </div>
  );
};

export default AddProperty;
