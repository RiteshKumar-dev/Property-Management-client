import React, { useState } from 'react';
import { Search, User, Mail, Users, AlertCircle, Loader2 } from 'lucide-react';
import usePropertyStore from '../store/propertyStore';

const InterestPropertyUserList = () => {
  const [inputId, setInputId] = useState('');
  const { fetchInterestedUsers, interestedUsersMap, loading, error } = usePropertyStore();

  // Store se specific property ke users nikalna
  const users = interestedUsersMap[inputId] || [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputId.trim()) {
      fetchInterestedUsers(inputId.trim());
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* --- HEADER --- */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center gap-3">
          <Users className="text-indigo-600" size={32} />
          Property Leads Tracker
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Enter your Property ID to see the list of users who showed interest.
        </p>
      </div>

      {/* --- SEARCH INPUT --- */}
      <form onSubmit={handleSearch} className="relative mb-10">
        <div className="relative group">
          <input
            type="text"
            placeholder="Paste Property ID here (e.g. 69a09845...)"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            className="w-full pl-12 pr-32 py-4 bg-white border-2 border-gray-100 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all duration-300"
          />
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
            size={20}
          />

          <button
            type="submit"
            disabled={loading || !inputId}
            className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-md"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : 'Fetch Leads'}
          </button>
        </div>
      </form>

      {/* --- ERROR MESSAGE --- */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* --- USERS LIST --- */}
      <div className="grid gap-4">
        {users.length > 0
          ? users.map((user) => (
              <div
                key={user._id}
                className="group bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <User size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">{user.name}</h4>
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <Mail size={14} className="text-gray-400" />
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block">
                  <span className="bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    Verified Lead
                  </span>
                </div>
              </div>
            ))
          : !loading &&
            inputId && (
              <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                <Users className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500 font-medium">
                  No one has shown interest yet or invalid ID.
                </p>
              </div>
            )}
      </div>
    </div>
  );
};

export default InterestPropertyUserList;
