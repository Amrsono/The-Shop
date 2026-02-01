'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrendingUp, TrendingDown, Settings, Calendar } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { formatPoints } from '@/lib/utils/rewards';

interface LoyaltyTransaction {
    id: string;
    points_change: number;
    transaction_type: 'earned' | 'redeemed' | 'admin_adjustment';
    description: string | null;
    created_at: string;
}

interface PointsHistoryProps {
    userId: string;
}

export function PointsHistory({ userId }: PointsHistoryProps) {
    const { t, dir } = useLanguage();
    const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, [userId]);

    const fetchTransactions = async () => {
        try {
            const { data, error } = await supabase
                .from('loyalty_transactions')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) throw error;
            setTransactions(data || []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'earned':
                return <TrendingUp className="w-5 h-5 text-emerald-400" />;
            case 'redeemed':
                return <TrendingDown className="w-5 h-5 text-orange-400" />;
            case 'admin_adjustment':
                return <Settings className="w-5 h-5 text-blue-400" />;
            default:
                return <Calendar className="w-5 h-5 text-white/40" />;
        }
    };

    const getTransactionColor = (type: string, points: number) => {
        if (type === 'earned' || points > 0) return 'text-emerald-400';
        if (type === 'redeemed' || points < 0) return 'text-orange-400';
        return 'text-blue-400';
    };

    const getTransactionLabel = (type: string) => {
        switch (type) {
            case 'earned':
                return t('earned');
            case 'redeemed':
                return t('redeemed');
            case 'admin_adjustment':
                return t('admin_adjustment');
            default:
                return type;
        }
    };

    if (isLoading) {
        return (
            <Card className="fancy-card border-none overflow-hidden" dir={dir}>
                <CardHeader className="bg-white/5 border-b border-white/5 py-8 px-10">
                    <CardTitle className="text-2xl font-black tracking-tight text-white uppercase italic">
                        {t('points_history')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-10">
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="fancy-card border-none overflow-hidden" dir={dir}>
            <CardHeader className="bg-white/5 border-b border-white/5 py-8 px-10">
                <CardTitle className="text-2xl font-black tracking-tight text-white uppercase italic">
                    {t('points_history')}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-10">
                {transactions.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
                            {t('no_transactions')}
                        </p>
                    </div>
                ) : (
                    <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-6">
                            {transactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="p-3 glass rounded-xl">
                                            {getTransactionIcon(tx.transaction_type)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-black text-sm uppercase tracking-tight text-white mb-1">
                                                {getTransactionLabel(tx.transaction_type)}
                                            </p>
                                            {tx.description && (
                                                <p className="text-xs text-white/40 font-medium line-clamp-1">
                                                    {tx.description}
                                                </p>
                                            )}
                                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-2">
                                                {new Date(tx.created_at).toLocaleDateString()} • {new Date(tx.created_at).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`text-right ${getTransactionColor(tx.transaction_type, tx.points_change)}`}>
                                        <p className="text-2xl font-black">
                                            {tx.points_change > 0 ? '+' : ''}{formatPoints(tx.points_change)}
                                        </p>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">
                                            {t('points')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
}
