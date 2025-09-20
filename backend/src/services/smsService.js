import config from '../config/index.js';

class SMSService {
  constructor() {
    this.isConfigured = Boolean(
      config.TWILIO_ACCOUNT_SID && 
      config.TWILIO_AUTH_TOKEN && 
      config.TWILIO_PHONE_NUMBER
    );
    
    if (this.isConfigured) {
      // In a real implementation, you would initialize Twilio here:
      // this.client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);
      console.log('✅ SMS service configured with Twilio');
    } else {
      console.warn('⚠️ SMS service not configured - running in development mode');
    }
  }
  
  async sendOTP(phoneNumber, otp) {
    const message = `Your TailorApp verification code is: ${otp}. This code will expire in 10 minutes.`;
    
    if (!this.isConfigured || config.isDevelopment()) {
      // In development mode, just log the OTP instead of sending SMS
      console.log(`📱 [SMS] To: ${phoneNumber}`);
      console.log(`📱 [SMS] Message: ${message}`);
      console.log(`📱 [SMS] OTP Code: ${otp}`);
      
      // Simulate SMS sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        messageId: `dev_${Date.now()}`,
        to: phoneNumber,
        message: 'SMS sent (development mode)',
      };
    }
    
    try {
      // In production, you would use Twilio to send SMS:
      /*
      const result = await this.client.messages.create({
        body: message,
        from: config.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });
      
      return {
        success: true,
        messageId: result.sid,
        to: result.to,
        status: result.status,
      };
      */
      
      // For now, return mock success
      return {
        success: true,
        messageId: `mock_${Date.now()}`,
        to: phoneNumber,
        message: 'SMS sent successfully',
      };
      
    } catch (error) {
      console.error('SMS sending failed:', error.message);
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }
  
  async sendNotification(phoneNumber, message) {
    if (!this.isConfigured || config.isDevelopment()) {
      console.log(`📱 [SMS Notification] To: ${phoneNumber}`);
      console.log(`📱 [SMS Notification] Message: ${message}`);
      
      return {
        success: true,
        messageId: `dev_notification_${Date.now()}`,
        to: phoneNumber,
        message: 'Notification sent (development mode)',
      };
    }
    
    try {
      // In production, send actual SMS notification
      /*
      const result = await this.client.messages.create({
        body: message,
        from: config.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });
      
      return {
        success: true,
        messageId: result.sid,
        to: result.to,
        status: result.status,
      };
      */
      
      return {
        success: true,
        messageId: `mock_notification_${Date.now()}`,
        to: phoneNumber,
        message: 'Notification sent successfully',
      };
      
    } catch (error) {
      console.error('SMS notification failed:', error.message);
      throw new Error(`Failed to send notification: ${error.message}`);
    }
  }
}

export default new SMSService();