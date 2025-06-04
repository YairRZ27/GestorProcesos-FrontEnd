import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const styles = `
.animate-slideIn { animation: slideInFromRight 0.5s ease-out forwards; }
@keyframes slideInFromRight { 0% { transform: translateX(100%); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
`;

if (!document.getElementById('custom-app-animations')) {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.id = 'custom-app-animations';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

const Notification = ({ message, type, onClose }) => {
    if (!message) return null;
    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
    const Icon = type === 'error' ? AlertTriangle : CheckCircle;
    return (
        <div className={`fixed top-5 right-5 ${bgColor} text-white p-4 rounded-lg shadow-lg flex items-center z-50 animate-slideIn`}>
            <Icon size={24} className="mr-3" />
            <span>{message}</span>
            <button onClick={onClose} className="ml-4 text-xl font-bold">&times;</button>
        </div>
    );
};

export default Notification;