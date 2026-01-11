import React from 'react';
import { FileText, Folder, AlignLeft, Clipboard } from 'lucide-react';
import { motion } from 'framer-motion';

const options = [
    { id: 'file', label: 'File', icon: FileText, description: 'Share a single file' },
    { id: 'folder', label: 'Folder', icon: Folder, description: 'Share multiple files' },
    { id: 'text', label: 'Text', icon: AlignLeft, description: 'Share text content' },
    { id: 'paste', label: 'Paste', icon: Clipboard, description: 'Share from clipboard' },
];

export default function ShareOptions({ onSelect, selected }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {options.map((option, index) => {
                const Icon = option.icon;
                const isSelected = selected === option.id;

                return (
                    <motion.button
                        key={option.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelect(option.id)}
                        className={`
                            relative p-4 md:p-6 rounded-2xl transition-all duration-300
                            flex flex-col items-center gap-3 border
                            ${isSelected
                                ? 'bg-teal-600 text-white shadow-xl shadow-teal-100 border-teal-500'
                                : 'bg-white hover:bg-gray-50 text-teal-600 border-gray-100 shadow-sm'}
                        `}
                    >
                        <div className={`
                            p-3 rounded-xl transition-colors
                            ${isSelected ? 'bg-white/20' : 'bg-teal-50'}
                        `}>
                            <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-teal-600'}`} strokeWidth={2} />
                        </div>
                        <div className="flex flex-col items-center">
                            <span className={`text-sm md:text-base font-semibold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                                {option.label}
                            </span>
                            <span className={`text-[10px] md:text-xs mt-0.5 ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                                {option.description}
                            </span>
                        </div>
                        {isSelected && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 border-2 border-teal-400 rounded-2xl pointer-events-none"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}