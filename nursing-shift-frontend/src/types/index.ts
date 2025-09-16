export interface User {
  id: number;
  name: string;
  email: string;
  role: 'nurse' | 'head_nurse';
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'nurse' | 'head_nurse';
}

export interface Shift {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface ShiftAssignment {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  shift_id: number;
}

export interface LeaveRequest {
  id: number;
  shift_assignment_id: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: number;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  shiftAssignment?: {
    id: number;
    shift: {
      id: number;
      date: string;
      start_time: string;
      end_time: string;
    };
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
}

export interface CreateShiftRequest {
  date: string;
  start_time: string;
  end_time: string;
}

export interface AssignShiftRequest {
  user_id: number;
  shift_id: number;
}

export interface CreateLeaveRequestRequest {
  shift_assignment_id: number;
  reason: string;
}

export interface UpdateLeaveRequestRequest {
  status: 'approved' | 'rejected';
}
