import { supabase } from '@/integrations/supabase/client';

interface SendProposalEmailParams {
    userEmail: string;
    userName: string;
    proposalId: string;
    destinationName: string;
    expiryDate?: string;
}

export const sendProposalNotificationEmail = async ({
    userEmail,
    userName,
    proposalId,
    destinationName,
    expiryDate,
}: SendProposalEmailParams): Promise<void> => {
    try {
        // Call Supabase Edge Function for sending email
        const { data, error } = await supabase.functions.invoke('send-proposal-email', {
            body: {
                to: userEmail,
                userName,
                proposalId,
                destinationName,
                expiryDate,
                proposalUrl: `${window.location.origin}/dashboard/proposals/${proposalId}`,
            },
        });

        if (error) throw error;

        console.log('Proposal email sent successfully:', data);
    } catch (error) {
        console.error('Failed to send proposal email:', error);
        throw error;
    }
};
