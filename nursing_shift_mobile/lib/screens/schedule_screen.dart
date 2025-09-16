import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:intl/intl.dart';
import '../models/models.dart';
import '../services/api_service.dart';

class ScheduleScreen extends StatefulWidget {
  final User user;
  
  const ScheduleScreen({super.key, required this.user});

  @override
  State<ScheduleScreen> createState() => _ScheduleScreenState();
}

class _ScheduleScreenState extends State<ScheduleScreen> {
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  List<ShiftAssignment> _shifts = [];
  List<LeaveRequest> _leaveRequests = [];
  bool _isLoading = true;
  CalendarFormat _calendarFormat = CalendarFormat.week;

  @override
  void initState() {
    super.initState();
    _selectedDay = DateTime.now();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final results = await Future.wait([
        ApiService.getMyShifts(),
        ApiService.getMyLeaveRequests(),
      ]);

      setState(() {
        _shifts = results[0] as List<ShiftAssignment>;
        _leaveRequests = results[1] as List<LeaveRequest>;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('เกิดข้อผิดพลาด: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  List<ShiftAssignment> _getShiftsForDay(DateTime day) {
    return _shifts.where((shift) {
      if (shift.shift == null) return false;
      return isSameDay(shift.shift!.date, day);
    }).toList();
  }

  String _formatTime(String time) {
    try {
      final timeOfDay = TimeOfDay(
        hour: int.parse(time.split(':')[0]),
        minute: int.parse(time.split(':')[1]),
      );
      return '${timeOfDay.hour.toString().padLeft(2, '0')}:${timeOfDay.minute.toString().padLeft(2, '0')}';
    } catch (e) {
      return time;
    }
  }

  String _getShiftStatus(ShiftAssignment shift) {
    final leaveRequest = _leaveRequests.firstWhere(
      (request) => request.shiftAssignmentId == shift.id,
      orElse: () => LeaveRequest(
        id: 0, 
        shiftAssignmentId: 0, 
        reason: '', 
        status: ''
      ),
    );

    if (leaveRequest.id != 0) {
      switch (leaveRequest.status) {
        case 'pending':
          return 'รอการอนุมัติ';
        case 'approved':
          return 'อนุมัติแล้ว';
        case 'rejected':
          return 'ถูกปฏิเสธ';
      }
    }
    return 'ปกติ';
  }

  Color _getShiftStatusColor(ShiftAssignment shift) {
    final leaveRequest = _leaveRequests.firstWhere(
      (request) => request.shiftAssignmentId == shift.id,
      orElse: () => LeaveRequest(
        id: 0, 
        shiftAssignmentId: 0, 
        reason: '', 
        status: ''
      ),
    );

    if (leaveRequest.id != 0) {
      switch (leaveRequest.status) {
        case 'pending':
          return Colors.orange;
        case 'approved':
          return Colors.green;
        case 'rejected':
          return Colors.red;
      }
    }
    return Colors.blue;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadData,
              child: CustomScrollView(
                slivers: [
                  // Calendar Header
                  SliverToBoxAdapter(
                    child: Container(
                      color: Colors.blue.shade50,
                      child: Column(
                        children: [
                          // Calendar Format Toggle
                          Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'ตารางเวรของฉัน',
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.blue.shade800,
                                  ),
                                ),
                                ToggleButtons(
                                  isSelected: [
                                    _calendarFormat == CalendarFormat.week,
                                    _calendarFormat == CalendarFormat.month,
                                  ],
                                  onPressed: (index) {
                                    setState(() {
                                      _calendarFormat = index == 0 
                                        ? CalendarFormat.week 
                                        : CalendarFormat.month;
                                    });
                                  },
                                  borderRadius: BorderRadius.circular(8),
                                  selectedColor: Colors.white,
                                  fillColor: Colors.blue.shade600,
                                  color: Colors.blue.shade600,
                                  constraints: const BoxConstraints(
                                    minHeight: 32,
                                    minWidth: 60,
                                  ),
                                  children: const [
                                    Text('สัปดาห์', style: TextStyle(fontSize: 12)),
                                    Text('เดือน', style: TextStyle(fontSize: 12)),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          
                          // Calendar
                          TableCalendar<ShiftAssignment>(
                            firstDay: DateTime.utc(2020, 1, 1),
                            lastDay: DateTime.utc(2030, 12, 31),
                            focusedDay: _focusedDay,
                            calendarFormat: _calendarFormat,
                            eventLoader: _getShiftsForDay,
                            startingDayOfWeek: StartingDayOfWeek.monday,
                            selectedDayPredicate: (day) {
                              return isSameDay(_selectedDay, day);
                            },
                            onDaySelected: (selectedDay, focusedDay) {
                              setState(() {
                                _selectedDay = selectedDay;
                                _focusedDay = focusedDay;
                              });
                            },
                            onFormatChanged: (format) {
                              setState(() {
                                _calendarFormat = format;
                              });
                            },
                            onPageChanged: (focusedDay) {
                              _focusedDay = focusedDay;
                            },
                            calendarStyle: CalendarStyle(
                              outsideDaysVisible: false,
                              markerDecoration: BoxDecoration(
                                color: Colors.blue.shade600,
                                shape: BoxShape.circle,
                              ),
                              selectedDecoration: BoxDecoration(
                                color: Colors.blue.shade600,
                                shape: BoxShape.circle,
                              ),
                              todayDecoration: BoxDecoration(
                                color: Colors.blue.shade300,
                                shape: BoxShape.circle,
                              ),
                            ),
                            headerStyle: HeaderStyle(
                              formatButtonVisible: false,
                              titleCentered: true,
                              titleTextStyle: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.blue.shade800,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  
                  // Selected Day Shifts
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text(
                        _selectedDay != null
                            ? 'เวรวันที่ ${DateFormat('dd MMMM yyyy', 'th').format(_selectedDay!)}'
                            : 'เลือกวันที่ต้องการดู',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                  
                  // Shifts List
                  _selectedDay != null
                      ? SliverList(
                          delegate: SliverChildBuilderDelegate(
                            (context, index) {
                              final dayShifts = _getShiftsForDay(_selectedDay!);
                              
                              if (dayShifts.isEmpty) {
                                return const Padding(
                                  padding: EdgeInsets.all(16.0),
                                  child: Center(
                                    child: Text(
                                      'ไม่มีเวรในวันนี้',
                                      style: TextStyle(
                                        fontSize: 16,
                                        color: Colors.grey,
                                      ),
                                    ),
                                  ),
                                );
                              }
                              
                              if (index >= dayShifts.length) return null;
                              
                              final shift = dayShifts[index];
                              final status = _getShiftStatus(shift);
                              final statusColor = _getShiftStatusColor(shift);
                              
                              return Card(
                                margin: const EdgeInsets.symmetric(
                                  horizontal: 16,
                                  vertical: 4,
                                ),
                                child: ListTile(
                                  leading: Container(
                                    width: 48,
                                    height: 48,
                                    decoration: BoxDecoration(
                                      color: statusColor.withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Icon(
                                      Icons.access_time,
                                      color: statusColor,
                                    ),
                                  ),
                                  title: Text(
                                    '${_formatTime(shift.shift!.startTime)} - ${_formatTime(shift.shift!.endTime)}',
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  subtitle: Text(
                                    'สถานะ: $status',
                                    style: TextStyle(
                                      color: statusColor,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  trailing: status == 'ปกติ' || status == 'ถูกปฏิเสธ'
                                      ? IconButton(
                                          icon: const Icon(Icons.request_page),
                                          onPressed: () {
                                            // Navigate to leave request
                                            _showLeaveRequestDialog(shift);
                                          },
                                        )
                                      : null,
                                ),
                              );
                            },
                            childCount: _selectedDay != null 
                                ? _getShiftsForDay(_selectedDay!).isEmpty 
                                    ? 1 
                                    : _getShiftsForDay(_selectedDay!).length
                                : 0,
                          ),
                        )
                      : const SliverToBoxAdapter(child: SizedBox.shrink()),
                ],
              ),
            ),
    );
  }

  void _showLeaveRequestDialog(ShiftAssignment shift) {
    // Check if this shift already has a rejected leave request
    final hasRejectedRequest = _leaveRequests.any((request) => 
      request.shiftAssignmentId == shift.id && request.status == 'rejected'
    );

    if (hasRejectedRequest) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('เวรนี้เคยถูกปฏิเสธการขอลาแล้ว ไม่สามารถขอลาใหม่ได้'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    final reasonController = TextEditingController();
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('ขอลาเวร'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'วันที่: ${DateFormat('dd MMMM yyyy', 'th').format(shift.shift!.date)}',
            ),
            Text(
              'เวลา: ${_formatTime(shift.shift!.startTime)} - ${_formatTime(shift.shift!.endTime)}',
            ),
            const SizedBox(height: 16),
            TextField(
              controller: reasonController,
              decoration: const InputDecoration(
                labelText: 'เหตุผลในการขอลา',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('ยกเลิก'),
          ),
          ElevatedButton(
            onPressed: () async {
              if (reasonController.text.trim().isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('กรุณากรอกเหตุผลในการขอลา'),
                    backgroundColor: Colors.red,
                  ),
                );
                return;
              }

              try {
                await ApiService.createLeaveRequest(
                  shiftAssignmentId: shift.id,
                  reason: reasonController.text.trim(),
                );

                if (mounted) {
                  Navigator.of(context).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('ส่งคำขอลาเรียบร้อยแล้ว'),
                      backgroundColor: Colors.green,
                    ),
                  );
                  _loadData(); // Refresh data
                }
              } catch (e) {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('เกิดข้อผิดพลาด: ${e.toString()}'),
                      backgroundColor: Colors.red,
                    ),
                  );
                }
              }
            },
            child: const Text('ส่งคำขอ'),
          ),
        ],
      ),
    );
  }
}
