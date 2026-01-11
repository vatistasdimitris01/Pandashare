import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
    FileText, Folder, AlignLeft, Clipboard, Download, Copy, Check,
    Eye, Loader2, AlertCircle, Home, Instagram
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import TimeAgo from '@/components/share/TimeAgo';

export default function View() {
    const [shareData, setShareData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const urlParams = new URLSearchParams(window.location.search);
    const shareId = urlParams.get('id');

    useEffect(() => {
        loadShareData();
    }, [shareId]);

    const loadShareData = async () => {
        if (!shareId) {
            setError('No share ID provided');
            setLoading(false);
            return;
        }

        try {
            const results = await base44.entities.SharedContent.filter({ share_id: shareId });
            if (results.length === 0) {
                setError('Share not found or has expired');
            } else {
                setShareData(results[0]);
                // Increment download count
                await base44.entities.SharedContent.update(results[0].id, {
                    download_count: (results[0].download_count || 0) + 1
                });
            }
        } catch (err) {
            setError('Failed to load share');
        } finally {
            setLoading(false);
        }
    };

    const copyContent = async () => {
        if (shareData?.content) {
            await navigator.clipboard.writeText(shareData.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const downloadFile = (url, name) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        link.target = '_blank';
        link.click();
    };

    const getTypeIcon = (type) => {
        const icons = {
            file: FileText,
            folder: Folder,
            text: AlignLeft,
            paste: Clipboard
        };
        return icons[type] || FileText;
    };

    const formatSize = (bytes) => {
        if (!bytes) return '';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 flex flex-col">
                <div className="flex-1 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full p-8 text-center">
                        <div className="p-4 bg-red-50 rounded-full w-fit mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Oops!</h2>
                        <p className="text-gray-500 mb-4">{error}</p>
                        <Link to={createPageUrl('Home')}>
                            <Button className="bg-teal-600 hover:bg-teal-700">
                                <Home className="w-4 h-4 mr-2" />
                                Go to Panda Share
                            </Button>
                        </Link>
                    </Card>
                </div>
                <footer className="py-6 text-center text-xs md:text-sm text-gray-500">
                    <p className="mb-2">© 2024 Panda Share by @vatistasdimitris</p>
                    <a
                        href="https://instagram.com/vatistasdimitris"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 transition-colors"
                    >
                        <Instagram className="w-4 h-4" />
                        @vatistasdimitris
                    </a>
                </footer>
            </div>
        );
    }

    const TypeIcon = getTypeIcon(shareData.type);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 flex flex-col">
            <div className="flex-1 max-w-2xl mx-auto px-4 py-6 md:py-12 lg:py-20 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Back to Home Button */}
                    <div className="mb-4 md:mb-6">
                        <Link to={createPageUrl('Home')}>
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-gray-200 hover:border-teal-400 hover:text-teal-600"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Back to Panda Share
                            </Button>
                        </Link>
                    </div>
                    {/* Header */}
                    <div className="text-center mb-6 md:mb-8">
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500 mb-4 px-4"
                        >
                            {shareData.title}
                        </motion.h1>
                        <div className="flex items-center justify-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500 flex-wrap px-4">
                            <TimeAgo createdDate={shareData.created_date} />
                            <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                <Eye className="w-3 h-3 md:w-4 md:h-4 text-teal-600" />
                                {shareData.download_count || 0} views
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <Card className="rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                        {/* Text/Paste Content */}
                        {(shareData.type === 'text' || shareData.type === 'paste') && (
                            <div className="p-4 md:p-6">
                                <div className="bg-gray-50 rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 max-h-60 md:max-h-96 overflow-auto">
                                    <pre className="whitespace-pre-wrap text-gray-700 font-mono text-xs md:text-sm">
                                        {shareData.content}
                                    </pre>
                                </div>
                                <Button
                                    onClick={copyContent}
                                    className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 text-sm md:text-base"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-4 h-4 mr-2" />
                                            Copied to Clipboard
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4 mr-2" />
                                            Copy Content
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}

                        {/* File Content */}
                        {shareData.type === 'file' && shareData.files?.[0] && (
                            <div className="p-4 md:p-6">
                                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl mb-4">
                                    <div className="p-2 md:p-3 bg-teal-100 rounded-lg md:rounded-xl flex-shrink-0">
                                        <FileText className="w-5 h-5 md:w-6 md:h-6 text-teal-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm md:text-base font-medium text-gray-900 truncate">
                                            {shareData.files[0].name}
                                        </p>
                                        <p className="text-xs md:text-sm text-gray-500">
                                            {formatSize(shareData.files[0].size)}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 md:gap-3">
                                    <Button
                                        onClick={() => window.open(shareData.files[0].url, '_blank')}
                                        variant="outline"
                                        className="rounded-xl border-gray-200 text-sm md:text-base"
                                    >
                                        <Eye className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                                        Preview
                                    </Button>
                                    <Button
                                        onClick={() => downloadFile(shareData.files[0].url, shareData.files[0].name)}
                                        className="rounded-xl bg-teal-600 hover:bg-teal-700 text-sm md:text-base"
                                    >
                                        <Download className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Folder Content */}
                        {shareData.type === 'folder' && shareData.files?.length > 0 && (
                            <div className="p-4 md:p-6">
                                <div className="space-y-2 md:space-y-3 mb-4 max-h-60 md:max-h-80 overflow-auto">
                                    {shareData.files.map((file, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg md:rounded-xl hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="p-2 bg-teal-100 rounded-lg flex-shrink-0">
                                                <FileText className="w-3 h-3 md:w-4 md:h-4 text-teal-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                                                    {file.name}
                                                </p>
                                                <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => downloadFile(file.url, file.name)}
                                                className="text-teal-600 hover:text-teal-700 flex-shrink-0"
                                            >
                                                <Download className="w-3 h-3 md:w-4 md:h-4" />
                                            </Button>
                                        </motion.div>
                                    ))}
                                </div>
                                <Button
                                    onClick={() => shareData.files.forEach(f => downloadFile(f.url, f.name))}
                                    className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 text-sm md:text-base"
                                >
                                    <Download className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                                    Download All ({shareData.files.length} files)
                                </Button>
                            </div>
                        )}
                    </Card>
                </motion.div>
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