import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit3,
  Trash2,
  ExternalLink,
  MapPin,
  IndianRupee,
  Layers,
  BedDouble,
  Bath,
  Maximize,
  User,
  X,
  Image as ImageIcon,
  Copy,
} from 'lucide-react';
import usePropertyStore from '../store/propertyStore';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';

const MyProperties = () => {
  const { myProperties, loading, error, fetchMyProperties } = usePropertyStore();
  const navigate = useNavigate();
  const [activeGallery, setActiveGallery] = useState(null);

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const handleCopyId = async (id) => {
    try {
      await navigator.clipboard.writeText(id);
      alert('Property ID copied!');
    } catch (err) {
      alert('Failed to copy ID');
    }
  };

  const handleEdit = (property) => {
    navigate('/add-property', { state: { editData: property } });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        const res = await api.delete(`/properties/${id}`);
        if (res.data.success) {
          fetchMyProperties(true);
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting property');
      }
    }
  };

  // 1. Loading State (Skeleton UI)
  if (loading && myProperties.length === 0) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        <div className="h-20 w-1/3 bg-gray-100 animate-pulse rounded-2xl" />
        <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden">
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className="h-24 w-full bg-gray-50/50 animate-pulse border-b border-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100">
          <p className="text-red-500 font-bold text-lg mb-4">{error}</p>
          <button
            onClick={() => fetchMyProperties(true)}
            className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-600 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto relative min-h-screen">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 px-2 gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">My Inventory</h1>
          <p className="text-gray-500 mt-1 font-medium">
            Manage and monitor your property listings professionally.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-[1.5rem] shadow-sm border border-gray-100">
          <div className="px-6 py-2">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">
              Total Assets
            </p>
            <p className="text-2xl font-black text-indigo-600 leading-none">
              {myProperties.length}
            </p>
          </div>
        </div>
      </div>

      {/* --- MAIN TABLE SECTION --- */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/80 border-b border-gray-100">
                <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Main Details
                </th>
                <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Description
                </th>
                <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Layout Stats
                </th>
                <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Owner
                </th>
                <th className="px-6 py-6 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {myProperties.map((property, index) => (
                <motion.tr
                  key={property._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-indigo-50/40 transition-all group"
                >
                  {/* Column 1: Property Basic Info */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-5">
                      <div
                        onClick={() => setActiveGallery(property.images)}
                        className="relative h-20 w-20 shrink-0 cursor-zoom-in group/img rounded-[1.5rem] overflow-hidden shadow-lg border-2 border-white"
                      >
                        <img
                          src={property.images?.[0]?.url || 'https://via.placeholder.com/150'}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover/img:scale-125"
                        />
                        <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-all">
                          <ImageIcon size={20} className="text-white" />
                        </div>
                        <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-black text-indigo-600 shadow-sm">
                          {property.images?.length || 0}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="bg-indigo-100 text-indigo-700 text-[9px] font-black px-2 py-0.5 rounded-md uppercase w-fit tracking-tighter">
                          {property.type}
                        </span>
                        <h3 className="font-black text-gray-800 text-base leading-tight truncate max-w-[200px]">
                          {property.title}
                        </h3>
                        <div className="flex items-center text-emerald-600 font-black text-sm">
                          <IndianRupee size={14} strokeWidth={3} />
                          {Number(property.price).toLocaleString('en-IN')}
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold italic">
                          <MapPin size={10} className="text-rose-500" /> {property.location}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Description */}
                  <td className="px-6 py-5 max-w-[280px]">
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 font-medium">
                      {property.description}
                    </p>
                  </td>

                  {/* Column 3: Stats */}
                  <td className="px-6 py-5">
                    <div className="grid grid-cols-2 gap-y-3 gap-x-6 w-fit bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100/50 rounded-lg text-blue-600">
                          <BedDouble size={14} />
                        </div>
                        <div>
                          <p className="text-[9px] text-gray-400 font-black uppercase leading-none">
                            Beds
                          </p>
                          <p className="text-xs font-black text-gray-800">{property.bedrooms}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100/50 rounded-lg text-purple-600">
                          <Bath size={14} />
                        </div>
                        <div>
                          <p className="text-[9px] text-gray-400 font-black uppercase leading-none">
                            Baths
                          </p>
                          <p className="text-xs font-black text-gray-800">{property.bathrooms}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 col-span-2 border-t border-gray-100 pt-2 mt-1">
                        <div className="p-2 bg-amber-100/50 rounded-lg text-amber-600">
                          <Maximize size={14} />
                        </div>
                        <div>
                          <p className="text-[9px] text-gray-400 font-black uppercase leading-none">
                            Total Area
                          </p>
                          <p className="text-xs font-black text-gray-800">
                            {property.area} <span className="text-[9px] text-gray-400">SQFT</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Column 4: Owner Profile */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px]">
                        <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-indigo-500">
                          <User size={16} />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                          Host
                        </p>
                        <p className="text-xs font-black text-gray-700">
                          {property.owner?.name || 'Premium User'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Column 5: Action Buttons */}
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2.5">
                      <button
                        onClick={() => handleCopyId(property._id)}
                        title="Copy Property ID"
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 text-slate-600 hover:bg-slate-900 hover:text-white transition-all hover:shadow-lg border border-gray-100"
                      >
                        <Copy size={18} />
                      </button>
                      <button
                        title="Open Details"
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-indigo-600 hover:text-white transition-all hover:shadow-lg hover:shadow-indigo-200 border border-gray-100"
                      >
                        <ExternalLink size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(property)}
                        title="Edit Listing"
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all hover:shadow-lg hover:shadow-indigo-200 border border-gray-100"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(property._id)}
                        title="Remove Listing"
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 text-rose-500 hover:bg-rose-600 hover:text-white transition-all hover:shadow-lg hover:shadow-rose-200 border border-gray-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- EMPTY STATE --- */}
        {!myProperties.length && (
          <div className="text-center py-32 bg-slate-50/30">
            <div className="relative inline-block mb-6">
              <div className="bg-white h-24 w-24 rounded-full flex items-center justify-center shadow-2xl mx-auto">
                <Layers className="text-indigo-200" size={40} />
              </div>
              <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center text-white border-4 border-white">
                <ImageIcon size={14} />
              </div>
            </div>
            <h2 className="text-2xl font-black text-gray-800 italic">No Properties Found!</h2>
            <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto font-medium">
              Looks like your inventory is empty. Click "Add Property" to start listing.
            </p>
          </div>
        )}
      </div>

      {/* --- IMAGE GALLERY MODAL --- */}
      <AnimatePresence>
        {activeGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
          >
            {/* Close Icon */}
            <button
              onClick={() => setActiveGallery(null)}
              className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white text-white hover:text-black rounded-full transition-all z-[110] border border-white/20"
            >
              <X size={28} />
            </button>

            {/* Gallery Grid */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-6xl overflow-y-auto no-scrollbar max-h-[85vh] p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeGallery.map((img, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`${idx === 0 ? 'md:col-span-2 lg:col-span-2 lg:row-span-2' : ''} relative group rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10`}
                  >
                    <img
                      src={img.url}
                      alt="Property"
                      className="w-full h-full object-cover min-h-[300px] max-h-[600px] transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <div className="mt-8 flex items-center gap-3">
              <span className="h-[1px] w-12 bg-white/20" />
              <p className="text-white font-black text-sm tracking-widest uppercase italic">
                {activeGallery.length} High Resolution Images
              </p>
              <span className="h-[1px] w-12 bg-white/20" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyProperties;
