// Utility functions for Rewards/Loyalty Points System

interface RewardsConfig {
    points_per_le: number;
    redemption_rate: number;
    min_redemption_points: number;
    max_discount_percentage: number;
    enabled: boolean;
}

/**
 * Calculate points earned from an order amount
 * @param orderAmount Total order amount in LE
 * @param pointsPerLE Points earned per 1 LE spent
 * @returns Number of points earned (rounded down)
 */
export function calculatePointsEarned(orderAmount: number, pointsPerLE: number = 1.0): number {
    return Math.floor(orderAmount * pointsPerLE);
}

/**
 * Calculate discount value from points
 * @param points Number of points to redeem
 * @param redemptionRate How many points = 1 LE (e.g., 10 points = 1 LE)
 * @returns Discount amount in LE
 */
export function calculateDiscountFromPoints(points: number, redemptionRate: number = 0.10): number {
    return Math.floor(points * redemptionRate * 100) / 100; // Round to 2 decimals
}

/**
 * Calculate maximum points that can be redeemed for an order
 * @param orderAmount Total order amount in LE
 * @param availablePoints User's available points
 * @param config Rewards configuration
 * @returns Maximum points that can be redeemed
 */
export function calculateMaxRedeemablePoints(
    orderAmount: number,
    availablePoints: number,
    config: RewardsConfig
): number {
    const { redemption_rate, min_redemption_points, max_discount_percentage } = config;

    // Can't redeem if below minimum
    if (availablePoints < min_redemption_points) {
        return 0;
    }

    // Calculate maximum discount allowed (e.g., 50% of order)
    const maxDiscountAmount = (orderAmount * max_discount_percentage) / 100;

    // Calculate points needed for max discount
    const pointsForMaxDiscount = Math.floor(maxDiscountAmount / redemption_rate);

    // Return the lesser of: user's points or points for max discount
    return Math.min(availablePoints, pointsForMaxDiscount);
}

/**
 * Validate points redemption
 * @param pointsToRedeem Points user wants to redeem
 * @param availablePoints User's available points
 * @param orderAmount Total order amount
 * @param config Rewards configuration
 * @returns Object with isValid and error message if invalid
 */
export function validatePointsRedemption(
    pointsToRedeem: number,
    availablePoints: number,
    orderAmount: number,
    config: RewardsConfig
): { isValid: boolean; error?: string } {
    // Check if rewards system is enabled
    if (!config.enabled) {
        return { isValid: false, error: 'Rewards system is currently disabled' };
    }

    // Check minimum redemption
    if (pointsToRedeem < config.min_redemption_points) {
        return { isValid: false, error: `Minimum redemption is ${config.min_redemption_points} points` };
    }

    // Check if user has enough points
    if (pointsToRedeem > availablePoints) {
        return { isValid: false, error: 'Insufficient points' };
    }

    // Check maximum discount
    const discount = calculateDiscountFromPoints(pointsToRedeem, config.redemption_rate);
    const maxDiscount = (orderAmount * config.max_discount_percentage) / 100;

    if (discount > maxDiscount) {
        return { isValid: false, error: `Maximum discount is ${config.max_discount_percentage}% of order total` };
    }

    return { isValid: true };
}

/**
 * Format points display with thousand separators
 * @param points Number of points
 * @returns Formatted string
 */
export function formatPoints(points: number): string {
    return points.toLocaleString();
}

/**
 * Get transaction type label
 * @param type Transaction type
 * @returns Human-readable label
 */
export function getTransactionTypeLabel(type: 'earned' | 'redeemed' | 'admin_adjustment'): string {
    const labels = {
        earned: 'Earned',
        redeemed: 'Redeemed',
        admin_adjustment: 'Admin Adjustment'
    };
    return labels[type] || type;
}
