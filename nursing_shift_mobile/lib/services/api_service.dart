import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/models.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:3000'; // Change this to your backend URL
  static const _storage = FlutterSecureStorage();
  
  // Get stored token
  static Future<String?> _getToken() async {
    return await _storage.read(key: 'auth_token');
  }
  
  // Save token
  static Future<void> _saveToken(String token) async {
    await _storage.write(key: 'auth_token', value: token);
  }
  
  // Delete token
  static Future<void> _deleteToken() async {
    await _storage.delete(key: 'auth_token');
  }
  
  // Get headers with authorization
  static Future<Map<String, String>> _getHeaders() async {
    final token = await _getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }
  
  // Login
  static Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );
      
      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        if (data['access_token'] != null) {
          await _saveToken(data['access_token']);
        }
        return data;
      } else {
        throw Exception('Login failed: ${response.body}');
      }
    } catch (e) {
      throw Exception('Login error: $e');
    }
  }
  
  // Logout
  static Future<void> logout() async {
    await _deleteToken();
  }
  
  // Get current user profile
  static Future<User> getProfile() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/auth/profile'),
        headers: await _getHeaders(),
      );
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return User.fromJson(data);
      } else {
        throw Exception('Failed to get profile: ${response.body}');
      }
    } catch (e) {
      throw Exception('Profile error: $e');
    }
  }
  
  // Get my shifts (nurse only)
  static Future<List<ShiftAssignment>> getMyShifts() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/shifts/my-schedule'),
        headers: await _getHeaders(),
      );
      
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => ShiftAssignment.fromJson(json)).toList();
      } else {
        throw Exception('Failed to get shifts: ${response.body}');
      }
    } catch (e) {
      throw Exception('Shifts error: $e');
    }
  }
  
  // Get my leave requests
  static Future<List<LeaveRequest>> getMyLeaveRequests() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/leave-requests/my-requests'),
        headers: await _getHeaders(),
      );
      
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => LeaveRequest.fromJson(json)).toList();
      } else {
        throw Exception('Failed to get leave requests: ${response.body}');
      }
    } catch (e) {
      throw Exception('Leave requests error: $e');
    }
  }
  
  // Create leave request
  static Future<LeaveRequest> createLeaveRequest({
    required int shiftAssignmentId,
    required String reason,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/leave-requests'),
        headers: await _getHeaders(),
        body: jsonEncode({
          'shift_assignment_id': shiftAssignmentId,
          'reason': reason,
        }),
      );
      
      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        return LeaveRequest.fromJson(data);
      } else {
        throw Exception('Failed to create leave request: ${response.body}');
      }
    } catch (e) {
      throw Exception('Create leave request error: $e');
    }
  }
  
  // Check if token is valid
  static Future<bool> isTokenValid() async {
    try {
      final token = await _getToken();
      if (token == null) return false;
      
      final response = await http.get(
        Uri.parse('$baseUrl/auth/profile'),
        headers: await _getHeaders(),
      );
      
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}
