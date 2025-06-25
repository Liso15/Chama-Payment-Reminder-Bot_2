import React from 'react';
import { Card } from './Card';
import { PlusIcon, BellIcon, TrashIcon } from 'lucide-react';
export function ReminderSettings() {
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reminder Settings</h1>
        <button className="border border-gray-300 rounded-md px-4 py-2 flex items-center space-x-2">
          <PlusIcon size={16} />
          <span>Add Schedule</span>
        </button>
      </div>
      {/* Reminder Schedule */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Contribution Schedule</h2>
          <p className="text-sm text-gray-500">
            Set when contributions are due and reminders will be sent
          </p>
        </div>
        <div className="p-4">
          <div className="border border-gray-200 rounded-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="font-medium">Monthly Contribution</h3>
                <p className="text-sm text-gray-500">KES 1,000 per member</p>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                  Edit
                </button>
                <button className="p-1 border border-gray-300 rounded-md">
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Schedule Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Frequency:</span>
                    <span className="text-sm">Monthly</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Due Date:</span>
                    <span className="text-sm">5th of every month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Due Time:</span>
                    <span className="text-sm">5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Grace Period:</span>
                    <span className="text-sm">24 hours</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Reminder Settings</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                        <BellIcon size={12} />
                      </div>
                      <span className="text-sm">3 days before</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" checked />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-gray-400"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                        <BellIcon size={12} />
                      </div>
                      <span className="text-sm">1 day before</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" checked />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-gray-400"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                        <BellIcon size={12} />
                      </div>
                      <span className="text-sm">On due day</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" checked />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-gray-400"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                        <BellIcon size={12} />
                      </div>
                      <span className="text-sm">Hourly after due time</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-gray-400"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      {/* Message Templates */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Message Templates</h2>
          <p className="text-sm text-gray-500">
            Customize the reminder messages sent to members
          </p>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Initial Reminder (3 days before)
              </label>
              <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 h-24" defaultValue="Habari {name}! This is a friendly reminder that your Chama contribution of KES {amount} is due on {date}. Please make your payment via M-Pesa to avoid late fees."></textarea>
              <div className="mt-1 flex justify-between">
                <div className="text-xs text-gray-500">
                  Available variables: {'{name}'}, {'{amount}'}, {'{date}'}
                </div>
                <button className="text-xs border border-gray-300 rounded px-2 py-1">
                  Reset to Default
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Final Reminder (Due day)
              </label>
              <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 h-24" defaultValue="Muhimu! {name}, your Chama contribution of KES {amount} is due TODAY by {time}. Please make your payment now to avoid penalties. Reply 'BAL' for current group balance."></textarea>
              <div className="mt-1 flex justify-between">
                <div className="text-xs text-gray-500">
                  Available variables: {'{name}'}, {'{amount}'}, {'{date}'},{' '}
                  {'{time}'}
                </div>
                <button className="text-xs border border-gray-300 rounded px-2 py-1">
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-md">
            <h3 className="text-sm font-medium">Language Settings</h3>
            <div className="mt-2 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input type="radio" id="lang-en" name="language" checked />
                <label htmlFor="lang-en">English</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="lang-sw" name="language" />
                <label htmlFor="lang-sw">Swahili</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="lang-both" name="language" />
                <label htmlFor="lang-both">Bilingual</label>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="px-4 py-2 bg-gray-200 border border-gray-300 rounded-md">
              Save Templates
            </button>
          </div>
        </div>
      </Card>
    </div>;
}