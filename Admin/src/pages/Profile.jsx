import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, Lock } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';

const AdminProfile = () => {
  const { user, token } = useAuth(); // Get token from AuthContext
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    avatar: '',
    role: 'Admin',
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  // Fetch admin profile and all users
  const fetchProfile = async () => {
    setLoading(true);
    try {
      // Fetch admin profile
      const profileRes = await fetch(`http://localhost:5000/api/admin/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileData = await profileRes.json();
      if (profileRes.ok && profileData.success) {
        setProfile({
          name: profileData.user.fullName || profileData.user.name,
          email: profileData.user.email,
          phone: profileData.user.phone || '',
          location: profileData.user.location || '',
          avatar: profileData.user.avatar || '',
          role: profileData.user.isAdmin ? 'Admin' : 'User',
        });
      }

      // Fetch all users
      const usersRes = await fetch(`http://localhost:5000/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersData = await usersRes.json();
      if (usersRes.ok && usersData.success) {
        setUsers(usersData.users);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${user._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profile),
      });
      if (response.ok) {
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Admin Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card gradient className="p-6">
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="h-16 w-16 text-white" />
                )}
              </div>
              <button className="absolute -bottom-2 -right-2 bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-full transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{profile.name || 'Admin User'}</h2>
            <p className="text-white/60 mb-4">{profile.role}</p>
          </div>
        </Card>

        {/* Profile Form */}
        <Card gradient className="p-6 lg:col-span-2">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={profile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  icon={User}
                  placeholder="Enter your full name"
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  icon={Mail}
                  placeholder="Enter your email"
                />
                <Input
                  label="Phone Number"
                  value={profile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  icon={Phone}
                  placeholder="Enter your phone number"
                />
                <Input
                  label="Location"
                  value={profile.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  icon={MapPin}
                  placeholder="Enter your location"
                />
              </div>
            </div>
            <div className="border-t border-white/10 pt-6 flex justify-between">
              <Button type="submit" variant="primary" disabled={saving} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="secondary" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Change Password
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* All Users Table */}
      <Card gradient className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">All Users</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-white border border-white/10 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-white/10">
                  <td className="px-4 py-2">{u.fullName || u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.isAdmin ? 'Admin' : 'User'}</td>
                  <td className="px-4 py-2">{u.isRestricted ? 'Restricted' : 'Active'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminProfile;
