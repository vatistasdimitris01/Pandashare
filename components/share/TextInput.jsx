import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TextInput({ title, setTitle, content, setContent }) {
    return (
        <div className="space-y-4">
            <div>
                <Label className="text-gray-600 mb-2 block">Title (optional)</Label>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your share a name..."
                    className="rounded-xl border-gray-200 focus:border-teal-400 focus:ring-teal-400"
                />
            </div>
            <div>
                <Label className="text-gray-600 mb-2 block">Content</Label>
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter your text here..."
                    className="min-h-[200px] rounded-xl border-gray-200 focus:border-teal-400 focus:ring-teal-400 resize-none"
                />
            </div>
        </div>
    );
}