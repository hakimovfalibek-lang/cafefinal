/**
 * SMS Service — Provider abstraction for OTP delivery
 * 
 * Supports multiple providers:
 * - Eskiz (Uzbekistan SMS provider) — default for production
 * - Development/Test mode — logs OTP instead of sending
 * 
 * Configure via environment variables:
 * SMS_PROVIDER=eskiz|dev
 * ESKIZ_EMAIL=your@email.com
 * ESKIZ_PASSWORD=your_password
 */

interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

interface SMSProvider {
  send(phone: string, message: string): Promise<SMSResult>;
}

// ============================================================
// ESKIZ PROVIDER (Uzbekistan)
// ============================================================

class EskizProvider implements SMSProvider {
  private email: string;
  private password: string;
  private token: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.email = process.env.ESKIZ_EMAIL || '';
    this.password = process.env.ESKIZ_PASSWORD || '';
  }

  private async authenticate(): Promise<string> {
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    const response = await fetch('https://notify.eskiz.uz/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: this.email,
        password: this.password
      })
    });

    if (!response.ok) {
      throw new Error('Eskiz authentication failed');
    }

    const data = await response.json() as any;
    this.token = data.data?.token;
    this.tokenExpiry = Date.now() + 23 * 60 * 60 * 1000; // Refresh before 24h expiry
    
    if (!this.token) {
      throw new Error('Eskiz token not received');
    }

    return this.token;
  }

  async send(phone: string, message: string): Promise<SMSResult> {
    try {
      const token = await this.authenticate();

      // Eskiz expects phone without +998
      const phoneNumber = phone.replace('+998', '');

      const response = await fetch('https://notify.eskiz.uz/api/message/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mobile_phone: phoneNumber,
          message: message,
          from: 'CaféPass',
          callback_url: process.env.ESKIZ_CALLBACK_URL
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Eskiz send error:', errorData);
        return { success: false, error: 'SMS yuborishda xatolik' };
      }

      const data = await response.json() as any;
      return { success: true, messageId: data.id?.toString() };
    } catch (error) {
      console.error('Eskiz provider error:', error);
      return { success: false, error: 'SMS provayder xatoligi' };
    }
  }
}

// ============================================================
// DEVELOPMENT PROVIDER (logs instead of sending)
// ============================================================

class DevProvider implements SMSProvider {
  async send(phone: string, message: string): Promise<SMSResult> {
    console.log('═══════════════════════════════════════');
    console.log('📱 SMS (Development Mode)');
    console.log(`   To: ${phone}`);
    console.log(`   Message: ${message}`);
    console.log('═══════════════════════════════════════');
    return { success: true, messageId: `dev-${Date.now()}` };
  }
}

// ============================================================
// PROVIDER SELECTION
// ============================================================

function getProvider(): SMSProvider {
  const providerName = process.env.SMS_PROVIDER || 'dev';
  
  switch (providerName) {
    case 'eskiz':
      return new EskizProvider();
    case 'dev':
    default:
      return new DevProvider();
  }
}

// ============================================================
// PUBLIC API
// ============================================================

/**
 * Generate a 4-digit OTP code
 */
export function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// verifyOTPCode removed - now using bcrypt.compare directly in auth routes

/**
 * Send OTP via SMS
 */
export async function sendOTP(phone: string, code: string): Promise<SMSResult> {
  const provider = getProvider();
  const message = `CaféPass tasdiqlash kodi: ${code}. Kodni hech kimga bermang. ${5} daqiqada amal qilish muddati tugaydi.`;
  return provider.send(phone, message);
}
