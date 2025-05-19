import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { View, Calendar, User, Clock, BookOpen } from 'lucide-react';

const ViewBlog = () => {
  const {id} = useParams(); // extract blog ID from URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const VITE_API_URL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${VITE_API_URL}/blogs/blogs/${id}`);
        console.log(response.data.blog);
        setBlog(response.data.blog);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center pt-28">
        <div className="text-center">
          <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-xl text-gray-600 font-medium">Blog not found.</p>
          <p className="text-gray-500 mt-2">The requested blog post could not be located.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-28">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <div className="flex items-center mb-4">
              <View className="h-8 w-8 mr-3" />
              <span className="text-lg font-medium opacity-90">Blog Post</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-6">{blog.title}</h1>
            
            {/* Meta Information */}
            <div className="flex flex-wrap gap-6 text-indigo-100">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span className="font-medium">{blog.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{formatDate(blog.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
            <Clock className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-gray-600 font-medium">Article Content</span>
          </div>
          
          <div 
            className="prose prose-lg max-w-none
                       prose-headings:text-gray-800 prose-headings:font-bold
                       prose-p:text-gray-700 prose-p:leading-relaxed
                       prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
                       prose-strong:text-gray-800 prose-strong:font-semibold
                       prose-blockquote:border-l-indigo-500 prose-blockquote:bg-indigo-50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg
                       prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                       prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg
                       prose-img:rounded-lg prose-img:shadow-md
                       prose-ul:space-y-2 prose-ol:space-y-2
                       prose-li:text-gray-700"
            dangerouslySetInnerHTML={{ __html: blog.content }} 
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-md">
            <BookOpen className="h-4 w-4 text-indigo-600 mr-2" />
            <span className="text-sm text-gray-600">Thank you for reading!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBlog;