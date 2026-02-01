'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Settings, Save, Star } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { supabase } from '@/lib/supabase';

interface RewardsConfig {
    id: number;
    points_per_le: number;
    redemption_rate: number;
    min_redemption_points: number;
    max_discount_percentage: number;
    enabled: boolean;
}

export default function AdminRewardsConfigPage() {
    const { t, dir } = useLanguage();
    const [config, setConfig] = useState<RewardsConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const { data, error } = await supabase
                .from('rewards_config')
                .select('*')
                .eq('id', 1)
                .single();

            if (error) throw error;
            setConfig(data);
        } catch (error) {
            console.error('Error fetching config:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!config) return;

        setIsSaving(true);
        setSuccessMessage(null);

        try {
            const { error } = await supabase
                .from('rewards_config')
                .update({
                    points_per_le: config.points_per_le,
                    redemption_rate: config.redemption_rate,
                    min_redemption_points: config.min_redemption_points,
                    max_discount_percentage: config.max_discount_percentage,
                    enabled: config.enabled,
                    updated_at: new Date().toISOString()
                })
                .eq('id', 1);

            if (error) throw error;

            setSuccessMessage('Configuration saved successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error: any) {
            console.error('Error saving config:', error);
            alert('Error saving configuration: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!config) {
        return (
            <div className="text-center py-20">
                <p className="text-white/40 font-bold">Could not load rewards configuration</p>
            </div>
        );
    }

    return (
        <div className="space-y-12" dir={dir}>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500 border border-yellow-500/20">
                            <Star className="w-8 h-8" />
                        </div>
                        <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">
                            <span className="text-gradient">{t('rewards_system')}</span>
                        </h1>
                    </div>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-[0.4em] ml-1">{t('points_config')}</p>
                </div>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                    <p className="text-emerald-400 font-bold text-center">{successMessage}</p>
                </div>
            )}

            {/* Configuration Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* System Enable/Disable */}
                <Card className="fancy-card border-none overflow-hidden">
                    <CardHeader className="bg-white/5 border-b border-white/5 py-8 px-10">
                        <div className="flex items-center gap-3">
                            <Settings className="w-6 h-6 text-primary" />
                            <CardTitle className="text-2xl font-black uppercase italic text-white tracking-tight">
                                System Status
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-10 space-y-6">
                        <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div>
                                <Label className="text-base font-black text-white uppercase tracking-wide">
                                    {t('enable_rewards')}
                                </Label>
                                <p className="text-xs text-white/40 mt-1 font-medium">
                                    Turn rewards system on or off
                                </p>
                            </div>
                            <Switch
                                checked={config.enabled}
                                onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
                                className="data-[state=checked]:bg-primary"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Points Earning Rate */}
                <Card className="fancy-card border-none overflow-hidden">
                    <CardHeader className="bg-white/5 border-b border-white/5 py-8 px-10">
                        <CardTitle className="text-2xl font-black uppercase italic text-white tracking-tight">
                            {t('earn_rate')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 space-y-4">
                        <Label className="text-xs font-black uppercase tracking-widest text-primary">
                            {t('points_per_currency')}
                        </Label>
                        <Input
                            type="number"
                            step="0.1"
                            value={config.points_per_le}
                            onChange={(e) => setConfig({ ...config, points_per_le: parseFloat(e.target.value) || 0 })}
                            className="rounded-2xl h-14 bg-white/5 border-white/10 text-white font-bold"
                        />
                        <p className="text-xs text-white/40 font-medium">
                            Points earned per 1 LE spent
                        </p>
                    </CardContent>
                </Card>

                {/* Redemption Rate */}
                <Card className="fancy-card border-none overflow-hidden">
                    <CardHeader className="bg-white/5 border-b border-white/5 py-8 px-10">
                        <CardTitle className="text-2xl font-black uppercase italic text-white tracking-tight">
                            {t('redemption_rate')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 space-y-4">
                        <Label className="text-xs font-black uppercase tracking-widest text-primary">
                            {t('points_value')}
                        </Label>
                        <Input
                            type="number"
                            step="0.01"
                            value={config.redemption_rate}
                            onChange={(e) => setConfig({ ...config, redemption_rate: parseFloat(e.target.value) || 0 })}
                            className="rounded-2xl h-14 bg-white/5 border-white/10 text-white font-bold"
                        />
                        <p className="text-xs text-white/40 font-medium">
                            Discount value per point (e.g., 0.10 = 10 points = 1 LE)
                        </p>
                    </CardContent>
                </Card>

                {/* Minimum Redemption */}
                <Card className="fancy-card border-none overflow-hidden">
                    <CardHeader className="bg-white/5 border-b border-white/5 py-8 px-10">
                        <CardTitle className="text-2xl font-black uppercase italic text-white tracking-tight">
                            {t('minimum_redemption')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 space-y-4">
                        <Label className="text-xs font-black uppercase tracking-widest text-primary">
                            Minimum Points
                        </Label>
                        <Input
                            type="number"
                            value={config.min_redemption_points}
                            onChange={(e) => setConfig({ ...config, min_redemption_points: parseInt(e.target.value) || 0 })}
                            className="rounded-2xl h-14 bg-white/5 border-white/10 text-white font-bold"
                        />
                        <p className="text-xs text-white/40 font-medium">
                            Minimum points required to redeem
                        </p>
                    </CardContent>
                </Card>

                {/* Maximum Discount */}
                <Card className="fancy-card border-none overflow-hidden lg:col-span-2">
                    <CardHeader className="bg-white/5 border-b border-white/5 py-8 px-10">
                        <CardTitle className="text-2xl font-black uppercase italic text-white tracking-tight">
                            {t('max_discount')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 space-y-4">
                        <Label className="text-xs font-black uppercase tracking-widest text-primary">
                            Maximum Discount Percentage
                        </Label>
                        <Input
                            type="number"
                            value={config.max_discount_percentage}
                            onChange={(e) => setConfig({ ...config, max_discount_percentage: parseInt(e.target.value) || 0 })}
                            className="rounded-2xl h-14 bg-white/5 border-white/10 text-white font-bold max-w-md"
                        />
                        <p className="text-xs text-white/40 font-medium">
                            Maximum percentage of order that can be discounted via points
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="rounded-2xl px-16 h-16 text-lg font-black uppercase tracking-widest bg-primary hover:bg-primary/80 shadow-[0_20px_50px_rgba(139,92,246,0.3)]"
                >
                    {isSaving ? (
                        <>
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-6 h-6 mr-3" />
                            {t('save_changes')}
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
