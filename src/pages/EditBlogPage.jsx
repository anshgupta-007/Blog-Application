import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Save, X, Send, FileText, Tag, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'

const EditBlogPage = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState([])
  const [blogId, setBlogId] = useState(useSelector((state) => state.blog.draftId) || '');
  const [isLoading, setIsLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState('idle') // 'idle', 'saving', 'saved', 'error'
  const [lastSaved, setLastSaved] = useState(null)
  const [tagInput, setTagInput] = useState('');

  // Refs for auto-save logic
  const autoSaveTimerRef = useRef(null)
  const inactivityTimerRef = useRef(null)
  const hasUnsavedChangesRef = useRef(false)

  // Import URL from env
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  const token = useSelector((state) => state.auth.token)
  const navigate = useNavigate()

  // Auto-save function
  const autoSave = useCallback(async () => {
    if (!hasUnsavedChangesRef.current || !title.trim() || !content.trim()) {
      return
    }

    try {
      setSaveStatus('saving')
      
      if (!blogId) {
        const response = await axios.post(`${baseURL}/blogs/create`, {
          title,
          content,
          tags,
          token
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        setBlogId(response.data.id)
      } else {
        await axios.post(`${baseURL}/blogs/save-draft`, {
          title,
          content,
          tags,
          id: blogId,
          token,
          status: "draft"
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
      }
      
      hasUnsavedChangesRef.current = false
      setSaveStatus('saved')
      setLastSaved(new Date())
      
      // Reset to idle after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (err) {
      console.error('Auto-save error:', err)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }, [title, content, tags, blogId, token, baseURL])

  // Set up auto-save timers
  useEffect(() => {
    // Clear existing timers
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current)
    }
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }

    // Set up 30-second auto-save
    autoSaveTimerRef.current = setInterval(() => {
      autoSave()
    }, 30000)

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current)
      }
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
      }
    }
  }, [autoSave])

  // Handle input changes with inactivity timer
  const handleInputChange = useCallback((setter, value) => {
    setter(value)
    hasUnsavedChangesRef.current = true

    // Clear existing inactivity timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }

    // Set new inactivity timer (5 seconds)
    inactivityTimerRef.current = setTimeout(() => {
      autoSave()
    }, 5000)
  }, [autoSave])

  // Add the useEffect call to fetch the blog data by ID if Id is present
    useEffect(() => {
    const fetchBlogData = async () => {
        if (blogId) {
            try {
                console.log('Fetching blog data for ID:', blogId);
                const response = await axios.get(`${baseURL}/blogs/blogs/${blogId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                })
                const blogData = response.data.blog
                setTitle(blogData.title)
                setContent(blogData.content)
                setTags(blogData.tags)
                setTagInput(blogData.tags.join(', ')) // Set the input value for tags
            } catch (error) {
                console.error('Error fetching blog data:', error)
            }
        }
    }
    fetchBlogData()
    }, [blogId, token, baseURL]);

  const cancelHandler = async () => {
    try {
      setIsLoading(true)
      if (blogId) {
        await axios.delete(`${baseURL}/blogs/delete/${blogId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
      }
      toast.success('Draft deleted successfully!')
      setTitle('')
      setContent('')
      setTags([])
      setBlogId('')
      navigate('/')
    } catch (err) {
      console.error('Error cancelling draft:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const saveDraftHandler = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in at least the title and content')
      return
    }

    try {
      setIsLoading(true)
      setSaveStatus('saving')
      
      if (!blogId) {
        const response = await axios.post(`${baseURL}/blogs/create`, {
          title,
          content,
          tags,
          token
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        setBlogId(response.data.id)
      } else {
        await axios.post(`${baseURL}/blogs/save-draft`, {
          title,
          content,
          tags,
          id: blogId,
          token,
          status: "draft"
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
      }

      toast.success('Draft saved successfully!');
      
      hasUnsavedChangesRef.current = false
      setSaveStatus('saved')
      setLastSaved(new Date())
    } catch (err) {
      console.error('Save draft error:', err)
      setSaveStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  const publishHandler = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in at least the title and content')
      return
    }

    if (!blogId) {
      alert('Please save as draft first')
      return
    }

    try {
      setIsLoading(true)
      await axios.put(`${baseURL}/blogs/publish`, {
        title,
        content,
        tags,
        token,
        id: blogId,
        status: "published"
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      
      navigate('/')
    } catch (err) {
      console.error('Publish error:', err)
      alert('Error publishing blog post')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTagChange = (e) => {
    const value = e.target.value
    const newTags = value.split(',').map(tag => tag.trim()).filter(tag => tag)
    setTagInput(value)
    handleInputChange(setTags, newTags)
  }

  const removeTag = (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove)
    handleInputChange(setTags, newTags)
  }

  const getStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <Clock className="w-4 h-4 animate-spin text-blue-500" />
      case 'saved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...'
      case 'saved':
        return lastSaved ? `Saved at ${lastSaved.toLocaleTimeString()}` : 'Saved'
      case 'error':
        return 'Failed to save'
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-24">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Create New Post</h1>
              <p className="text-gray-600">Share your thoughts with the world</p>
            </div>
            
            {/* Auto-save status */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </div>
          </div>
        </div>

        {/* Main form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            {/* Title input */}
            <div className="mb-8">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <FileText className="w-4 h-4" />
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleInputChange(setTitle, e.target.value)}
                className="w-full text-3xl font-bold text-gray-800 border-none outline-none placeholder-gray-400 bg-transparent"
                placeholder="Give your post a compelling title..."
              />
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mt-4"></div>
            </div>

            {/* Content textarea */}
            <div className="mb-8">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => handleInputChange(setContent, e.target.value)}
                className="w-full h-96 text-lg text-gray-700 border border-gray-200 rounded-xl p-6 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Start writing your amazing content here..."
              />
            </div>

            {/* Tags input */}
            <div className="mb-8">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Tag className="w-4 h-4" />
                Tags
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={handleTagChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Add comma-separated tags..."
              />
              
              {/* Tag display */}
              {tags.length > 0 && (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors duration-200"
                      >
                        #{tag}
                        <button
                          onClick={() => removeTag(index)}
                          className="ml-1 hover:text-red-600 transition-colors duration-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <button
                onClick={cancelHandler}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>

              <div className="flex gap-3">
                <button
                  onClick={saveDraftHandler}
                  disabled={isLoading || !title.trim() || !content.trim()}
                  className="flex items-center gap-2 px-6 py-3 text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  <Save className="w-4 h-4" />
                  Save Draft
                </button>

                <button
                  onClick={publishHandler}
                  disabled={isLoading || !title.trim() || !content.trim() || !blogId}
                  className="flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-save info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Your work is automatically saved every 30 seconds and 5 seconds after you stop typing
          </p>
        </div>
      </div>
    </div>
  )
}

export default EditBlogPage