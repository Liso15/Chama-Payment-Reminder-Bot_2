import React from 'react';
import { Card } from './Card';
import { SaveIcon, CreditCardIcon, BellIcon, GlobeIcon, ShieldIcon } from 'lucide-react';
export function Settings() {
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
        <button className="border border-gray-300 rounded-md px-4 py-2 flex items-center space-x-2">
          <SaveIcon size={16} />
          <span>Save Changes</span>
        </button>
      </div>
      {/* Group Settings */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Group Settings</h2>
          <p className="text-sm text-gray-500">Manage your Chama information</p>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Group Name
              </label>
              <input type="text" defaultValue="Umoja Savings Group" className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Group Type
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option>Savings Group</option>
                <option>Investment Club</option>
                <option>Merry-Go-Round</option>
                <option>Table Banking</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Group Description
            </label>
            <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 h-24" defaultValue="A community savings group focused on helping members achieve financial goals through regular contributions."></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Founded Date
              </label>
              <input type="date" defaultValue="2022-01-01" className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Meeting Frequency
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option>Weekly</option>
                <option>Bi-weekly</option>
                <option selected>Monthly</option>
                <option>Quarterly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Group Size Limit
              </label>
              <input type="number" defaultValue="25" className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
          </div>
        </div>
      </Card>
      {/* Subscription Plan */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Subscription Plan</h2>
          <p className="text-sm text-gray-500">
            Manage your subscription and billing
          </p>
        </div>
        <div className="p-4">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <CreditCardIcon size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Free Plan</h3>
              <p className="text-sm text-gray-500">
                Basic features with limited functionality
              </p>
              <ul className="mt-2 space-y-1">
                <li className="text-xs flex items-center">
                  <span className="w-4 h-4 mr-1 flex items-center justify-center">
                    ✓
                  </span>
                  WhatsApp reminders
                </li>
                <li className="text-xs flex items-center">
                  <span className="w-4 h-4 mr-1 flex items-center justify-center">
                    ✓
                  </span>
                  M-Pesa tracking
                </li>
                <li className="text-xs flex items-center">
                  <span className="w-4 h-4 mr-1 flex items-center justify-center">
                    ✓
                  </span>
                  Basic reporting
                </li>
              </ul>
            </div>
            <button className="px-4 py-2 bg-gray-200 border border-gray-300 rounded-md">
              Upgrade
            </button>
          </div>
          <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-md">
            <h3 className="text-sm font-medium">Premium Benefits</h3>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="text-xs flex items-center">
                <span className="w-4 h-4 mr-1 flex items-center justify-center">
                  ✓
                </span>
                Smart PDF Reports
              </div>
              <div className="text-xs flex items-center">
                <span className="w-4 h-4 mr-1 flex items-center justify-center">
                  ✓
                </span>
                SMS Reminders
              </div>
              <div className="text-xs flex items-center">
                <span className="w-4 h-4 mr-1 flex items-center justify-center">
                  ✓
                </span>
                Savings Insights
              </div>
              <div className="text-xs flex items-center">
                <span className="w-4 h-4 mr-1 flex items-center justify-center">
                  ✓
                </span>
                Group Health Score
              </div>
            </div>
            <div className="mt-2 text-xs">
              KES 100/month or KES 1,000/year (save 17%)
            </div>
          </div>
        </div>
      </Card>
      {/* Notification Settings */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Notification Settings</h2>
          <p className="text-sm text-gray-500">
            Configure how and when you receive updates
          </p>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <BellIcon size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium">Payment Confirmations</p>
                  <p className="text-xs text-gray-500">
                    Receive notifications when payments are made
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" checked />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-gray-400"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <BellIcon size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium">Late Payment Alerts</p>
                  <p className="text-xs text-gray-500">
                    Get notified when members miss deadlines
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" checked />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-gray-400"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <BellIcon size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium">Monthly Reports</p>
                  <p className="text-xs text-gray-500">
                    Receive monthly summary reports
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-gray-400"></div>
              </label>
            </div>
          </div>
        </div>
      </Card>
      {/* System Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">Language & Region</h2>
            <p className="text-sm text-gray-500">
              Configure localization settings
            </p>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option selected>English</option>
                <option>Swahili</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Currency Format
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option selected>KES (KES 1,000)</option>
                <option>USD ($ 10.00)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Date Format
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option selected>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">Security Settings</h2>
            <p className="text-sm text-gray-500">Manage account security</p>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <ShieldIcon size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Two-Factor Authentication
                  </p>
                  <p className="text-xs text-gray-500">
                    Add an extra layer of security
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-gray-400"></div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Change Password
              </label>
              <button className="w-full border border-gray-300 rounded-md px-3 py-2 text-left text-sm">
                Update your password
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Login History
              </label>
              <button className="w-full border border-gray-300 rounded-md px-3 py-2 text-left text-sm">
                View recent login activity
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>;
}