import React, { useEffect } from 'react';
import { Download, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function QRCodeDisplay({ shareUrl, shareId }) {
    const [copied, setCopied] = React.useState(false);
    const [qrImageUrl, setQrImageUrl] = React.useState('');

    useEffect(() => {
        if (shareUrl) {
            // Use a free QR code API to generate a real, working QR code
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}&bgcolor=ffffff&color=0d9488&margin=10`;
            setQrImageUrl(qrUrl);
        }
    }, [shareUrl]);

    const copyLink = async () => {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadQR = async () => {
        try {
            const response = await fetch(qrImageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `panda-share-${shareId}.png`;
            link.href = url;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
        >
            <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-xl shadow-gray-100 mb-4 md:mb-6">
                {qrImageUrl ? (
                    <img
                        src={qrImageUrl}
                        alt="QR Code"
                        className="w-[250px] h-[250px] md:w-[300px] md:h-[300px] rounded-xl md:rounded-2xl"
                    />
                ) : (
                    <div className="w-[250px] h-[250px] md:w-[300px] md:h-[300px] rounded-xl md:rounded-2xl bg-gray-100 animate-pulse" />
                )}
            </div>

            <div className="w-full space-y-3">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl overflow-hidden">
                    <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="flex-1 bg-transparent text-xs md:text-sm text-gray-600 outline-none truncate"
                    />
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <Button
                        onClick={copyLink}
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-gray-200 hover:border-teal-400 hover:text-teal-600 text-xs md:text-sm px-2 md:px-4"
                    >
                        {copied ? <Check className="w-3 h-3 md:w-4 md:h-4 md:mr-2" /> : <Copy className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />}
                        <span className="hidden md:inline">{copied ? 'Copied' : 'Copy'}</span>
                    </Button>
                    <Button
                        onClick={downloadQR}
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-gray-200 hover:border-teal-400 hover:text-teal-600 text-xs md:text-sm px-2 md:px-4"
                    >
                        <Download className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                        <span className="hidden md:inline">Save</span>
                    </Button>
                    <Button
                        onClick={() => window.open(shareUrl, '_blank')}
                        size="sm"
                        className="rounded-xl bg-teal-600 hover:bg-teal-700 text-xs md:text-sm px-2 md:px-4"
                    >
                        <ExternalLink className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                        <span className="hidden md:inline">Open</span>
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}