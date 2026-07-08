import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAdminAuthed } from '../../utils/adminAuth';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import Requests from './sections/Requests';
import Jobs from './sections/Jobs';
import JobsHistory from './sections/JobsHistory';
import Invoice from './sections/Invoice';
import Tools from './sections/Tools';
import Drivers from './sections/Drivers';
import Vehicles from './sections/Vehicles';
import Earnings from './sections/Earnings';
import Expenses from './sections/Expenses';
import Inventory from './sections/Inventory';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('requests');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isAdminAuthed()) navigate('/signin');
    }, [navigate]);

    const renderSection = () => {
        switch (activeSection) {
            case 'requests':
                return <Requests />;
            case 'jobs':
                return <Jobs />;
            case 'jobsHistory':
                return <JobsHistory />;
            case 'invoice':
                return <Invoice />;
            case 'tools':
                return <Tools />;
            case 'drivers':
                return <Drivers />;
            case 'vehicles':
                return <Vehicles />;
            case 'earnings':
                return <Earnings />;
            case 'expenses':
                return <Expenses />;
            case 'inventory':
                return <Inventory />;
            default:
                return <Requests />;
        }
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
            <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div className="flex grow overflow-hidden">
                <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <main className="grow overflow-auto">
                    <div className="p-6 sm:p-8">
                        {renderSection()}
                    </div>
                </main>
            </div>
        </div>
    );
}
