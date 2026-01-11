import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function TimeAgo({ createdDate }) {
    const [timeAgo, setTimeAgo] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const created = new Date(createdDate);
            const diffMs = now - created;

            const seconds = Math.floor(diffMs / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            let result = '';
            if (days > 0) {
                result = `${days} day${days > 1 ? 's' : ''} ago`;
            } else if (hours > 0) {
                result = `${hours} hour${hours > 1 ? 's' : ''} ago`;
            } else if (minutes > 0) {
                result = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
            } else {
                result = `${seconds} second${seconds > 1 ? 's' : ''} ago`;
            }

            setTimeAgo(result);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, [createdDate]);

    return (
        <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 md:w-4 md:h-4" />
            {timeAgo}
        </span>
    );
}