'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, Gift, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import {
    calculateDiscountFromPoints,
    calculateMaxRedeemablePoints,
    validatePointsRedemption
} from '@/lib/utils/rewards';

interface RewardsConfig {
    points_per_le: number;
    redemption_rate: number;
    min_redemption_points: number;
    max_discount_percentage: number;
    enabled: boolean;
}

interface PointsRedemptionProps {
    userId: string | null;
    cartTotal: number;
    onPointsApplied: (points: number, discount: number) => void;
}

export function PointsRedemption({ userId, cartTotal, onPointsApplied }: PointsRedemptionProps) {
    const { t, dir } = useLanguage();
    const [availablePoints, setAvailablePoints] = useState(0);
    const [pointsToRedeem, setPointsToRedeem] = useState(0);
    const [config, setConfig] = useState<RewardsConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isApplied, setIsApplied] = useState(false);

    useEffect(() => {
        if (userId) {
            fetchUserPoints();
            fetchConfig();
        } else {
            setIsLoading(false);
        }
    }, [userId]);

    const fetchUserPoints = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('loyalty_points')
                .eq('id', userId)
                .single();

            if (error) throw error;
            setAvailablePoints(data?.loyalty_points || 0);
        } catch (err) {
            console.error('Error fetching points:', err);
        }
    };

    const fetchConfig = async () => {
        try {
            const { data, error } = await supabase
                .from('rewards_config')
                .select('*')
                .eq('id', 1)
                .single();

            if (error) throw error;
            setConfig(data);
        } catch (err) {
            console.error('Error fetching rewards config:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApplyPoints = () => {
        if (!config) return;

        setError(null);

        // Validate redemption
        const validation = validatePointsRedemption(
            pointsToRedeem,
            availablePoints,
            cartTotal,
            config
        );

        if (!validation.isValid) {
            setError(validation.error || 'Invalid redemption');
            return;
        }

        // Calculate discount
        const discount = calculateDiscountFromPoints(pointsToRedeem, config.redemption_rate);

        // Apply points
        setIsApplied(true);
        onPointsApplied(pointsToRedeem, discount);
    };

    const handleUseMaxPoints = () => {
        if (!config) return;

        const maxPoints = calculateMaxRedeemablePoints(cartTotal, availablePoints, config);
        setPointsToRedeem(maxPoints);
    };

    const handleRemovePoints = () => {
        setPointsToRedeem(0);
        setIsApplied(false);
        setError(null);
        onPointsApplied(0, 0);
    };

    // Don't render if guest or system disabled
    if (!userId || isLoading || !config || !config.enabled || availablePoints < config.min_redemption_points) {
        return null;
    }

    const maxRedeemablePoints = calculateMaxRedeemablePoints(cartTotal, availablePoints, config);
    const currentDiscount = isApplied ? calculateDiscountFromPoints(pointsToRedeem, config.redemption_rate) : 0;

    return (
        <Card className="fancy-card border-none overflow-hidden" dir={dir}>
            <CardHeader className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-b border-white/5 py-6 px-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-yellow-500/20 rounded-xl">
                        <Star className="w-6 h-6 text-yellow-400" />
                    </div>
                    <CardTitle className="text-xl font-black uppercase italic text-white tracking-tight">
                        {t('rewards_system')}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
                {/* Available Points Display */}
                <div className="flex justify-between items-center p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">
                            {t('available_points')}
                        </p>
                        <p className="text-3xl font-black text-white">{availablePoints.toLocaleString()}</p>
                    </div>
                    <Gift className="w-12 h-12 text-primary/40" />
                </div>

                {!isApplied ? (
                    <>
                        {/* Input Points */}
                        <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest text-primary">
                                {t('redeem_points')}
                            </Label>
                            <div className="flex gap-3">
                                <Input
                                    type="number"
                                    min={config.min_redemption_points}
                                    max={maxRedeemablePoints}
                                    value={pointsToRedeem || ''}
                                    onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                                    placeholder={`Min: ${config.min_redemption_points}`}
                                    className="rounded-2xl h-14 bg-white/5 border-white/10 text-white font-bold"
                                />
                                <Button
                                    variant="outline"
                                    onClick={handleUseMaxPoints}
                                    className="rounded-2xl h-14 px-6 border-primary/20 bg-primary/10 text-primary hover:bg-primary hover:text-white font-black uppercase text-xs tracking-widest"
                                >
                                    {t('maximum_points')}
                                </Button>
                            </div>
                            <p className="text-xs text-white/40 font-medium">
                                {t('points_will_save')}: {t('currency_le')} {pointsToRedeem > 0 ? calculateDiscountFromPoints(pointsToRedeem, config.redemption_rate).toFixed(2) : '0.00'}
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                <AlertCircle className="w-5 h-5 text-red-400" />
                                <p className="text-sm text-red-400 font-bold">{error}</p>
                            </div>
                        )}

                        {/* Apply Button */}
                        <Button
                            onClick={handleApplyPoints}
                            disabled={pointsToRedeem < config.min_redemption_points}
                            className="w-full rounded-2xl h-14 bg-primary text-white hover:bg-primary/80 font-black uppercase tracking-widest text-sm"
                        >
                            {t('apply_points')}
                        </Button>
                    </>
                ) : (
                    <>
                        {/* Applied State */}
                        <div className="space-y-4 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                            <div className="flex items-center gap-3">
                                <Star className="w-6 h-6 text-emerald-400" />
                                <p className="text-sm font-black uppercase tracking-widest text-emerald-400">
                                    {t('points_applied')}
                                </p>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/60 font-bold">{pointsToRedeem.toLocaleString()} {t('points')}</span>
                                <span className="text-2xl font-black text-emerald-400">
                                    -{t('currency_le')} {currentDiscount.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            onClick={handleRemovePoints}
                            className="w-full rounded-2xl h-14 border-white/10 bg-white/5 text-white/60 hover:bg-white/10 font-black uppercase tracking-widest text-sm"
                        >
                            Remove Points
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
