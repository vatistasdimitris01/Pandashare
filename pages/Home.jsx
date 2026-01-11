import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Share2, ArrowRight, Loader2, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from '@/utils';

import ShareOptions from '@/components/share/ShareOptions';
import FileUploader from '@/components/share/FileUploader';
import TextInput from '@/components/share/TextInput';
import QRCodeDisplay from '@/components/share/QRCodeDisplay';

export default function Home() {
    const [selectedType, setSelectedType] = useState(null);
    const [files, setFiles] = useState([]);
    const [title, setTitle] = useState('');
    const [textContent, setTextContent] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [shareData, setShareData] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const generateShareId = () => {
        return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    };

    // Global drag and drop handler
    const handleGlobalDrop = async (e) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            setFiles(droppedFiles);
            setSelectedType(droppedFiles.length === 1 ? 'file' : 'folder');
        }
    };

    const handleGlobalDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleGlobalDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    // Global paste handler
    const handleGlobalPaste = async (e) => {
        const items = e.clipboardData.items;
        let hasImage = false;
        let hasText = false;
        const pastedFiles = [];

        for (let item of items) {
            if (item.type.indexOf('image') !== -1) {
                hasImage = true;
                const blob = item.getAsFile();
                pastedFiles.push(blob);
            } else if (item.type === 'text/plain') {
                hasText = true;
                item.getAsString((text) => {
                    setTextContent(text);
                    setSelectedType('paste');
                });
            }
        }

        if (hasImage) {
            setFiles(pastedFiles);
            setSelectedType(pastedFiles.length === 1 ? 'file' : 'folder');
        }
    };

    React.useEffect(() => {
        if (!shareData) {
            window.addEventListener('paste', handleGlobalPaste);
            return () => window.removeEventListener('paste', handleGlobalPaste);
        }
    }, [shareData]);

    const handleCreate = async () => {
        setIsCreating(true);

        try {
            const shareId = generateShareId();
            let content = textContent;
            let uploadedFiles = [];

            // Upload files if any
            if (files.length > 0) {
                for (const file of files) {
                    const { file_url } = await base44.integrations.Core.UploadFile({ file });
                    uploadedFiles.push({
                        name: file.name,
                        url: file_url,
                        size: file.size
                    });
                }
                content = uploadedFiles[0]?.url || '';
            }

            const shareContent = {
                type: selectedType,
                title: title || `Shared ${selectedType}`,
                content: content,
                files: uploadedFiles,
                share_id: shareId,
                download_count: 0
            };

            await base44.entities.SharedContent.create(shareContent);

            const shareUrl = `${window.location.origin}${createPageUrl('View')}?id=${shareId}`;
            setShareData({ url: shareUrl, id: shareId });

        } catch (error) {
            console.error('Error creating share:', error);
        } finally {
            setIsCreating(false);
        }
    };

    const resetForm = () => {
        setSelectedType(null);
        setFiles([]);
        setTitle('');
        setTextContent('');
        setShareData(null);
    };

    const canCreate = () => {
        if (!selectedType) return false;
        if (selectedType === 'file' || selectedType === 'folder') return files.length > 0;
        if (selectedType === 'text' || selectedType === 'paste') return textContent.trim().length > 0;
        return false;
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 flex flex-col"
            onDrop={handleGlobalDrop}
            onDragOver={handleGlobalDragOver}
            onDragLeave={handleGlobalDragLeave}
        >
            {isDragging && !shareData && (
                <div className="fixed inset-0 bg-teal-500/20 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-3xl p-8 shadow-2xl"
                    >
                        <p className="text-2xl font-bold text-teal-600">Drop files here! 📁</p>
                    </motion.div>
                </div>
            )}

            <div className="flex-1 max-w-2xl mx-auto px-4 py-6 md:py-12 lg:py-20 w-full">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center mb-12 md:mb-16"
                >
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-600 bg-[length:200%_auto] animate-float mb-6">
                        Panda Share
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base lg:text-lg px-4 max-w-lg mx-auto leading-relaxed">
                        The simplest way to share files, text, and folders.
                        No registration, no hassle, just panda-fast sharing.
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {!shareData ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-8"
                        >
                            {/* Share Options */}
                            <div>
                                <h2 className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 md:mb-4 px-1">
                                    Choose type or drag & drop
                                </h2>
                                <ShareOptions selected={selectedType} onSelect={setSelectedType} />
                            </div>

                            {/* Content Input */}
                            <AnimatePresence mode="wait">
                                {selectedType && (
                                    <motion.div
                                        key={selectedType}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100"
                                    >
                                        {selectedType === 'file' && (
                                            <FileUploader files={files} setFiles={setFiles} multiple={false} />
                                        )}
                                        {selectedType === 'folder' && (
                                            <FileUploader files={files} setFiles={setFiles} multiple={true} />
                                        )}
                                        {(selectedType === 'text' || selectedType === 'paste') && (
                                            <TextInput
                                                title={title}
                                                setTitle={setTitle}
                                                content={textContent}
                                                setContent={setTextContent}
                                            />
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Create Button */}
                            {selectedType && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-center"
                                >
                                    <Button
                                        onClick={handleCreate}
                                        disabled={!canCreate() || isCreating}
                                        size="lg"
                                        className="rounded-2xl px-6 md:px-8 py-5 md:py-6 text-base md:text-lg bg-teal-600 hover:bg-teal-700 
                      disabled:bg-gray-200 disabled:text-gray-400 transition-all w-full md:w-auto"
                                    >
                                        {isCreating ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                Generate QR Code
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6 md:space-y-8"
                        >
                            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                                <h2 className="text-lg md:text-xl font-semibold text-gray-900 text-center mb-4 md:mb-6">
                                    Your share is ready! ✨
                                </h2>
                                <QRCodeDisplay shareUrl={shareData.url} shareId={shareData.id} />
                            </div>

                            <div className="flex justify-center">
                                <Button
                                    onClick={resetForm}
                                    variant="outline"
                                    className="rounded-xl border-gray-200 w-full md:w-auto"
                                >
                                    Create Another Share
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <footer className="py-8 text-center text-xs md:text-sm text-gray-400 border-t border-gray-100 bg-white/50 backdrop-blur-sm mt-auto">
                <div className="max-w-2xl mx-auto px-4">
                    <p className="mb-3">© {new Date().getFullYear()} Panda Share • Built with ❤️</p>
                    <motion.a
                        href="https://instagram.com/vatistasdimitris"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium transition-colors"
                    >
                        <Instagram className="w-4 h-4" />
                        @vatistasdimitris
                    </motion.a>
                </div>
            </footer>
        </div>
    );
}