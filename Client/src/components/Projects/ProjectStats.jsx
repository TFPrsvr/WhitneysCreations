
const ProjectStats = ({ stats }) => {
  if (!stats?.stats) return null;

  const { stats: projectStats, categoryStats, recentActivity } = stats;

  const statCards = [
    {
      title: 'Total Projects',
      value: projectStats.totalProjects || 0,
      icon: '📁',
      color: 'bg-blue-500'
    },
    {
      title: 'Draft Projects',
      value: projectStats.draftProjects || 0,
      icon: '✏️',
      color: 'bg-yellow-500'
    },
    {
      title: 'Completed',
      value: projectStats.completedProjects || 0,
      icon: '✅',
      color: 'bg-green-500'
    },
    {
      title: 'Templates',
      value: projectStats.templates || 0,
      icon: '📋',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl`}>
                {card.icon}
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