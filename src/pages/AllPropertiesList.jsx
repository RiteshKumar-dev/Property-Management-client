import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, BedDouble, Bath, Maximize, User, ChevronRight, Heart, Copy } from 'lucide-react';
import usePropertyStore from '../store/propertyStore';
import api from '../utils/axios';
import Toast from '../components/Toast';

const AllPropertiesList = () => {
  const { properties, loading, error, fetchProperties } = usePropertyStore();
  const [toast, setToast] = useState({ type: '', message: '' });
  const [interestLoading, setInterestLoading] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleInterest = async (e, propertyId) => {
    e.stopPropagation();
    setInterestLoading(propertyId);
    try {
      const res = await api.post(`/properties/${propertyId}/interest`);
      if (res.data.success) {
        setToast({ type: 'success', message: 'Interest sent to owner!' });
        fetchProperties(true);
      }
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to record interest',
      });
    } finally {
      setInterestLoading(null);
    }
  };
  const handleCopyId = async (id) => {
    try {
      await navigator.clipboard.writeText(id);
      alert('Property ID copied!');
    } catch (err) {
      alert('Failed to copy ID');
    }
  };
  if (loading)
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pt-5">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-[450px] bg-gray-100 animate-pulse rounded-3xl" />
        ))}
      </div>
    );

  if (error)
    return <div className="text-center py-20 text-red-500 bg-red-50 rounded-2xl m-5">{error}</div>;

  if (!properties.length)
    return (
      <p className="text-center py-20 text-gray-400 font-medium">
        No properties found at the moment.
      </p>
    );

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 pt-5">
      {properties.map((property) => {
        const images = property.images || [];
        const mainImage = images[0]?.url || 'https://via.placeholder.com/400x300';
        const thumbnails = images.slice(1, 4);

        return (
          <motion.div
            key={property._id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-15px_rgba(79,70,229,0.2)] transition-all duration-500 border border-gray-100 group flex flex-col"
          >
            {/* --- IMAGE SECTION --- */}
            <div className="p-3 pb-0">
              <div className="relative h-60 overflow-hidden rounded-[2rem]">
                <img
                  src={mainImage}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Status Badge */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-white/80 backdrop-blur-md text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
                    {property.type}
                  </span>
                </div>
                {/* --- INTEREST BUTTON (TOP RIGHT) --- */}
                <button
                  onClick={(e) => handleInterest(e, property._id)}
                  disabled={interestLoading === property._id}
                  className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg ${
                    interestLoading === property._id ? 'opacity-50' : 'opacity-100'
                  } bg-white/90 hover:bg-rose-500 hover:text-white text-rose-500`}
                >
                  <Heart
                    size={20}
                    fill={interestLoading === property._id ? 'currentColor' : 'none'}
                    className={interestLoading === property._id ? 'animate-pulse' : ''}
                  />
                </button>
                {/* Price Label */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-indigo-600/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl font-bold text-sm shadow-lg">
                    ₹{Number(property.price).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-2 px-1">
                {thumbnails.map((img, idx) => (
                  <div
                    key={idx}
                    className="flex-1 h-14 rounded-xl overflow-hidden border border-gray-100 shadow-sm"
                  >
                    <img
                      src={img.url}
                      className="w-full h-full object-cover hover:opacity-80 transition cursor-pointer"
                      alt="property"
                    />
                  </div>
                ))}
                {images.length > 4 && (
                  <div className="flex-1 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold border border-gray-100">
                    +{images.length - 4}
                  </div>
                )}
                {[...Array(Math.max(0, 3 - thumbnails.length))].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-14 rounded-xl bg-gray-50 border border-dashed border-gray-200"
                  />
                ))}
              </div>
            </div>

            {/* --- CONTENT SECTION --- */}
            <div className="p-6 flex flex-col flex-grow">
              <div className="mb-4">
                <h3 className="text-xl font-extrabold text-gray-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {property.title}
                </h3>
                <div className="flex items-center gap-1 text-gray-400 mt-1">
                  <MapPin size={14} className="text-rose-500" />
                  <span className="text-xs font-medium truncate">{property.location}</span>
                </div>
              </div>

              <p className="text-gray-500 text-sm line-clamp-2 mb-6 leading-relaxed">
                {property.description}
              </p>

              {/* Stats Bar */}
              <div className="flex justify-between items-center py-4 px-4 bg-gray-50 rounded-2xl mb-6">
                <div className="flex flex-col items-center">
                  <BedDouble size={18} className="text-indigo-500 mb-1" />
                  <span className="text-[10px] uppercase font-bold text-gray-400">Beds</span>
                  <span className="text-sm font-bold text-gray-700">{property.bedrooms}</span>
                </div>
                <div className="h-8 w-[1px] bg-gray-200" />
                <div className="flex flex-col items-center">
                  <Bath size={18} className="text-indigo-500 mb-1" />
                  <span className="text-[10px] uppercase font-bold text-gray-400">Baths</span>
                  <span className="text-sm font-bold text-gray-700">{property.bathrooms}</span>
                </div>
                <div className="h-8 w-[1px] bg-gray-200" />
                <div className="flex flex-col items-center">
                  <Maximize size={18} className="text-indigo-500 mb-1" />
                  <span className="text-[10px] uppercase font-bold text-gray-400">Area</span>
                  <span className="text-sm font-bold text-gray-700">
                    {property.area} <small>sqft</small>
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] rounded-full">
                      <div className="bg-white p-1 rounded-full">
                        <User size={16} className="text-indigo-600" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                      Owner
                    </span>
                    <span className="text-xs font-bold text-gray-700">
                      {property.owner?.name || 'Premium Member'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleCopyId(property._id)}
                  title="Copy Property ID"
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 text-slate-600 hover:bg-slate-900 hover:text-white transition-all hover:shadow-lg border border-gray-100"
                >
                  <Copy size={18} />
                </button>
                <button className="flex items-center gap-1 bg-gray-900 text-white pl-5 pr-3 py-2.5 rounded-2xl text-xs font-bold hover:bg-indigo-600 transition-all group/btn">
                  View Details
                  <ChevronRight
                    size={16}
                    className="transition-transform group-hover/btn:translate-x-1"
                  />
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: '', message: '' })}
      />
    </div>
  );
};

export default AllPropertiesList;
