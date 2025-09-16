import { useState, useEffect } from 'react';
import { shiftsService, leaveRequestsService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import type { ShiftAssignment, LeaveRequest } from '../types';

const NurseDashboard = () => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<ShiftAssignment[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState<ShiftAssignment | null>(null);
  const [leaveReason, setLeaveReason] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [scheduleData, leaveData] = await Promise.all([
        shiftsService.getMySchedule(),
        leaveRequestsService.getMyLeaveRequests(),
      ]);
      
      // Filter out shifts that have pending or approved leave requests
      // But keep shifts with rejected leave requests
      const pendingOrApprovedLeaveShiftIds = leaveData
        .filter(request => request.status === 'pending' || request.status === 'approved')
        .map(request => request.shift_assignment_id);
      
      const filteredSchedule = scheduleData.filter(shift => 
        !pendingOrApprovedLeaveShiftIds.includes(shift.id)
      );
      
      setSchedule(filteredSchedule);
      setLeaveRequests(leaveData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestLeave = async () => {
    if (!selectedShift || !leaveReason.trim()) return;

    try {
      await leaveRequestsService.createLeaveRequest({
        shift_assignment_id: selectedShift.id,
        reason: leaveReason,
      });
      setShowLeaveModal(false);
      setLeaveReason('');
      setSelectedShift(null);
      loadData(); // Reload data
    } catch (error) {
      console.error('Failed to request leave:', error);
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
    return timeString.slice(0, 5); // Remove seconds
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
          แดชบอร์ดพยาบาล
        </h2>
        <p className="text-gray-600">ยินดีต้อนรับ, {user?.name}</p>
      </div>

      {/* Schedule Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">ตารางเวรของฉัน</h3>
        <div className="card p-6">
          {schedule.length === 0 ? (
            <p className="text-gray-500 text-center py-8">ไม่มีเวรที่ได้รับมอบหมาย</p>
          ) : (
            <div className="space-y-4">
              {schedule.map((shift) => (
                <div
                  key={shift.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
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
                      setShowLeaveModal(true);
                    }}
                    className="btn-secondary"
                  >
                    ขอลา
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Leave Requests Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">ประวัติการขอลา</h3>
        <div className="card p-6">
          {leaveRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">ไม่มีประวัติการขอลา</p>
          ) : (
            <div className="space-y-4">
              {leaveRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">
                      เวรวันที่: {formatDate(request.shiftAssignment?.shift.date || '')}
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
                    เหตุผล: {request.reason}
                  </p>
                  <p className="text-xs text-gray-500">
                    วันที่ขอ: {formatDate(request.created_at)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Leave Request Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">ขอลา</h3>
            <p className="text-sm text-gray-600 mb-4">
              เวรวันที่: {selectedShift && formatDate(selectedShift.date)}
            </p>
            <div className="mb-4">
              <label htmlFor="reason" className="form-label">
                เหตุผลในการขอลา
              </label>
              <textarea
                id="reason"
                rows={4}
                className="form-input"
                placeholder="กรุณาระบุเหตุผล..."
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowLeaveModal(false);
                  setLeaveReason('');
                  setSelectedShift(null);
                }}
                className="btn-secondary"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleRequestLeave}
                disabled={!leaveReason.trim()}
                className="btn-primary disabled:opacity-50"
              >
                ส่งคำขอ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NurseDashboard;
