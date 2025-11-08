import React, { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    appName: 'Apexsoft Technology',
    defaultLang: 'English (US)',
    timezone: '(UTC-08:00) Pacific Time',
    twoFactorAuth: false,
    passwordExpiration: true,
    sessionTimeout: 30,
    emailNotifications: true,
    inAppNotifications: true,
    slackApi: '',
    githubApi: ''
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggle = (field) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  const ToggleSwitch = ({ enabled, onToggle, label, description }) => (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{label}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          enabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
        }`}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Settings</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-8">
            {/* General Preferences */}
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">General Preferences</h2>
              <div className="mt-6 space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="appName">
                    Application Name
                  </label>
                  <input
                    className="mt-1 block w-full rounded-lg border-gray-300 bg-background-light text-sm focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-background-dark dark:text-white"
                    id="appName"
                    type="text"
                    value={settings.appName}
                    onChange={(e) => handleInputChange('appName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="defaultLang">
                    Default Language
                  </label>
                  <select
                    className="mt-1 block w-full rounded-lg border-gray-300 bg-background-light text-sm focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-background-dark dark:text-white"
                    id="defaultLang"
                    value={settings.defaultLang}
                    onChange={(e) => handleInputChange('defaultLang', e.target.value)}
                  >
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="timezone">
                    Timezone
                  </label>
                  <select
                    className="mt-1 block w-full rounded-lg border-gray-300 bg-background-light text-sm focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-background-dark dark:text-white"
                    id="timezone"
                    value={settings.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                  >
                    <option>(UTC-08:00) Pacific Time</option>
                    <option>(UTC-05:00) Eastern Time</option>
                    <option>(UTC+01:00) Central European Time</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Security</h2>
              <div className="mt-6 space-y-6">
                <ToggleSwitch
                  enabled={settings.twoFactorAuth}
                  onToggle={() => handleToggle('twoFactorAuth')}
                  label="Enable Two-Factor Authentication (2FA)"
                  description="Require all users to set up 2FA for added security."
                />
                <ToggleSwitch
                  enabled={settings.passwordExpiration}
                  onToggle={() => handleToggle('passwordExpiration')}
                  label="Password Expiration Policy"
                  description="Force users to reset their passwords periodically."
                />
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="sessionTimeout">
                    Session Timeout (minutes)
                  </label>
                  <input
                    className="mt-1 block w-full rounded-lg border-gray-300 bg-background-light text-sm focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-background-dark dark:text-white"
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="space-y-8">
            {/* Notifications */}
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h2>
              <div className="mt-6 space-y-6">
                <ToggleSwitch
                  enabled={settings.emailNotifications}
                  onToggle={() => handleToggle('emailNotifications')}
                  label="Email Notifications"
                  description="Send system notifications via email."
                />
                <ToggleSwitch
                  enabled={settings.inAppNotifications}
                  onToggle={() => handleToggle('inAppNotifications')}
                  label="In-App Notifications"
                  description="Display notifications within the dashboard."
                />
              </div>
            </div>

            {/* Integrations */}
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Integrations</h2>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="slackApi">
                    Slack API Key
                  </label>
                  <input
                    className="mt-1 block w-full rounded-lg border-gray-300 bg-background-light text-sm focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-background-dark dark:text-white"
                    id="slackApi"
                    placeholder="Enter Slack API Key"
                    type="text"
                    value={settings.slackApi}
                    onChange={(e) => handleInputChange('slackApi', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="githubApi">
                    GitHub API Key
                  </label>
                  <input
                    className="mt-1 block w-full rounded-lg border-gray-300 bg-background-light text-sm focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-background-dark dark:text-white"
                    id="githubApi"
                    placeholder="Enter GitHub API Key"
                    type="text"
                    value={settings.githubApi}
                    onChange={(e) => handleInputChange('githubApi', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
