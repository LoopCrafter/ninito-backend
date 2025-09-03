export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تأیید ایمیل شما</title>
  <link href="https://fonts.googleapis.com/css2?family=Lalezar&display=swap" rel="stylesheet">
</head>
<body style="font-family: 'Lalezar', Tahoma, sans-serif; line-height: 1.8; color: #444; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fffafc; direction: rtl; text-align: right;">
  <div style="background: linear-gradient(to right, #ffb6c1, #a2d2ff); padding: 25px; text-align: center; border-radius: 15px 15px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">تأیید ایمیل شما</h1>
  </div>
  <div style="background-color: #fefefe; padding: 25px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
    <p style="font-size: 16px;">سلام دوست عزیز،</p>
    <p style="font-size: 16px;">از اینکه به خانواده <strong style="color: #ff6f91;">نینیتو</strong> (فروشگاه محصولات و کالای خواب نوزاد) پیوستید، سپاسگزاریم. کد تأیید شما:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 34px; font-weight: bold; letter-spacing: 5px; color: #6ecb63;">{verificationCode}</span>
    </div>
    <p style="font-size: 15px;">لطفاً این کد را در صفحه تأیید وارد کنید تا ثبت‌نام شما تکمیل شود.</p>
    <p style="font-size: 15px;">این کد به دلایل امنیتی تا <strong>۱۵ دقیقه</strong> معتبر است.</p>
    <p style="font-size: 15px;">اگر شما حسابی در نینیتو ایجاد نکرده‌اید، این ایمیل را نادیده بگیرید.</p>
    <p style="margin-top: 25px; font-size: 15px;">با احترام 🌸<br>تیم نینیتو</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #aaa; font-size: 0.8em;">
    <p>این پیام به صورت خودکار ارسال شده است؛ لطفاً به آن پاسخ ندهید.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>خوش آمدید به نینیتو</title>
</head>
<body style="font-family: Tahoma, Arial, sans-serif; line-height: 1.8; color: #444; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fffafc; direction: rtl; text-align: right;">
  <div style="background: linear-gradient(to right, #ffb6c1, #a2d2ff); padding: 25px; text-align: center; border-radius: 15px 15px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 26px;">به نینیتو خوش آمدی 🌸</h1>
  </div>
  <div style="background-color: #fefefe; padding: 25px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
    <p style="font-size: 17px;">سلام <b>{username}</b> عزیز 🍼</p>
    <p style="font-size: 17px;">خیلی خوشحالیم که به خانواده <strong style="color: #ff6f91;">نینیتو</strong> پیوستی 🎉</p>
    <p style="font-size: 16px;">اینجا می‌تونی دنیایی از محصولات و کالای خواب نوزاد رو کشف کنی و تجربه‌ای شیرین‌تر برای کوچولوت بسازی 💖</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{appUrl}" style="background: #ff6f91; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">شروع کن</a>
    </div>
    <p style="font-size: 15px;">هر وقت به کمک نیاز داشتی، تیم پشتیبانی نینیتو کنارته 💌</p>
    <p style="margin-top: 25px; font-size: 15px;">با آرزوی لحظاتی شیرین 🌙<br>تیم نینیتو</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #aaa; font-size: 0.8em;">
    <p>این پیام به صورت خودکار ارسال شده است؛ لطفاً به آن پاسخ ندهید.</p>
  </div>
</body>
</html>
`;
