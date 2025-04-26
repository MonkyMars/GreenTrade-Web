import api from '@/lib/backend/api/axiosConfig'
import { toast } from 'react-hot-toast'
import { AppError, retryOperation } from '@/lib/errorUtils'

/**
 * Toggle a listing as favorite/unfavorite with proper error handling
 */
export const toggleFavorite = async (listingId: string): Promise<boolean> => {
  try {
    // Use type-safe retry utility
    const response = await retryOperation(
      () => api.post('/api/favorites/toggle', { listingId }),
      {
        context: "Updating favorites",
        maxRetries: 2,
        delayMs: 500,
        shouldRetry: (error) => !!error.isNetworkError || !!(error.status && error.status >= 500)
      }
    )
    
    if (!response.data || !response.data.success) {
      throw new AppError(response.data?.message || 'Failed to update favorites', {
        code: 'UPDATE_FAILED',
        status: response.status
      })
    }
    
    // Return whether the item is now favorited or not
    const isFavorited = response.data.data.isFavorited;
    
    // Show success message
    if (process.env.NODE_ENV === 'production') {
      toast.success(isFavorited ? 'Added to favorites' : 'Removed from favorites');
    }
    
    return isFavorited;
  } catch (error) {
    // Convert to AppError if not already
    const appError = error instanceof AppError 
      ? error 
      : AppError.from(error, 'Updating favorites');
    
    // Create a user-friendly error message
    const errorMessage = appError.message || 'Failed to update favorites. Please try again.';
    
    // Show error to user in production if not already shown by retryOperation
    if (process.env.NODE_ENV === 'production' && !appError.context?.includes('Updating favorites')) {
      toast.error(errorMessage);
    }
    
    // Log in development, use proper error tracking in production
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error updating favorites:', appError);
    } else {
      // In production, use proper error tracking
      // Example: Sentry.captureException(appError)
    }
    
    // Rethrow with improved message
    throw appError;
  }
}

/**
 * Check if a listing is in the user's favorites
 */
export const checkIsFavorite = async (listingId: string): Promise<boolean> => {
  try {
    // Use type-safe retry utility
    const response = await retryOperation(
      () => api.get(`/favorites/check/${listingId}`),
      {
        context: "Checking favorite status",
        maxRetries: 2,
        delayMs: 300,
        showToastOnRetry: false // No need for toast on this check
      }
    )
    
    if (!response.data || !response.data.success) {
      throw new AppError(response.data?.message || 'Failed to check favorite status', {
        code: 'CHECK_FAILED',
        status: response.status
      })
    }
    
    return response.data.data.isFavorited;
  } catch (error) {
    // For this function, we'll handle the error more quietly
    // Convert to AppError if not already
    const appError = error instanceof AppError 
      ? error 
      : AppError.from(error, 'Checking favorite status');
    
    // Log in development, use proper error tracking in production
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error checking favorite status:', appError);
    } else {
      // In production, this would use a service like Sentry
      // Example: Sentry.captureException(appError)
    }
    
    // Return false on error (assume not favorited)
    return false;
  }
}