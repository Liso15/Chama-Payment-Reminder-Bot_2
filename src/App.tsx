import React from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { MemberManagement } from './components/MemberManagement';
import { PaymentTracking } from './components/PaymentTracking';
import { ReminderSettings } from './components/ReminderSettings';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
export function App() {
  return <Router>
      <div className="w-full min-h-screen bg-gray-100">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/members" element={<MemberManagement />} />
            <Route path="/payments" element={<PaymentTracking />} />
            <Route path="/reminders" element={<ReminderSettings />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </div>
    </Router>;
}