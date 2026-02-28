'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Command, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [query, setQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onClose(); // This is a bit recursive if we use it inside the header, but we'll handle it
            }
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/resources?search=${encodeURIComponent(query)}`);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-2xl bg-slate-900/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl"
                    >
                        <form onSubmit={handleSearch} className="relative flex items-center p-6 gap-4">
                            <Search className="w-6 h-6 text-slate-400" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Find food assistance, housing, or career support..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-xl text-white placeholder:text-slate-500 font-medium"
                            />
                            <div className="flex items-center gap-2">
                                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-slate-400 font-mono">
                                    <span className="text-[10px]">ESC</span>
                                </kbd>
                                <X
                                    className="w-6 h-6 text-slate-500 cursor-pointer hover:text-white transition-colors"
                                    onClick={onClose}
                                />
                            </div>
                        </form>

                        <div className="px-6 pb-6 pt-2 border-t border-white/5">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-4 h-4 text-primary-400" />
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Quick Actions</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {[
                                    { label: "Food Assistance", href: "/resources?category=food" },
                                    { label: "Housing Support", href: "/resources?category=housing" },
                                    { label: "Job Resources", href: "/resources?category=career" },
                                    { label: "Education & Skills", href: "/resources?category=education" }
                                ].map((action) => (
                                    <button
                                        key={action.label}
                                        onClick={() => { router.push(action.href); onClose(); }}
                                        className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-sm text-slate-300 transition-all text-left"
                                    >
                                        <Search className="w-4 h-4 opacity-50" />
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-black/40 px-6 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-4 text-[10px] text-slate-500 font-bold tracking-widest">
                                <span className="flex items-center gap-1">
                                    <Command className="w-3 h-3" /> K TO SEARCH
                                </span>
                                <span>ESC TO CLOSE</span>
                            </div>
                            <div className="text-[10px] text-primary-400/50 font-bold">MONROE HUB</div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
