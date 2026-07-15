export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with an error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return {
          type: 'validation',
          message: data?.message || 'Bad request. Please check your inputs.',
          errors: data?.errors,
        };
      
      case 401:
        return {
          type: 'unauthorized',
          message: data?.message || 'Unauthorized access. Please login.',
        };
      
      case 403:
        return {
          type: 'forbidden',
          message: data?.message || 'Access forbidden.',
        };
      
      case 404:
        return {
          type: 'not_found',
          message: data?.message || 'Resource not found.',
        };
      
      case 422:
        return {
          type: 'unprocessable',
          message: data?.message || 'Request could not be processed.',
          errors: data?.errors,
        };
      
      default:
        return {
          type: 'server_error',
          message: data?.message || 'An error occurred. Please try again later.',
        };
    }
  } else if (error.request) {
    // Request was made but no response was received
    return {
      type: 'network_error',
      message: 'Network error. Please check your connection.',
    };
  } else {
    // Something happened in setting up the request
    return {
      type: 'unknown_error',
      message: error.message || 'An unexpected error occurred.',
    };
  }
};

export const isUnauthorizedError = (error) => {
  return error.response?.status === 401;
};

export const isValidationError = (error) => {
  return error.response?.status === 400;
};

export const getErrorMessage = (error) => {
  const apiError = handleApiError(error);
  return apiError.message;
};

export const getErrorType = (error) => {
  const apiError = handleApiError(error);
  return apiError.type;
};

export const getErrorDetails = (error) => {
  const apiError = handleApiError(error);
  return {
    type: apiError.type,
    message: apiError.message,
    errors: apiError.errors,
  };
};
