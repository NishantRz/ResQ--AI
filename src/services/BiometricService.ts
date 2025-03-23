
// Biometric service for authentication

interface BiometricOptions {
  promptTitle?: string;
  promptSubtitle?: string;
  onError?: (error: string) => void;
}

type BiometricType = 'fingerprint' | 'face' | 'iris';

interface BiometricAuthResult {
  success: boolean;
  authenticatedWith?: BiometricType;
  timestamp: number;
  message?: string;
}

class BiometricService {
  private static instance: BiometricService;
  private isAvailable: boolean = false;
  private supportedMethods: BiometricType[] = [];
  
  private constructor() {
    // Check if the Web Authentication API is available
    this.checkAvailability();
  }
  
  public static getInstance(): BiometricService {
    if (!BiometricService.instance) {
      BiometricService.instance = new BiometricService();
    }
    return BiometricService.instance;
  }
  
  private checkAvailability(): void {
    // In a real app, we would check if the Web Authentication API is available
    // and what biometric capabilities are supported by the device.
    // For this demo, we'll simulate capabilities based on the browser
    
    const userAgent = navigator.userAgent.toLowerCase();
    this.isAvailable = true;
    
    // Simulate supported methods based on browser/device
    if (/iphone|ipad|ipod/.test(userAgent)) {
      this.supportedMethods = ['face', 'fingerprint'];
    } else if (/android/.test(userAgent)) {
      this.supportedMethods = ['fingerprint', 'face', 'iris'];
    } else {
      this.supportedMethods = ['fingerprint'];
    }
    
    console.log("Biometric support detected:", this.supportedMethods);
  }
  
  public canUseBiometrics(): boolean {
    return this.isAvailable && this.supportedMethods.length > 0;
  }
  
  public getSupportedMethods(): BiometricType[] {
    return [...this.supportedMethods];
  }
  
  public authenticate(options: BiometricOptions = {}): Promise<BiometricAuthResult> {
    if (!this.canUseBiometrics()) {
      return Promise.reject(new Error("Biometric authentication is not available on this device."));
    }
    
    // In a real app, we would use the Web Authentication API or platform-specific APIs
    // For this demo, we'll simulate the authentication process
    
    return new Promise((resolve, reject) => {
      const dialog = document.createElement('div');
      dialog.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
      dialog.innerHTML = `
        <div class="bg-card p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
          <h2 class="text-xl font-semibold mb-2">${options.promptTitle || 'Biometric Authentication'}</h2>
          <p class="text-muted-foreground mb-6">${options.promptSubtitle || 'Please authenticate using your biometric data.'}</p>
          
          <div class="flex flex-col gap-3 mb-6">
            ${this.supportedMethods.map(method => `
              <button class="biometric-option px-4 py-3 border rounded-lg hover:bg-primary/10 flex items-center gap-3" data-method="${method}">
                <div class="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  ${method === 'fingerprint' ? 
                    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 14.5a2.5 2.5 0 0 1-5 0v-6a5 5 0 0 1 10 0v8.5"/><path d="M12 18.5a2.5 2.5 0 0 1-5 0"/><path d="M17 12.5a2.5 2.5 0 0 0-5 0v3"/></svg>' : 
                    method === 'face' ? 
                    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="9" cy="9" r="1"/><circle cx="15" cy="9" r="1"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/></svg>' : 
                    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>'
                  }
                </div>
                <span class="font-medium">${method.charAt(0).toUpperCase() + method.slice(1)} Recognition</span>
              </button>
            `).join('')}
          </div>
          
          <div class="flex justify-end gap-3">
            <button class="cancel-btn px-4 py-2 border rounded-md hover:bg-muted">Cancel</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(dialog);
      
      // Handle cancel
      const cancelBtn = dialog.querySelector('.cancel-btn');
      cancelBtn?.addEventListener('click', () => {
        document.body.removeChild(dialog);
        if (options.onError) {
          options.onError('User cancelled biometric authentication');
        }
        reject(new Error('User cancelled biometric authentication'));
      });
      
      // Handle biometric selection
      const biometricOptions = dialog.querySelectorAll('.biometric-option');
      biometricOptions.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const method = (button as HTMLElement).dataset.method as BiometricType;
          
          // Simulate verification process
          dialog.innerHTML = `
            <div class="bg-card p-6 rounded-xl shadow-xl max-w-md w-full mx-4 text-center">
              <div class="animate-pulse mb-4">
                ${method === 'fingerprint' ? 
                  '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto text-primary"><path d="M12 14.5a2.5 2.5 0 0 1-5 0v-6a5 5 0 0 1 10 0v8.5"/><path d="M12 18.5a2.5 2.5 0 0 1-5 0"/><path d="M17 12.5a2.5 2.5 0 0 0-5 0v3"/></svg>' : 
                  method === 'face' ? 
                  '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto text-primary"><circle cx="12" cy="12" r="10"/><circle cx="9" cy="9" r="1"/><circle cx="15" cy="9" r="1"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/></svg>' : 
                  '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto text-primary"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>'
                }
              </div>
              <h3 class="text-lg font-medium">Verifying your ${method}...</h3>
              <p class="text-muted-foreground text-sm mt-2">Please hold still</p>
            </div>
          `;
          
          // Simulate authentication delay
          setTimeout(() => {
            document.body.removeChild(dialog);
            
            // 90% success rate for the simulation
            const isSuccessful = Math.random() < 0.9;
            
            if (isSuccessful) {
              resolve({
                success: true,
                authenticatedWith: method,
                timestamp: Date.now(),
                message: `Successfully authenticated with ${method}`
              });
            } else {
              const error = {
                success: false,
                timestamp: Date.now(),
                message: `Failed to authenticate with ${method}`
              };
              if (options.onError) {
                options.onError(error.message);
              }
              reject(new Error(error.message));
            }
          }, 2000);
        });
      });
    });
  }
  
  public registerBiometric(): Promise<boolean> {
    // In a real application, this would handle the enrollment/registration process
    // For this demo, we'll just simulate success
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });
  }
}

// Export as singleton instance
export const biometricService = BiometricService.getInstance();
export default biometricService;
