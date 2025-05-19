import React, { useState, useEffect } from 'react';
import { Clock, Tag, Eye, Calendar, ChevronRight, Search } from 'lucide-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Added React Router imports
import {useSelector} from 'react-redux'; // Import useSelector from react-redux
const HomePage = () => {
  // State for API data
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate function

  

  useEffect(() => {
    // Simulate API fetch with a small delay
    const fetchData = async () => {
      try {
        const VITE_API_URL = import.meta.env.VITE_API_URL;
        // console.log(VITE_API_URL);
        const response = await axios.get(`${VITE_API_URL}/blogs/blogs`);
        
        setAllBlogs(response.data.blogs);
      } catch (err) {
        console.error('Error fetching home data:', err);
        setError('Failed to load content.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get all unique tags
  const allTags = [...new Set(allBlogs.flatMap(blog => blog.tags))];

  // Filter blogs based on search term and selected tag
  const filteredBlogs = allBlogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          blog.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag ? blog.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  // Function to handle blog card click
  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  // Function to truncate content
  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + '...';
  };

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-32 ">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Unread Blogs...</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the latest thoughts, ideas, and stories from our collection
          </p>
        </header>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8 flex flex-col pt-4 gap-4 items-center">
          <div className="relative ">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setSelectedTag(null)} 
              className={`px-3 py-1 rounded-full text-sm ${!selectedTag ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button 
                key={tag} 
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)} 
                className={`px-3 py-1 rounded-full text-sm ${tag === selectedTag ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog, index) => (
              <article 
                key={index} 
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 flex flex-col h-full cursor-pointer"
                onClick={() => handleBlogClick(blog._id)} // Added onClick handler
              >
                {/* Color accent at top */}
                <div className={`h-2 ${index % 3 === 0 ? 'bg-blue-500' : index % 3 === 1 ? 'bg-purple-500' : 'bg-green-500'}`}></div>
                
                <div className="p-6 flex-1 flex flex-col">
                  {/* Post Meta */}
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar size={14} className="mr-1" />
                    <span className="mr-4">{formatDate(blog.updatedAt)}</span>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-800 mb-3 hover:text-blue-600">{blog.title}</h2>
                  
                  {/* Content */}
                  <p className="text-gray-600 mb-4 flex-1">{truncateContent(blog.content)}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex} 
                        className="inline-flex items-center px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering parent onClick
                          setSelectedTag(tag);
                        }}
                      >
                        <Tag size={12} className="mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Read More Link */}
                  <div className="mt-auto">
                    <Link 
                      to={`/blog/${blog._id}`} 
                      className="inline-flex items-center text-blue-500 hover:text-blue-700 font-medium"
                      onClick={(e) => e.stopPropagation()} // Prevent duplicate navigation
                    >
                      Read more <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-lg text-gray-600">No blogs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;