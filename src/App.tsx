import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import FileUploader from './components/FileUploader';

function App() {
  return (
    <div className='w-full h-screen flex items-center justify-center bg-gray-100'>
      <FileUploader />
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
}

export default App;
