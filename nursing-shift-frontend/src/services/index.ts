import api from './api';
import type { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest,
  Shift,
  ShiftAssignment,
  LeaveRequest,
  CreateShiftRequest,
  AssignShiftRequest,
  CreateLeaveRequestRequest,
  UpdateLeaveRequestRequest
} from '../types';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};

export const shiftsService = {
  createShift: async (data: CreateShiftRequest): Promise<Shift> => {
    const response = await api.post('/shifts', data);
    return response.data;
  },

  assignShift: async (data: AssignShiftRequest) => {
    const response = await api.post('/shifts/assign', data);
    return response.data;
  },

  joinShift: async (shiftId: number) => {
    const response = await api.post('/shifts/join', { shiftId });
    return response.data;
  },

  getMySchedule: async (): Promise<ShiftAssignment[]> => {
    const response = await api.get('/shifts/my-schedule');
    return response.data;
  },

  getAllShifts: async (): Promise<Shift[]> => {
    const response = await api.get('/shifts');
    return response.data;
  },

  getShiftAssignments: async (shiftId: number) => {
    const response = await api.get(`/shifts/${shiftId}/assignments`);
    return response.data;
  },
};

export const leaveRequestsService = {
  createLeaveRequest: async (data: CreateLeaveRequestRequest): Promise<LeaveRequest> => {
    const response = await api.post('/leave-requests', data);
    return response.data;
  },

  getAllLeaveRequests: async (): Promise<LeaveRequest[]> => {
    const response = await api.get('/leave-requests');
    return response.data;
  },

  getMyLeaveRequests: async (): Promise<LeaveRequest[]> => {
    const response = await api.get('/leave-requests/my-requests');
    return response.data;
  },

  updateLeaveRequest: async (id: number, data: UpdateLeaveRequestRequest): Promise<LeaveRequest> => {
    const response = await api.patch(`/leave-requests/${id}/approve`, data);
    return response.data;
  },
};
