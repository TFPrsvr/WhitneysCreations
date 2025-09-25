import React from 'react';

const ProjectStats = ({ stats }) => {
  if (!stats?.stats) return null;

  const { stats: projectStats, categoryStats, recentActivity } = stats;

  const statCards = [
    {
      title: 'Total Projects',
      value: projectStats.totalProjects || 0,
      icon: '📁',
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500'
    },
    {
      title: 'Draft Projects',
      value: projectStats.draftProjects || 0,
      icon: '🖊️',
      color: 'bg-gradient-to-r from-orange-500 to-red-500'
    },
    {
      title: 'Completed',
      value: projectStats.completedProjects || 0,
      icon: '✅',
      color: 'bg-gradient-to-r from-emerald-500 to-green-500'
    },
    {
      title: 'Templates',
      value: projectStats.templates || 0,
      icon: '📄',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 justify-items-center">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-4 text-center hover:shadow-xl transition-shadow duration-200 w-full max-w-xs">
            <div className="flex flex-col items-center space-y-2">
              <div className="text-3xl mb-1">
                {card.icon}
              </div>
              <div className="text-center">
                <p className="text-base font-medium mb-1" style={{color: '#1f2937'}}>{card.title}</p>
                <p className="text-3xl font-semibold" style={{color: '#111827'}}>{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categoryStats && categoryStats.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categoryStats.slice(0, 8).map((category, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-primary-600">{category.count}</div>
                <div className="text-sm text-gray-600 capitalize">{category._id}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectStats;