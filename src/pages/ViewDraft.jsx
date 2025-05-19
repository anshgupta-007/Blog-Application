import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FileText, Calendar, Edit3, Trash2, BookOpen, Clock, RefreshCw } from 'lucide-react';
import { setDraftId } from '../slices/blogSlice';


const ViewDraft = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const baseURL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const deleteDraftHandler = async (draftId) => {
    try {
      setDeleting(draftId);
      const response = await axios.delete(`${baseURL}/blogs/delete/${draftId}`, {
        headers: {  
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log(response.data);
      if (response.status === 200) {
        setDrafts(drafts.filter((draft) => draft._id !== draftId));
        toast.success("Draft deleted successfully!");
      }
    } catch (err) {
      console.error('Error deleting draft:', err);
      toast.error("Failed to delete draft. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const EditDraftHandler = (draftId) => {
    dispatch(setDraftId(draftId));
    // console.log(useSelector((state) => state.blog.draftId));
    console.log("Draft ID: ", draftId);
    navigate(`/editBlog/${draftId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

   const fetchDrafts = async () => {
    try {
      setLoading(true);
      console.log("Token: ", token);
      const response = await axios.get(`${baseURL}/blogs/getuserblogs`, {
        params: {
          email: user.email,
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log(response.data);
      setDrafts(response.data.blogs);
    } catch (err) {
      console.error('Error fetching drafts:', err);
      toast.error('Failed to load drafts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mb-8"></div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-gray-100 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-blue-100 rounded-full w-16"></div>
                    <div className="h-6 bg-blue-100 rounded-full w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-28">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
                <h1 className="text-4xl font-bold text-gray-800">Your Drafts</h1>
              </div>
              <p className="text-gray-600">
                {drafts.length} {drafts.length === 1 ? 'draft' : 'drafts'} waiting to be published
              </p>
            </div>
            <button
              onClick={fetchDrafts}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {drafts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No drafts yet</h3>
              <p className="text-gray-500 mb-6">Start writing your first blog post!</p>
              <button 
                onClick={() => navigate('/createBlog')}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Create New Post
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {drafts.map((draft) => (
              <div 
                key={draft._id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                        {draft.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(draft.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{getReadingTime(draft.content)} min read</span>
                        </div>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                          Draft
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div className="mb-6">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {draft.content.slice(0, 200)}
                      {draft.content.length > 200 && (
                        <span className="text-blue-600 font-medium">... read more</span>
                      )}
                    </p>
                  </div>

                  {/* Tags */}
                  {draft.tags && draft.tags.length > 0 && (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {draft.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors duration-200"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => EditDraftHandler(draft._id)}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Draft
                    </button>
                    <button
                      onClick={() => deleteDraftHandler(draft._id)}
                      disabled={deleting === draft._id}
                      className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className={`w-4 h-4 ${deleting === draft._id ? 'animate-spin' : ''}`} />
                      {deleting === draft._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDraft;