import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingService } from '../../services/settingService';
import { Save, RotateCcw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Toast from '../../components/ui/Toast';
import './Settings.css';

const Settings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState({});
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  const { data, isLoading, error } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await settingService.getAll();
      setSettings(response.data.settings || {});
      return response;
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ key, value }) => settingService.update(key, { value }),
    onSuccess: () => {
      queryClient.invalidateQueries(['settings']);
      setToast({ isVisible: true, message: 'Settings saved successfully', type: 'success' });
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to save settings', type: 'error' });
    },
  });

  const initializeMutation = useMutation({
    mutationFn: () => settingService.initialize(),
    onSuccess: () => {
      queryClient.invalidateQueries(['settings']);
      setToast({ isVisible: true, message: 'Default settings restored', type: 'success' });
    },
  });

  const handleSave = () => {
    const updates = Object.entries(settings).map(([key, setting]) => ({
      key,
      value: setting.value,
    }));

    Promise.all(updates.map(u => updateMutation.mutateAsync(u)))
      .then(() => {
        setToast({ isVisible: true, message: 'All settings saved successfully', type: 'success' });
      })
      .catch(() => {
        setToast({ isVisible: true, message: 'Failed to save some settings', type: 'error' });
      });
  };

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value,
      },
    }));
  };

  if (isLoading) {
    return <div className="loading-state">Loading settings...</div>;
  }

  if (error) {
    return <div className="error-message">Failed to load settings.</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Clinic Settings</h1>
          <p className="page-subtitle">Manage your clinic's configuration and preferences.</p>
        </div>
        <div className="settings-actions">
          <Button
            variant="secondary"
            onClick={() => initializeMutation.mutate()}
            isLoading={initializeMutation.isPending}
          >
            <RotateCcw size={18} />
            Reset to Defaults
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={updateMutation.isPending}
          >
            <Save size={18} />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="settings-grid">
        <Card padding="lg" className="settings-card">
          <h3 className="settings-card__title">General Information</h3>
          <div className="settings-fields">
            <Input
              label="Clinic Name"
              value={settings.clinic_name?.value || ''}
              onChange={(e) => handleInputChange('clinic_name', e.target.value)}
              placeholder="Enter clinic name"
            />
            <Input
              label="Clinic Address"
              value={settings.clinic_address?.value || ''}
              onChange={(e) => handleInputChange('clinic_address', e.target.value)}
              placeholder="Enter clinic address"
            />
            <Input
              label="Phone Number"
              value={settings.clinic_phone?.value || ''}
              onChange={(e) => handleInputChange('clinic_phone', e.target.value)}
              placeholder="Enter phone number"
            />
            <Input
              label="Email Address"
              type="email"
              value={settings.clinic_email?.value || ''}
              onChange={(e) => handleInputChange('clinic_email', e.target.value)}
              placeholder="Enter email address"
            />
          </div>
        </Card>

        <Card padding="lg" className="settings-card">
          <h3 className="settings-card__title">Billing & Operations</h3>
          <div className="settings-fields">
            <Input
              label="Default Currency"
              value={settings.currency?.value || 'USD'}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              placeholder="USD"
            />
            <Input
              label="Tax Rate (%)"
              type="number"
              value={settings.tax_rate?.value || 0}
              onChange={(e) => handleInputChange('tax_rate', parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
            <Input
              label="Default Appointment Duration (minutes)"
              type="number"
              value={settings.appointment_duration?.value || 30}
              onChange={(e) => handleInputChange('appointment_duration', parseInt(e.target.value) || 30)}
              placeholder="30"
            />
          </div>
        </Card>

        <Card padding="lg" className="settings-card settings-card--full">
          <h3 className="settings-card__title">Working Hours</h3>
          <p className="settings-description">
            Working hours configuration will be displayed here with day-by-day schedule management.
          </p>
          <div className="working-hours-placeholder">
            <p>Working hours editor component will be implemented in a future stage.</p>
          </div>
        </Card>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default Settings;