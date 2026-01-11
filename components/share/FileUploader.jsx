import React, { useCallback } from 'react';
import { Upload, X, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function FileUploader({ files, setFiles, multiple = false }) {
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (multiple) {
            setFiles(prev => [...prev, ...droppedFiles]);
        } else {
            setFiles(droppedFiles.slice(0, 1));
        }
    }, [multiple, setFiles]);

    const handleChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (multiple) {
            setFiles(prev => [...prev, ...selectedFiles]);
        } else {
            setFiles(selectedFiles.slice(0, 1));
        }
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="space-y-3 md:space-y-4">
            <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-200 rounded-xl md:rounded-2xl p-6 md:p-8 text-center
          hover:border-teal-400 transition-colors cursor-pointer bg-gray-50/50"
            >
                <input
                    type="file"
                    multiple={multiple}
                    onChange={handleChange}
                    className="hidden"
                    id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2 md:gap-3">
                        <div className="p-3 md:p-4 bg-teal-50 rounded-full">
                            <Upload className="w-6 h-6 md:w-8 md:h-8 text-teal-600" />
                        </div>
                        <div>
                            <p className="text-sm md:text-base text-gray-700 font-medium">
                                Drop {multiple ? 'files' : 'file'} here or tap to browse
                            </p>
                            <p className="text-gray-400 text-xs md:text-sm mt-1">
                                {multiple ? 'Upload multiple files' : 'Select a single file'}
                            </p>
                        </div>
                    </div>
                </label>
            </div>

            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                    >
                        {files.map((file, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100"
                            >
                                <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                                    <div className="p-2 bg-teal-50 rounded-lg flex-shrink-0">
                                        <File className="w-4 h-4 text-teal-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs md:text-sm font-medium text-gray-700 truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(index)}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}