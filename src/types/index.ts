export interface Task {
  id: string;
  fileName: string;
  status: 'pending' | 'success' | 'error' | 'cancelled';
}
