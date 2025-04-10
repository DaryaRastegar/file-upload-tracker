# Project Name

## Description
A brief description of your project and its purpose.

## Reflection Questions

### 1. What did you choose to mock the API and why?
I chose to mock the API using a **mock server** ( `MSW`) to simulate the real backend. The reason for doing this was to quickly test the frontend logic and ensure that components like file upload and task polling were functioning correctly without needing a real backend setup. This approach allowed for faster development and testing, especially when the backend API was not available or was still in development.

### 2. If you used an AI tool, what parts did it help with?
I used **ChatGPT** to help with:
- Writing and improving the code structure for React hooks (`useUploadFile`, `useTaskStatus`).
- Debugging TypeScript errors and suggesting optimal solutions for managing side effects in React.
- Providing guidance on the organization of custom hooks for a clean and modular approach.

AI was especially useful in debugging complex issues like the `startPolling` hook order problem and suggesting patterns for better code separation.

### 3. What tradeoffs or shortcuts did you take?
Some of the tradeoffs included:
- Using **mocked data** for API calls rather than connecting to a real backend service. While this accelerated development, it limited the ability to test with live data.
- I opted for a **simpler polling mechanism** that could be further optimized for better error handling and cancellation in real-world scenarios.

I took shortcuts to prioritize getting the core functionality working quickly rather than optimizing performance or making the solution more flexible for different use cases.

### 4. What would you improve or add with more time?
With more time, I would focus on:
- Implementing **real API integration** for file uploads and task status polling.
- Adding **more robust error handling** and validation, such as retrying failed uploads and canceling tasks more efficiently.
- Improving the **UI** and user experience, for example, by adding progress bars for uploads and polling statuses.
- **Optimizing performance**, especially around frequent polling, by using more advanced techniques like debouncing or using WebSockets for real-time updates.

### 5. What was the trickiest part and how did you debug it?
The trickiest part was managing the **polling mechanism** for checking task statuses. It was difficult to ensure that polling only started after the task was uploaded and that it stopped correctly once the task reached a final state (`completed` or `failed`).

I debugged it by:
- **Using `console.log`** to trace the execution flow and ensure that polling was starting and stopping at the correct times.
- Refactoring the `startPolling` function to ensure that it was only called after a successful upload, which involved modifying how I used hooks in React.

By setting up proper logging and testing the polling mechanism step-by-step, I was able to isolate the issue and resolve it effectively.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DaryaRastegar/file-upload-tracker.git
