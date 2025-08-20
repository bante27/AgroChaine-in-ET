import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Palette, Bell, Shield, Globe, Save } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    siteName: 'AgroChain Ethiopia',
    adminEmail: '',
    notifications: {
      newUser: true,
      newOrder: true,
      newMessage: true,
      systemAlerts: true
    },
    appearance: {
      theme: 'dark',
      primaryColor: 'emerald'
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 3,
      requireTwoFactor: false
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (response.ok) {
        // Show success message
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleDirectChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-emerald-400" />
          <h1 className="text-3xl font-bold text-white">System Settings</h1>
        </div>
        
        <Button
          onClick={handleSaveSettings}
          variant="primary"
          disabled={saving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <Card gradient className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">General Settings</h2>
          </div>
          
          <div className="space-y-4">
            <Input
              label="Site Name"
              value={settings.siteName}
              onChange={(e) => handleDirectChange('siteName', e.target.value)}
              placeholder="Enter site name"
            />
            
            <Input
              label="Admin Email"
              type="email"
              value={settings.adminEmail}
              onChange={(e) => handleDirectChange('adminEmail', e.target.value)}
              placeholder="Enter admin email"
            />
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Site Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <SettingsIcon className="h-8 w-8 text-white" />
                </div>
                <Button variant="secondary" size="sm">Upload New Logo</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Appearance Settings */}
        <Card gradient className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="h-6 w-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Appearance</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-3">Theme</label>
              <div className="flex gap-4">
                <button
                  onClick={toggleTheme}
                  className={`flex-1 p-3 rounded-lg border transition-all ${
                    isDark 
                      ? 'bg-white/10 border-emerald-400 text-emerald-400' 
                      : 'bg-white/5 border-white/20 text-white/70'
                  }`}
                >
                  Dark Theme
                </button>
                <button
                  onClick={toggleTheme}
                  className={`flex-1 p-3 rounded-lg border transition-all ${
                    !isDark 
                      ? 'bg-white/10 border-emerald-400 text-emerald-400' 
                      : 'bg-white/5 border-white/20 text-white/70'
                  }`}
                >
                  Light Theme
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-3">Primary Color</label>
              <div className="grid grid-cols-3 gap-3">
                {['emerald', 'blue', 'purple'].map(color => (
                  <button
                    key={color}
                    onClick={() => handleSettingChange('appearance', 'primaryColor', color)}
                    className={`p-3 rounded-lg border transition-all ${
                      settings.appearance?.primaryColor === color
                        ? `bg-${color}-500/20 border-${color}-400 text-${color}-400`
                        : 'bg-white/5 border-white/20 text-white/70'
                    }`}
                  >
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card gradient className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-6 w-6 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { key: 'newUser', label: 'New User Registrations' },
              { key: 'newOrder', label: 'New Orders' },
              { key: 'newMessage', label: 'New Messages' },
              { key: 'systemAlerts', label: 'System Alerts' }
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-white">{label}</span>
                <button
                  onClick={() => handleSettingChange('notifications', key, !settings.notifications?.[key])}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.notifications?.[key] 
                      ? 'bg-emerald-500' 
                      : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.notifications?.[key] 
                        ? 'translate-x-7' 
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Security Settings */}
        <Card gradient className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-red-400" />
            <h2 className="text-xl font-bold text-white">Security</h2>
          </div>
          
          <div className="space-y-4">
            <Input
              label="Session Timeout (minutes)"
              type="number"
              value={settings.security?.sessionTimeout}
              onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
              placeholder="30"
            />
            
            <Input
              label="Max Login Attempts"
              type="number"
              value={settings.security?.maxLoginAttempts}
              onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
              placeholder="3"
            />
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-white font-medium">Require Two-Factor Authentication</span>
                <p className="text-white/60 text-sm">Force 2FA for all admin accounts</p>
              </div>
              <button
                onClick={() => handleSettingChange('security', 'requireTwoFactor', !settings.security?.requireTwoFactor)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.security?.requireTwoFactor 
                    ? 'bg-emerald-500' 
                    : 'bg-white/20'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.security?.requireTwoFactor 
                      ? 'translate-x-7' 
                      : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* System Information */}
      <Card gradient className="p-6">
        <h2 className="text-xl font-bold text-white mb-6">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h3 className="text-white font-medium mb-2">Platform Version</h3>
            <p className="text-white/60 text-sm">v2.1.0</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h3 className="text-white font-medium mb-2">Database Status</h3>
            <p className="text-green-400 text-sm">Connected</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h3 className="text-white font-medium mb-2">Last Backup</h3>
            <p className="text-white/60 text-sm">2 hours ago</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;