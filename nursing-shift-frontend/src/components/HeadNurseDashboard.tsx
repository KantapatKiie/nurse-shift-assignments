import { useState, useEffect } from 'react';
import { shiftsService, leaveRequestsService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import type { Shift, LeaveRequest, CreateShiftRequest, AssignShiftRequest } from '../types';

const HeadNurseDashboard = () => {
  const { user } = useAuth();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [shiftAssignments, setShiftAssignments] = useState<{[key: number]: any[]}>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('shifts');
  const [showCreateShiftModal, setShowCreateShiftModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  // Form states
  const [shiftForm, setShiftForm] = useState<CreateShiftRequest>({
    date: '',
    start_time: '',
    end_time: '',
  });
  const [assignForm, setAssignForm] = useState<AssignShiftRequest>({
    user_id: 0,
    shift_id: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [shiftsData, leaveData] = await Promise.all([
        shiftsService.getAllShifts(),
        leaveRequestsService.getAllLeaveRequests(),
      ]);
      setShifts(shiftsData);
      setLeaveRequests(leaveData);

      // Load assignments for each shift
      const assignments: {[key: number]: any[]} = {};
      for (const shift of shiftsData) {
        try {
          const shiftAssignmentsData = await shiftsService.getShiftAssignments(shift.id);
          assignments[shift.id] = shiftAssignmentsData;
        } catch (error) {
          console.error(`Failed to load assignments for shift ${shift.id}:`, error);
          assignments[shift.id] = [];
        }
      }
      setShiftAssignments(assignments);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShift = async () => {
    try {
      await shiftsService.createShift(shiftForm);
      setShowCreateShiftModal(false);
      setShiftForm({ date: '', start_time: '', end_time: '' });
      loadData();
    } catch (error) {
      console.error('Failed to create shift:', error);
    }
  };

  const handleAssignShift = async () => {
    try {
      await shiftsService.assignShift(assignForm);
      setShowAssignModal(false);
      setAssignForm({ user_id: 0, shift_id: 0 });
      setSelectedShift(null);
      
      // Reload data to show updated assignments
      await loadData();
    } catch (error) {
      console.error('Failed to assign shift:', error);
    }
  };

  const handleLeaveRequestAction = async (requestId: number, status: 'approved' | 'rejected') => {
    try {
      await leaveRequestsService.updateLeaveRequest(requestId, { status });
      loadData();
    } catch (error) {
      console.error('Failed to update leave request:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'อนุมัติ';
      case 'rejected':
        return 'ปฏิเสธ';
      default:
        return 'รอดำเนินการ';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          แดชบอร์ดหัวหน้าพยาบาล
        </h2>
        <p className="text-gray-600">ยินดีต้อนรับ, {user?.name}</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('shifts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'shifts'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            จัดการเวร
          </button>
          <button
            onClick={() => setActiveTab('pending-requests')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pending-requests'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            คำขอลา ({leaveRequests.filter(r => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('leave-history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'leave-history'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            ประวัติคำขอลา
          </button>
        </nav>
      </div>

      {/* Shifts Tab */}
      {activeTab === 'shifts' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">เวรทั้งหมด</h3>
            <button
              onClick={() => setShowCreateShiftModal(true)}
              className="btn-primary"
            >
              สร้างเวรใหม่
            </button>
          </div>
          <div className="card p-6">
            {shifts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">ไม่มีเวรในระบบ</p>
            ) : (
              <div className="space-y-4">
                {shifts.map((shift) => (
                  <div
                    key={shift.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatDate(shift.date)}
                        </p>
                        <p className="text-sm text-gray-600">
                          เวลา: {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedShift(shift);
                          setAssignForm({ ...assignForm, shift_id: shift.id });
                          setShowAssignModal(true);
                        }}
                        className="btn-secondary"
                      >
                        มอบหมายเวร
                      </button>
                    </div>

                    {/* Assigned Nurses */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm font-medium text-gray-700 mb-2">พยาบาลที่ได้รับมอบหมาย:</p>
                      {shiftAssignments[shift.id] && shiftAssignments[shift.id].length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {shiftAssignments[shift.id].map((assignment, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {assignment.user?.name || assignment.user?.email || 'Unknown'}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">ยังไม่มีพยาบาลได้รับมอบหมาย</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pending Leave Requests Tab */}
      {activeTab === 'pending-requests' && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-6">คำขอลา - รอดำเนินการ</h3>
          <div className="card p-6">
            {leaveRequests.filter(r => r.status === 'pending').length === 0 ? (
              <p className="text-gray-500 text-center py-8">ไม่มีคำขอลาที่รอดำเนินการ</p>
            ) : (
              <div className="space-y-4">
                {leaveRequests
                  .filter(request => request.status === 'pending')
                  .map((request) => (
                  <div
                    key={request.id}
                    className="p-4 border border-gray-200 rounded-lg bg-yellow-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-gray-900">
                            {request.shiftAssignment?.user.name}
                          </p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            รอดำเนินการ
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          เวรวันที่: {formatDate(request.shiftAssignment?.shift.date || '')}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          เวลา: {formatTime(request.shiftAssignment?.shift.start_time || '')} - {formatTime(request.shiftAssignment?.shift.end_time || '')}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          เหตุผล: {request.reason}
                        </p>
                        <p className="text-xs text-gray-500">
                          วันที่ขอ: {formatDate(request.created_at)}
                        </p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleLeaveRequestAction(request.id, 'approved')}
                          className="btn-success text-sm"
                        >
                          อนุมัติ
                        </button>
                        <button
                          onClick={() => handleLeaveRequestAction(request.id, 'rejected')}
                          className="btn-danger text-sm"
                        >
                          ปฏิเสธ
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leave History Tab */}
      {activeTab === 'leave-history' && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-6">ประวัติคำขอลา</h3>
          <div className="card p-6">
            {leaveRequests.filter(r => r.status !== 'pending').length === 0 ? (
              <p className="text-gray-500 text-center py-8">ยังไม่มีประวัติคำขอลา</p>
            ) : (
              <div className="space-y-4">
                {leaveRequests
                  .filter(request => request.status !== 'pending')
                  .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())
                  .map((request) => (
                  <div
                    key={request.id}
                    className={`p-4 border border-gray-200 rounded-lg ${
                      request.status === 'approved' ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-gray-900">
                            {request.shiftAssignment?.user.name}
                          </p>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              request.status
                            )}`}
                          >
                            {getStatusText(request.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          เวรวันที่: {formatDate(request.shiftAssignment?.shift.date || '')}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          เวลา: {formatTime(request.shiftAssignment?.shift.start_time || '')} - {formatTime(request.shiftAssignment?.shift.end_time || '')}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          เหตุผล: {request.reason}
                        </p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>วันที่ขอ: {formatDate(request.created_at)}</span>
                          {request.updated_at && request.updated_at !== request.created_at && (
                            <span>ดำเนินการเมื่อ: {formatDate(request.updated_at)}</span>
                          )}
                        </div>
                        {request.approved_by && (
                          <p className="text-xs text-gray-500 mt-1">
                            ดำเนินการโดย: หัวหน้าพยาบาล
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Shift Modal */}
      {showCreateShiftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">สร้างเวรใหม่</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="date" className="form-label">
                  วันที่
                </label>
                <input
                  id="date"
                  type="date"
                  className="form-input"
                  value={shiftForm.date}
                  onChange={(e) => setShiftForm({ ...shiftForm, date: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="start_time" className="form-label">
                  เวลาเริ่ม
                </label>
                <input
                  id="start_time"
                  type="time"
                  className="form-input"
                  value={shiftForm.start_time}
                  onChange={(e) => setShiftForm({ ...shiftForm, start_time: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="end_time" className="form-label">
                  เวลาสิ้นสุด
                </label>
                <input
                  id="end_time"
                  type="time"
                  className="form-input"
                  value={shiftForm.end_time}
                  onChange={(e) => setShiftForm({ ...shiftForm, end_time: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateShiftModal(false);
                  setShiftForm({ date: '', start_time: '', end_time: '' });
                }}
                className="btn-secondary"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleCreateShift}
                disabled={!shiftForm.date || !shiftForm.start_time || !shiftForm.end_time}
                className="btn-primary disabled:opacity-50"
              >
                สร้างเวร
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Shift Modal */}
      {showAssignModal && selectedShift && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">มอบหมายเวร</h3>
            <p className="text-sm text-gray-600 mb-4">
              เวร: {formatDate(selectedShift.date)} ({formatTime(selectedShift.start_time)} - {formatTime(selectedShift.end_time)})
            </p>
            <div className="mb-4">
              <label htmlFor="user_id" className="form-label">
                ID พยาบาล
              </label>
              <input
                id="user_id"
                type="number"
                className="form-input"
                placeholder="กรอก ID ของพยาบาล (เช่น 2, 3, 4)"
                value={assignForm.user_id || ''}
                onChange={(e) => setAssignForm({ ...assignForm, user_id: parseInt(e.target.value) || 0 })}
              />
              <p className="text-xs text-gray-500 mt-1">
                หมายเหตุ: ในการใช้งานจริงจะมี dropdown ให้เลือกพยาบาล
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setAssignForm({ user_id: 0, shift_id: 0 });
                  setSelectedShift(null);
                }}
                className="btn-secondary"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleAssignShift}
                disabled={!assignForm.user_id}
                className="btn-primary disabled:opacity-50"
              >
                มอบหมาย
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeadNurseDashboard;
