import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import axios from 'axios';

const Report = ({ addLog }) => {
  const [tasks, setTasks] = useState({
    allTasks: [],
    backgroundRemovalTasks: [],
    backgroundGenerationTasks: [],
    mergeGenerationTasks: [],
    scraperTasks: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Normalize paths for display (handle / and \, remove extra images/)
  const normalizePath = (path) => {
    if (!path || typeof path !== 'string') return 'N/A';
    let normalized = path.replace(/\\/g, '/'); // Convert \ to /
    normalized = normalized.replace(/^(images\/)+/, ''); // Remove leading images/
    return `http://localhost:8000/static/${normalized}`;
  };

  // Validate image URL
  const validateImageUrl = async (url) => {
    if (!url || url === 'N/A' || url.startsWith('data:image')) return true;
    try {
      const response = await fetch(url, { method: 'HEAD', timeout: 5000 });
      return response.ok;
    } catch {
      return false;
    }
  };

  // Fetch tasks from all endpoints
  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const endpoints = [
        { key: 'allTasks', url: 'http://127.0.0.1:8000/api/tasks', label: 'All Tasks' },
        { key: 'backgroundRemovalTasks', url: 'http://127.0.0.1:8000/api/background/tasks', label: 'Background Removal Tasks' },
        { key: 'backgroundGenerationTasks', url: 'http://127.0.0.1:8000/api/generation/tasks', label: 'Background Generation Tasks' },
        { key: 'mergeGenerationTasks', url: 'http://127.0.0.1:8000/api/generation/merge/tasks', label: 'Merge Generation Tasks' },
        { key: 'scraperTasks', url: 'http://127.0.0.1:8000/api/scrapers/tasks', label: 'Scraper Tasks' },
      ];

      const results = {};
      let hasTasks = false;
      for (const { key, url, label } of endpoints) {
        try {
          addLog(`ℹ️ Fetching ${label} from ${url}`, 'info');
          const response = await axios.get(url, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000,
          });
          const taskData = response.data.tasks || [];
          console.log(`Raw ${label} response:`, response.data); // Debug raw data
          results[key] = await Promise.all(
            taskData.map(async (task) => {
              const metadata = task.metadata || {};
              if (metadata.output_path) {
                const normalizedPath = normalizePath(metadata.output_path);
                const isValid = await validateImageUrl(normalizedPath);
                return {
                  ...task,
                  metadata: {
                    ...metadata,
                    output_path: normalizedPath,
                    output_path_valid: isValid,
                  },
                };
              }
              return task;
            })
          );
          if (taskData.length > 0) hasTasks = true;
          addLog(`✅ Fetched ${taskData.length} ${label}`, 'success');
        } catch (err) {
          const errorMsg = err.response?.data?.detail || err.message;
          addLog(`❌ Failed to fetch ${label}: ${errorMsg}`, 'error');
          results[key] = [];
        }
      }

      setTasks(results);
      if (!hasTasks) {
        setError('No tasks found across all endpoints. Ensure the backend is running and tasks have been created.');
      }
    } catch (err) {
      setError(`Failed to fetch tasks: ${err.message}. Check backend logs at scraper.log for details.`);
      addLog(`❌ Error fetching tasks: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Render task table for a given task type
  const renderTaskTable = (taskType, tasks, title) => (
    <div className="bg-gray-900/50 p-6 rounded-xl border border-white/10 mb-6">
      <h3 className="text-lg font-medium text-white mb-4">{title}</h3>
      {tasks.length === 0 ? (
        <p className="text-gray-400">No {title.toLowerCase()} found. Check if tasks were created for this category.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-2 px-4">Task ID</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Created At</th>
                <th className="py-2 px-4">Metadata</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.task_id} className="border-b border-white/10">
                  <td className="py-2 px-4">{task.task_id}</td>
                  <td className="py-2 px-4">{task.status}</td>
                  <td className="py-2 px-4">{new Date(task.created_at).toLocaleString()}</td>
                  <td className="py-2 px-4">
                    <pre className="text-xs bg-gray-800/50 p-2 rounded">
                      {JSON.stringify(
                        {
                          ...task.metadata,
                          output_path: task.metadata.output_path,
                          output_path_status: task.metadata.output_path_valid !== undefined
                            ? task.metadata.output_path_valid ? 'Accessible' : 'Inaccessible'
                            : 'N/A'
                        },
                        null,
                        2
                      )}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
      <h2 className="text-xl font-medium text-white mb-6">Task Reports</h2>
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center mb-6">
          <AlertCircle className="w-5 h-5 text-red-300 mr-2" />
          <p className="text-red-300">{error}</p>
        </div>
      )}
      {loading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin h-8 w-8 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <div className="space-y-6">
          {renderTaskTable('allTasks', tasks.allTasks, 'All Tasks')}
          {renderTaskTable('backgroundRemovalTasks', tasks.backgroundRemovalTasks, 'Background Removal Tasks')}
          {renderTaskTable('backgroundGenerationTasks', tasks.backgroundGenerationTasks, 'Background Generation Tasks')}
          {renderTaskTable('mergeGenerationTasks', tasks.mergeGenerationTasks, 'Merge Generation Tasks')}
          {renderTaskTable('scraperTasks', tasks.scraperTasks, 'Scraper Tasks')}
        </div>
      )}
    </div>
  );
};

export default Report;