'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { supabase } from '@/lib/supabase';

interface PointsAdjustmentDialogProps {
    userId: string;
    userName: string;
    currentPoints: number;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function PointsAdjustmentDialog({
    userId,
    userName,
    currentPoints,
    isOpen,
    onClose,
    onSuccess
}: PointsAdjustmentDialogProps) {
    const { t } = useLanguage();
    const [adjustmentType, setAdjustmentType] = useState<'add' | 'deduct'>('add');
    const [points, setPoints] = useState(0);
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (points <= 0) {
            alert('Please enter a valid points amount');
            return;
        }

        setIsSubmitting(true);

        try {
            const pointsChange = adjustmentType === 'add' ? points : -points;
            const newTotal = Math.max(0, currentPoints + pointsChange);

            // Create transaction record
            const { error: txError } = await supabase
                .from('loyalty_transactions')
                .insert({
                    user_id: userId,
                    points_change: pointsChange,
                    transaction_type: 'admin_adjustment',
                    description: reason || `Admin ${adjustmentType === 'add' ? 'added' : 'deducted'} ${points} points`
                });

            if (txError) throw txError;

            // Update user's points
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ loyalty_points: newTotal })
                .eq('id', userId);

            if (updateError) throw updateError;

            onSuccess();
            handleClose();
        } catch (error: any) {
            console.error('Error adjusting points:', error);
            alert('Error adjusting points: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setPoints(0);
        setReason('');
        setAdjustmentType('add');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="fancy-card border-none max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black uppercase italic text-white tracking-tight">
                        {t('points_adjustment')}
                    </DialogTitle>
                    <p className="text-sm text-white/60 mt-2">
                        Adjusting points for: <span className="text-white font-black">{userName}</span>
                    </p>
                    <p className="text-xs text-white/40">
                        Current balance: <span className="text-primary font-black">{currentPoints.toLocaleString()} points</span>
                    </p>
                </DialogHeader>

                <div className="space-y-6 py-6">
                    {/* Adjustment Type */}
                    <div className="space-y-3">
                        <Label className="text-xs font-black uppercase tracking-widest text-primary">
                            {t('transaction_type')}
                        </Label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setAdjustmentType('add')}
                                className={`p-6 rounded-2xl border-2 transition-all ${adjustmentType === 'add'
                                        ? 'border-emerald-500 bg-emerald-500/10'
                                        : 'border-white/10 bg-white/5'
                                    }`}
                            >
                                <Plus className={`w-8 h-8 mx-auto mb-2 ${adjustmentType === 'add' ? 'text-emerald-400' : 'text-white/40'}`} />
                                <p className={`font-black uppercase text-sm ${adjustmentType === 'add' ? 'text-emerald-400' : 'text-white/60'}`}>
                                    {t('add_points')}
                                </p>
                            </button>
                            <button
                                onClick={() => setAdjustmentType('deduct')}
                                className={`p-6 rounded-2xl border-2 transition-all ${adjustmentType === 'deduct'
                                        ? 'border-red-500 bg-red-500/10'
                                        : 'border-white/10 bg-white/5'
                                    }`}
                            >
                                <Minus className={`w-8 h-8 mx-auto mb-2 ${adjustmentType === 'deduct' ? 'text-red-400' : 'text-white/40'}`} />
                                <p className={`font-black uppercase text-sm ${adjustmentType === 'deduct' ? 'text-red-400' : 'text-white/60'}`}>
                                    {t('deduct_points')}
                                </p>
                            </button>
                        </div>
                    </div>

                    {/* Points Amount */}
                    <div className="space-y-3">
                        <Label className="text-xs font-black uppercase tracking-widest text-primary">
                            Points Amount
                        </Label>
                        <Input
                            type="number"
                            min="1"
                            value={points || ''}
                            onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                            placeholder={t('enter_amount')}
                            className="rounded-2xl h-14 bg-white/5 border-white/10 text-white font-bold"
                        />
                    </div>

                    {/* Reason */}
                    <div className="space-y-3">
                        <Label className="text-xs font-black uppercase tracking-widest text-primary">
                            {t('reason')} (Optional)
                        </Label>
                        <Textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g., Compensation for issue, Bonus points, etc."
                            className="rounded-2xl min-h-[100px] bg-white/5 border-white/10 text-white font-medium resize-none"
                        />
                    </div>

                    {/* Preview */}
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-2">Preview</p>
                        <div className="flex justify-between items-center">
                            <span className="text-white/60">New Balance:</span>
                            <span className={`text-2xl font-black ${adjustmentType === 'add' ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                {Math.max(0, currentPoints + (adjustmentType === 'add' ? points : -points)).toLocaleString()} points
                            </span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-3">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        className="rounded-2xl h-12 border-white/10 bg-white/5 text-white hover:bg-white/10 font-black uppercase tracking-widest"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || points <= 0}
                        className="rounded-2xl h-12 bg-primary hover:bg-primary/80 font-black uppercase tracking-widest"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                Processing...
                            </>
                        ) : (
                            `${adjustmentType === 'add' ? 'Add' : 'Deduct'} Points`
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
