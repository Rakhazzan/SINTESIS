const QuickActions = ({ actions }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="font-medium text-lg mb-4">Acciones rápidas</h2>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center"
          >
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-2">
              {action.icon}
            </div>
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;