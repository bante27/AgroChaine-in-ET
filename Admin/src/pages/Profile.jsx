import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, Lock } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    avatar: '',
    role: 'Admin'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/admin/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      
      if (response.ok) {
        // Show success message
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <User className="h-8 w-8 text-emerald-400" />
        <h1 className="text-3xl font-bold text-white">Admin Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture & Basic Info */}
        <Card gradient className="p-6">
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
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
            
            <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-3">
              <p className="text-emerald-400 text-sm font-medium">Account Status</p>
              <p className="text-white">Active Administrator</p>
            </div>
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
            
            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                
                <Button
                  type="button"
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  Change Password
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>

      {/* Account Settings */}
      <Card gradient className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h4 className="text-white font-medium mb-2">Two-Factor Authentication</h4>
            <p className="text-white/60 text-sm mb-3">Add an extra layer of security</p>
            <Button variant="secondary" size="sm">Configure 2FA</Button>
          </div>
          
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h4 className="text-white font-medium mb-2">Login Sessions</h4>
            <p className="text-white/60 text-sm mb-3">Manage active sessions</p>
            <Button variant="secondary" size="sm">View Sessions</Button>
          </div>
          
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h4 className="text-white font-medium mb-2">Account Backup</h4>
            <p className="text-white/60 text-sm mb-3">Download your account data</p>
            <Button variant="secondary" size="sm">Download Data</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;