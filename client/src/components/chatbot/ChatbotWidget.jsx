import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DICTIONARY = {
    'cash runway': 'Cash Runway is the number of days your business can continue to operate and pay its bills at its current burn rate before running out of money, assuming no additional income or funding.',
    'burn rate': 'Burn Rate is the speed at which a company is spending its capital or cash reserves. In FailGuard, a Burn Rate > 1.0x means you are spending more than you are earning.',
    'churn': 'Customer Churn (%) is the percentage of your customers who stopped using your product or service during a given timeframe.',
    'revenue growth': 'Revenue Growth is the month-over-month percentage increase or decrease in your total sales income.',
    'gross margin': 'Gross Margin is the metric showing the total sales revenue minus the cost of goods sold (COGS), divided by total sales revenue. It indicates how efficiently a company uses its resources to produce goods.',
    'failure score': 'The Failure Score (0-100) is a deterministic metric calculated by FailGuard AI. A higher score means your business is closer to critical failure based on your financial health metrics.',
    'autopsy': 'Failure Autopsy Mode analyzes 36 months of historical data to pinpoint the exact root cause and decision that led to financial decline.',
};

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hi! I am the FailGuard AI assistant. Ask me to define any business term used in this dashboard (e.g., "What is burn rate?").' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        const userText = input.trim();
        if (!userText) return;

        // Add user message
        const newMessages = [...messages, { role: 'user', text: userText }];
        setMessages(newMessages);
        setInput('');

        // Find match
        const lowerInput = userText.toLowerCase();
        let foundResponse = "I'm sorry, I don't have a definition for that specific term. Please try asking about Cash Runway, Burn Rate, Churn, Revenue Growth, Gross Margin, Failure Score, or Autopsy.";

        for (const [key, definition] of Object.entries(DICTIONARY)) {
            if (lowerInput.includes(key)) {
                foundResponse = definition;
                break;
            }
        }

        // Add assistant response with slight delay
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'assistant', text: foundResponse }]);
        }, 400);
    };

    return (
        <>
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-zinc-900 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow border border-zinc-900">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed bottom-24 right-6 z-[100] w-[340px] h-[450px] bg-white border border-zinc-200 rounded-2xl shadow-xl flex flex-col overflow-hidden">

                        {/* Header */}
                        <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-zinc-900 animate-pulse" />
                                <span className="font-display font-medium text-sm text-zinc-900">FailGuard Assistant</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        {/* Chat Feed */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                                    key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${msg.role === 'user' ? 'bg-zinc-900 text-white rounded-br-none shadow-sm' : 'bg-zinc-50 text-zinc-900 border border-zinc-200 rounded-bl-none shadow-sm'}`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-3 border-t border-zinc-200 bg-zinc-50">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about a term..."
                                    className="w-full bg-white border border-zinc-300 text-zinc-900 rounded-full pl-4 pr-10 py-2.5 text-[13px] focus:outline-none focus:border-zinc-500 focus:bg-white shadow-sm transition-colors"
                                />
                                <button type="submit" className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-zinc-900 text-white rounded-full flex items-center justify-center hover:bg-zinc-800 transition-colors">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
