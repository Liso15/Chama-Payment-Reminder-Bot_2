import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, UsersIcon, CreditCardIcon, BellIcon, FileTextIcon, SettingsIcon } from 'lucide-react';
export function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  return <div className="flex h-screen w-full">
      {/* Sidebar Navigation */}
      <div className="w-64 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold">Chama Bot</h1>
          <p className="text-sm text-gray-500">Payment Reminder System</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <NavItem to="/" icon={<HomeIcon size={18} />} label="Dashboard" />
            <NavItem to="/members" icon={<UsersIcon size={18} />} label="Members" />
            <NavItem to="/payments" icon={<CreditCardIcon size={18} />} label="Payments" />
            <NavItem to="/reminders" icon={<BellIcon size={18} />} label="Reminders" />
            <NavItem to="/reports" icon={<FileTextIcon size={18} />} label="Reports" />
            <NavItem to="/settings" icon={<SettingsIcon size={18} />} label="Settings" />
          </ul>
        </nav>
        <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div>
              <p className="text-sm font-medium">Treasurer</p>
              <p className="text-xs text-gray-500">Free Tier</p>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
          <h2 className="text-lg font-medium">Umoja Savings Group</h2>
          <div className="flex items-center space-x-4">
            <button className="border border-gray-300 rounded-md px-3 py-1 text-sm">
              Language: English
            </button>
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>;
}
function NavItem({
  to,
  icon,
  label
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return <li>
      <NavLink to={to} className={({
      isActive
    }) => `flex items-center space-x-2 p-2 rounded-md ${isActive ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
        <span className="text-gray-600">{icon}</span>
        <span>{label}</span>
      </NavLink>
    </li>;
}