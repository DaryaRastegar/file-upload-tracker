import axios from 'axios';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'failed';

interface Task {
  taskId: string;
  status: TaskStatus;
}

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const queryClient = useQueryClient();

  // Simulated API call to get taskId after uploading a file
  const simulateUpload = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve('task_id_' + Math.random().toString(36).substr(2, 9)), 1000);
    });
  };

  // Mutation to simulate file upload and get a task_id
  const mutation = useMutation({
    mutationFn: simulateUpload,
    onSuccess: (taskId) => {
      console.log('Task created:', taskId);
      setTasks((prev) => [...prev, { taskId, status: 'pending' }]);
      startPolling(taskId);
    },
    onError: (err) => {
      console.error('Error uploading file:', err);
      setError('Upload failed');
    },
  });

  // Polling function to simulate task status checking
  const fetchTaskStatus = async (taskId: string): Promise<TaskStatus> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const statuses: TaskStatus[] = ['pending', 'in-progress', 'completed', 'failed'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        resolve(randomStatus);
      }, 2000);
    });
  };

  const startPolling = (taskId: string) => {
    const intervalId = setInterval(async () => {
      const status = await fetchTaskStatus(taskId);
      setTasks((prev) => prev.map((task) =>
        task.taskId === taskId ? { ...task, status } : task
      ));

      // Stop polling if the task is completed or failed
      if (status === 'completed' || status === 'failed') {
        clearInterval(intervalId);
      }
    }, 3000);

    // Store the interval ID as a number
    queryClient.setQueryData<number | undefined>(['taskPollingInterval', taskId], intervalId as unknown as number);
  };

  const cancelTaskPolling = (taskId: string) => {
    const intervalId = queryClient.getQueryData<number>(['taskPollingInterval', taskId]);
    if (intervalId) {
      clearInterval(intervalId);
      console.log('Polling stopped for task:', taskId);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Check if file size is greater than 2MB
      if (selectedFile.size > 2 * 1024 * 1024) {
        setError('File size exceeds 2MB');
        return;
      }

      // Check if file type is not PDF or image (JPEG/PNG)
      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(selectedFile.type)) {
        setError('Only PDFs or image files (JPEG/PNG) are allowed');
        return;
      }

      // If no errors, set the file
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = () => {
    if (file) {
      mutation.mutate(file);
    }
  };

  const handleCancelTask = (taskId: string) => {
    cancelTaskPolling(taskId);
    setTasks((prev) => prev.filter((task) => task.taskId !== taskId));
  };

  useEffect(() => {
    return () => {
      tasks.forEach((task) => cancelTaskPolling(task.taskId));
    };
  }, [tasks]);

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">File Upload</h2>

      <input
        type="file"
        onChange={handleFileChange}
        className="w-full p-3 mb-4 border border-gray-300 rounded-md"
      />
      {error && <p className="text-red-500 text-center">{error}</p>}

      <button
        onClick={handleUpload}
        disabled={mutation.isPending || error !== null}
        className={`w-full p-3 rounded-md text-white font-semibold ${mutation.isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        {mutation.isPending ? 'Uploading...' : 'Upload'}
      </button>

      <div className="mt-6">
        <h3 className="text-xl font-semibold">Task Statuses</h3>
        <ul>
          {tasks.map((task) => (
            <li key={task.taskId} className="flex justify-between items-center mt-2">
              <span>Task {task.taskId}: {task.status}</span>
              <button
                onClick={() => handleCancelTask(task.taskId)}
                className="bg-red-500 text-white px-3 py-1 rounded-md"
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileUploader;
