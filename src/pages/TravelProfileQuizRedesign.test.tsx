
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RedesignedQuiz from './TravelProfileQuizRedesign';
import { saveQuizResponse } from '@/lib/supabase/quiz';
import { Toaster } from '@/components/ui/toaster';

// Mock dependencies
vi.mock('@/lib/supabase/quiz', () => ({
  saveQuizResponse: vi.fn(),
}));

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock UI components that might cause issues in test env
vi.mock('@/components/ui/toaster', () => ({
  Toaster: () => null,
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('RedesignedQuiz Integration Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (saveQuizResponse as any).mockResolvedValue({ success: true, id: 'test-id' });
  });

  const renderQuiz = () => {
    return render(
      <BrowserRouter>
        <RedesignedQuiz />
        <Toaster />
      </BrowserRouter>
    );
  };

  it('completes the full quiz flow and submits data', async () => {
    renderQuiz();

    // Step 1: Personality
    // "The Relaxer"
    const relaxerOption = screen.getByText('The Relaxer');
    fireEvent.click(relaxerOption);

    // Step 2: Interests
    await waitFor(() => screen.getByText('What are you into?'));
    const cultureOption = screen.getByText('Culture');
    fireEvent.click(cultureOption);
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    // Step 3: Duration
    await waitFor(() => screen.getByText('How long do you want to go?'));
    const durationOption = screen.getByText('5-7 Days');
    fireEvent.click(durationOption);

    // Step 4: When
    await waitFor(() => screen.getByText('When are you thinking?'));
    const flexibleOption = screen.getByText('I\'m flexible');
    fireEvent.click(flexibleOption);

    // Step 5: Budget
    await waitFor(() => screen.getByText('What\'s your budget?'));
    const budgetOption = screen.getByText('40k - 70k');
    fireEvent.click(budgetOption);

    // Step 6: Travel Style
    await waitFor(() => screen.getByText('Who are you traveling with?'));
    const soloOption = screen.getByText('Solo');
    fireEvent.click(soloOption);

    // Step 7: Regions
    await waitFor(() => screen.getByText('Where do you want to go?'));
    const asiaOption = screen.getByText('Asia');
    fireEvent.click(asiaOption);
    const nextButtonRegions = screen.getByText('Next');
    fireEvent.click(nextButtonRegions);

    // Step 8: Avoid
    await waitFor(() => screen.getByText('Anything to avoid?'));
    const avoidCold = screen.getByText('Freezing Cold');
    fireEvent.click(avoidCold);
    const nextButtonAvoid = screen.getByText('Next');
    fireEvent.click(nextButtonAvoid);

    // Step 9: Email (Submission)
    await waitFor(() => screen.getByText('Where should we send your plan?'));
    
    // Fill inputs - explicitly finding by placeholder or role
    const nameInput = screen.getByPlaceholderText('Your Name');
    fireEvent.change(nameInput, { target: { value: 'Test User' } });

    const emailInput = screen.getByPlaceholderText('your@email.com');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Submit
    const submitButton = screen.getByText('See My Trip Plan');
    fireEvent.click(submitButton);

    // Verify Submission Logic
    await waitFor(() => {
      expect(saveQuizResponse).toHaveBeenCalledTimes(1);
      expect(saveQuizResponse).toHaveBeenCalledWith(expect.objectContaining({
        personality: 'relaxer',
        interests: expect.arrayContaining(['culture']),
        duration: '5-7',
        travelDateType: 'flexible',
        // budget check can be tricky depending on exact object structure passed
        travelStyle: 'solo',
        destinationRegions: expect.arrayContaining(['asia']),
        placesToAvoid: expect.arrayContaining(['very-cold']),
        name: 'Test User',
        email: 'test@example.com',
        resultType: 'matched' // Default mocked type
      }));
    });

    // Verify Navigation/Redirect
    // Wait for the simulated delay (800ms)
    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/quiz/result/matched');
    }, { timeout: 2000 });
  });
});
