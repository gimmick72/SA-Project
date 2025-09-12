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
  if (isAuthenticated()) {
    return true;
  }
  
  // Try to get a new token with demo credentials
  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'testadmin3@clinic.com',
        password: 'password123',
        role: 'admin'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      setAuthToken(data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      return true;
    }
  } catch (error) {
    console.error('Auto-login failed:', error);
  }
  
  return false;
};
