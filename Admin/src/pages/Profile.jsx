import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, Lock } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminProfile = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    avatar: '',
    role: 'Admin',
  });
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && token) {
      setProfile({
        fullName: user.fullName || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        avatar: user.avatar || '',
        role: user.isAdmin ? 'Admin' : 'User',
      });
      fetchAdmins();
    }
  }, [user, token]);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://157.245.187.246:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const adminUsers = response.data.users.filter((u) => u.isAdmin);
        setAdmins(adminUsers);
      } else {
        setError('Failed to fetch admins');
      }
    } catch (error) {
      setError('Error fetching admins');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const response = await axios.put(
        'http://157.245.187.246:5000/api/users/profile',
        {
          fullName: profile.fullName,
          email: profile.email,
          phone: profile.phone,
          location: profile.location,
          avatar: profile.avatar,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert('Profile updated successfully!');
      } else {
        setError(response.data.error || 'Failed to update profile');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96 bg-gray-950">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-8 px-4">
      
      {/* Admins List */}
      <Card gradient className="p-6">
        <h3 className="text-lg font-semibold bg-gray-950  text-white mb-4">Admins</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-white  border border-white/10 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {admins.length > 0 ? (
                admins.map((admin) => (
                  <tr key={admin._id} className="border-t border-white/10">
                    <td className="px-4 py-2">{admin.fullName || admin.name}</td>
                    <td className="px-4 py-2">{admin.email}</td>
                    <td className="px-4 py-2">{admin.isAdmin ? 'Admin' : 'User'}</td>
                    <td className="px-4 py-2">{admin.isRestricted ? 'Restricted' : 'Active'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-2 text-center text-white/80">
                    No admins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminProfile;
