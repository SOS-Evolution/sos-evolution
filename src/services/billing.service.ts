import { SupabaseClient } from '@supabase/supabase-js';
import { InsufficientCreditsError, DatabaseError } from '@/src/domain/errors';

/**
 * BillingService — Single Source of Truth for credit operations.
 * Centralizes balance checks and credit deductions.
 */
export class BillingService {
    constructor(private supabase: SupabaseClient) { }

    /**
     * Get the current balance for a user.
     */
    async getBalance(userId: string): Promise<number> {
        const { data, error } = await this.supabase.rpc('get_user_balance_v2', {
            p_user_id: userId,
        });

        if (error) {
            console.error('BillingService.getBalance failed:', error);
            throw new DatabaseError('get_user_balance_v2', error.message);
        }

        return data || 0;
    }

    /**
     * Check that the user has enough balance. Throws if not.
     * @throws InsufficientCreditsError
     */
    async ensureSufficientBalance(userId: string, cost: number): Promise<number> {
        if (cost <= 0) return 0;

        const balance = await this.getBalance(userId);

        if (balance < cost) {
            throw new InsufficientCreditsError(cost, balance);
        }

        return balance;
    }

    /**
     * Spend credits for a user. Should only be called AFTER the operation succeeds.
     */
    async spendCredits(
        userId: string,
        amount: number,
        description: string,
        referenceId: string | null = null
    ): Promise<number> {
        if (amount <= 0) {
            return this.getBalance(userId);
        }

        const { error } = await this.supabase.rpc('spend_credits_v2', {
            p_user_id: userId,
            p_amount: amount,
            p_description: description,
            p_reference_id: referenceId,
        });

        if (error) {
            console.error('CRITICAL: BillingService.spendCredits failed:', error);
            // Don't throw — the operation already succeeded, we just log the billing failure
        } else {
            console.log(`BillingService: Spent ${amount} credits for user ${userId}`);
        }

        // Return updated balance
        return this.getBalance(userId);
    }
}
