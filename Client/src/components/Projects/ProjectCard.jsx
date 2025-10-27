import React, { useState } from 'react';
import { useProject } from '../../contexts/ProjectContext';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project, viewMode, onUpdate }) => {
  const { deleteProject, duplicateProject, updateProject } = useProject();
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const projectDate = new Date(date);
    const diffInMs = now - projectDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return formatDate(date);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityIcon = (complexity) => {
    switch (complexity) {
      case 'simple': return '●';
      case 'medium': return '●●';
      case 'complex': return '●●●';
      default: return '●';
    }
  };

  const handleOpenProject = () => {
    navigate(`/?projectId=${project._id}`);
  };

  const handleDuplicate = async (e) => {
    e.stopPropagation();
    setIsDuplicating(true);
    try {
      await duplicateProject(project._id, `${project.name} (Copy)`);
      onUpdate();
    } catch (error) {
      console.error('Error duplicating project:', error);
    } finally {
      setIsDuplicating(false);
      setShowActions(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await deleteProject(project._id);
      onUpdate();
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setIsDeleting(false);
      setShowActions(false);
    }
  };

  const handleToggleTemplate = async (e) => {
    e.stopPropagation();
    try {
      await updateProject(project._id, { isTemplate: !project.isTemplate });
      onUpdate();
    } catch (error) {
      console.error('Error updating template status:', error);
    } finally {
      setShowActions(false);
    }
  };

  const handleArchive = async (e) => {
    e.stopPropagation();
    const newStatus = project.status === 'archived' ? 'draft' : 'archived';
    try {
      await updateProject(project._id, { status: newStatus });
      onUpdate();
    } catch (error) {
      console.error('Error updating project status:', error);
    } finally {
      setShowActions(false);
    }
  };

  if (viewMode === 'list') {
    return (
      <div 
        className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleOpenProject}
      >
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
          {project.preview?.thumbnailUrl ? (
            <img 
              src={project.preview.thumbnailUrl} 
              alt={project.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-2xl">📄</span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{project.name}</h3>
            <div className="flex gap-2">
              {project.isTemplate && 
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">Template</span>
              }
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{project.product?.name || 'No product'}</span>
            <span>{project.metadata.totalElements} elements</span>
            <span>{getComplexityIcon(project.metadata.complexity)} {project.metadata.complexity}</span>
            <span>Modified {formatTimeAgo(project.updatedAt)}</span>
          </div>
        </div>

        <div className="relative">
          <button
            className="hover:bg-gray-100 rounded-full" style={{padding: '0.5rem'}}
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
          >
            ⋮
          </button>

          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
              <button 
                onClick={handleDuplicate} 
                disabled={isDuplicating}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
              >
                {isDuplicating ? 'Duplicating...' : 'Duplicate'}
              </button>
              <button 
                onClick={handleToggleTemplate}
                className="w-full text-left px-4 py-2 hover:bg-gray-50"
              >
                {project.isTemplate ? 'Remove from Templates' : 'Make Template'}
              </button>
              <button 
                onClick={handleArchive}
                className="w-full text-left px-4 py-2 hover:bg-gray-50"
              >
                {project.status === 'archived' ? 'Unarchive' : 'Archive'}
              </button>
              <button 
                onClick={handleDelete} 
                disabled={isDeleting}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
      onClick={handleOpenProject}
    >
      <div className="relative aspect-video bg-gray-100">
        {project.preview?.thumbnailUrl ? (
          <img 
            src={project.preview.thumbnailUrl} 
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">📄</span>
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          <button
            className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full" style={{padding: '0.5rem'}}
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
          >
            ⋮
          </button>
        </div>

        {showActions && (
          <div className="absolute top-20 right-2 w-48 bg-white rounded-lg shadow-lg border z-10">
            <button 
              onClick={handleDuplicate} 
              disabled={isDuplicating}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
            >
              {isDuplicating ? 'Duplicating...' : 'Duplicate'}
            </button>
            <button 
              onClick={handleToggleTemplate}
              className="w-full text-left px-4 py-2 hover:bg-gray-50"
            >
              {project.isTemplate ? 'Remove from Templates' : 'Make Template'}
            </button>
            <button 
              onClick={handleArchive}
              className="w-full text-left px-4 py-2 hover:bg-gray-50"
            >
              {project.status === 'archived' ? 'Unarchive' : 'Archive'}
            </button>
            <button 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      <div className="p-4" style={{paddingLeft: '0.5rem', paddingRight: '0.5rem'}}>
        <div className="flex items-center justify-between mb-2" style={{marginLeft: '-0.5rem'}}>
          <h3 className="font-semibold text-gray-900 truncate">{project.name}</h3>
          <div className="flex gap-2">
            {project.isTemplate &&
              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">Template</span>
            }
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-2 truncate" style={{marginLeft: '-0.5rem'}}>
          {project.product?.name || 'No product selected'}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500" style={{marginLeft: '-0.5rem'}}>
          <div className="flex gap-2">
            <span>{project.metadata.totalElements} elements</span>
            <span>{getComplexityIcon(project.metadata.complexity)} {project.metadata.complexity}</span>
          </div>
          <span>{formatTimeAgo(project.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;