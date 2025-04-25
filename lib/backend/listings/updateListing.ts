import api from '@/lib/backend/api/axiosConfig'
import { toast } from 'react-hot-toast'
import { AppError, retryOperation } from '@/lib/errorUtils'

/**
 * Update a listing with comprehensive error handling and retry logic
 * @param listingId ID of the listing to update
 * @param updates Object containing the fields to update
 * @returns The updated listing data or throws an AppError
 */
export const updateListing = async (listingId: string, updates: Record<string, unknown>) => {
  // Show loading toast in production
  let loadingToast: string | undefined
  if (process.env.NODE_ENV === 'production') {
    loadingToast = toast.loading('Updating listing...')
  }
  
  try {
    // Use retryOperation for robust error handling and automatic retries
    const response = await retryOperation(
      () => api.patch(`/listings/${listingId}`, updates),
      {
        context: "Updating listing",
        maxRetries: 2,
        delayMs: 800,
        shouldRetry: (error) => !!error.isNetworkError || !!(error.status && error.status >= 500)
      }
    )
    
    // Validate the response
    if (!response.data || !response.data.success) {
      throw new AppError(response.data?.message || 'Failed to update listing', {
        code: 'UPDATE_FAILED',
        status: response.status,
        context: 'Listing update'
      })
    }

    // Dismiss loading toast in production
    if (loadingToast && process.env.NODE_ENV === 'production') {
      toast.dismiss(loadingToast)
      toast.success('Listing updated successfully')
    }
    
    return response.data.data
  } catch (error) {
    // Dismiss loading toast in production
    if (loadingToast && process.env.NODE_ENV === 'production') {
      toast.dismiss(loadingToast)
    }
    
    // Convert to AppError if not already
    const appError = error instanceof AppError 
      ? error 
      : AppError.from(error, 'Listing update');
    
    // Create a user-friendly error message based on the error type
    let errorMessage: string;
    
    if (appError.status === 404) {
      errorMessage = 'Listing not found. It may have been removed.';
    } else if (appError.status === 403) {
      errorMessage = 'You do not have permission to update this listing.';
    } else if (appError.validationErrors && Object.keys(appError.validationErrors).length > 0) {
      const validationMessages = Object.values(appError.validationErrors)
        .flat()
        .join(', ');
      errorMessage = `Validation error: ${validationMessages}`;
    } else {
      errorMessage = appError.message || 'Failed to update listing. Please try again later.';
    }
    
    // Show error toast in production if not already shown by retryOperation
    if (process.env.NODE_ENV === 'production' && !appError.context?.includes('Updating listing')) {
      toast.error(errorMessage);
    }
    
    // Log in development, would use proper error tracking in production
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error updating listing:', appError);
    } else {
      // In production, this would use a service like Sentry
      // Example: Sentry.captureException(appError);
    }
    
    // Rethrow with improved message
    throw appError;
  }
};
