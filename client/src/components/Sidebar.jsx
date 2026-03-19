const Sidebar = () => {
  return (
    <div className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 p-4 flex flex-col">

      <h2 className="text-xl font-bold mb-6">ThinkFlow</h2>

      <button className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded-lg mb-4">
        + New Note
      </button>

      <div className="flex-1 space-y-2 overflow-y-auto">
        <div className="p-2 rounded-lg hover:bg-white/10 cursor-pointer">
          React Notes
        </div>
        <div className="p-2 rounded-lg hover:bg-white/10 cursor-pointer">
          AI Concepts
        </div>
      </div>

    </div>
  );
};

export default Sidebar;