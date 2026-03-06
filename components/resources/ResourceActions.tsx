'use client';

import React from 'react';
import { Share2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ensureProtocol } from '@/lib/utils';

interface ResourceActionsProps {
    resourceName: string;
    website?: string;
}

export function ResourceActions({ resourceName, website }: ResourceActionsProps) {
    const handleShare = async () => {
        const shareData = {
            title: resourceName,
            text: `Check out ${resourceName} on Monroe Resource Hub`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    return (
        <div className="flex items-center gap-4 w-full md:w-auto">
            <Button
                variant="outline"
                size="lg"
                onClick={handleShare}
                className="flex-1 md:flex-none h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px] border-gray-100 text-gray-500 hover:bg-gray-50 bg-white"
            >
                <Share2 className="h-4 w-4 mr-2" />
                Share
            </Button>
            {website && (
                <Button
                    asChild
                    href={ensureProtocol(website)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px] bg-primary-950 hover:bg-black text-white shadow-lg shadow-primary-950/10 inline-flex items-center justify-center px-10 no-underline transition-all"
                >
                    <span className="flex items-center justify-center">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Website
                    </span>
                </Button>
            )}
        </div>
    );
}
