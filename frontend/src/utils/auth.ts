// Authentication utility functions
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    // Check if token is expired (basic JWT check)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch (error) {
    console.error('Invalid token format:', error);
    return false;
  }
};

export const ensureAuthentication = async (): Promise<boolean> => {
  console.log('ensureAuthentication: Starting authentication check');
  
  if (isAuthenticated()) {
    console.log('ensureAuthentication: Already authenticated');
    return true;
  }
  
  console.log('ensureAuthentication: Not authenticated, attempting auto-login');
  
  // First test basic connectivity
  try {
    console.log('ensureAuthentication: Testing backend connectivity...');
    const testResponse = await fetch('http://localhost:8080/api/auth/login', {
      method: 'OPTIONS'
    });
    console.log('ensureAuthentication: Connectivity test status:', testResponse.status);
  } catch (connectError) {
    console.error('ensureAuthentication: Backend connectivity failed:', connectError);
    return false;
  }
  
  // Try to get a new token with demo credentials
  try {
    console.log('ensureAuthentication: Making login request to backend at http://localhost:8080/api/auth/login');
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@clinic.com',
        password: 'admin123',
        role: 'admin'
      })
    });
    
    console.log('ensureAuthentication: Login response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('ensureAuthentication: Login successful, setting token');
      setAuthToken(data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      return true;
    } else {
      const errorData = await response.text();
      console.error('ensureAuthentication: Login failed with response:', errorData);
    }
  } catch (error) {
    console.error('ensureAuthentication: Auto-login failed with error:', error);
  }
  
  console.log('ensureAuthentication: Authentication failed');
  return false;
};
