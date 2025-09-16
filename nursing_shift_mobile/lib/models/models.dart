class User {
  final int id;
  final String name;
  final String email;
  final String role;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.createdAt,
    this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      name: json['name'],
      email: json['email'],
      role: json['role'],
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
      updatedAt: json['updated_at'] != null ? DateTime.parse(json['updated_at']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'role': role,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }
}

class Shift {
  final int id;
  final DateTime date;
  final String startTime;
  final String endTime;
  final int createdBy;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final User? createdByUser;

  Shift({
    required this.id,
    required this.date,
    required this.startTime,
    required this.endTime,
    required this.createdBy,
    this.createdAt,
    this.updatedAt,
    this.createdByUser,
  });

  factory Shift.fromJson(Map<String, dynamic> json) {
    return Shift(
      id: json['id'],
      date: DateTime.parse(json['date']),
      startTime: json['start_time'],
      endTime: json['end_time'],
      createdBy: json['created_by'],
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
      updatedAt: json['updated_at'] != null ? DateTime.parse(json['updated_at']) : null,
      createdByUser: json['createdBy'] != null ? User.fromJson(json['createdBy']) : null,
    );
  }
}

class ShiftAssignment {
  final int id;
  final int userId;
  final int shiftId;
  final int assignedBy;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final User? user;
  final Shift? shift;

  ShiftAssignment({
    required this.id,
    required this.userId,
    required this.shiftId,
    required this.assignedBy,
    this.createdAt,
    this.updatedAt,
    this.user,
    this.shift,
  });

  factory ShiftAssignment.fromJson(Map<String, dynamic> json) {
    return ShiftAssignment(
      id: json['id'],
      userId: json['user_id'],
      shiftId: json['shift_id'],
      assignedBy: json['assigned_by'],
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
      updatedAt: json['updated_at'] != null ? DateTime.parse(json['updated_at']) : null,
      user: json['user'] != null ? User.fromJson(json['user']) : null,
      shift: json['shift'] != null ? Shift.fromJson(json['shift']) : null,
    );
  }
}

class LeaveRequest {
  final int id;
  final int shiftAssignmentId;
  final String reason;
  final String status;
  final int? approvedBy;
  final DateTime? approvedAt;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final ShiftAssignment? shiftAssignment;
  final User? approvedByUser;

  LeaveRequest({
    required this.id,
    required this.shiftAssignmentId,
    required this.reason,
    required this.status,
    this.approvedBy,
    this.approvedAt,
    this.createdAt,
    this.updatedAt,
    this.shiftAssignment,
    this.approvedByUser,
  });

  factory LeaveRequest.fromJson(Map<String, dynamic> json) {
    return LeaveRequest(
      id: json['id'],
      shiftAssignmentId: json['shift_assignment_id'],
      reason: json['reason'],
      status: json['status'],
      approvedBy: json['approved_by'],
      approvedAt: json['approved_at'] != null ? DateTime.parse(json['approved_at']) : null,
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
      updatedAt: json['updated_at'] != null ? DateTime.parse(json['updated_at']) : null,
      shiftAssignment: json['shiftAssignment'] != null 
        ? ShiftAssignment.fromJson(json['shiftAssignment']) 
        : null,
      approvedByUser: json['approvedBy'] != null ? User.fromJson(json['approvedBy']) : null,
    );
  }
}
