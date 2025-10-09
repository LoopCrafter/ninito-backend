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
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تغییر رمز عبور با موفقیت انجام شد</title>
</head>
<body style="font-family: Tahoma, Arial, sans-serif; line-height: 1.8; color: #444; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fffafc; direction: rtl; text-align: right;">
  <div style="background: linear-gradient(to right, #a2d2ff, #ffb6c1); padding: 25px; text-align: center; border-radius: 15px 15px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">تغییر رمز عبور با موفقیت انجام شد ✅</h1>
  </div>
  <div style="background-color: #fefefe; padding: 25px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
    <p style="font-size: 17px;">سلام <b>{username}</b> عزیز 🌼</p>
    <p style="font-size: 16px;">رمز عبور حساب کاربری‌ت در <strong style="color: #ff6f91;">نینیتو</strong> با موفقیت تغییر کرد.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #6ecb63; color: white; width: 60px; height: 60px; line-height: 60px; border-radius: 50%; display: inline-block; font-size: 32px;">
        ✓
      </div>
    </div>
    <p style="font-size: 15px;">اگر این تغییر توسط تو انجام نشده، لطفاً فوراً با تیم پشتیبانی نینیتو تماس بگیر 💌</p>
    <p style="margin-top: 25px; font-size: 15px;">با عشق 🌸<br>تیم نینیتو</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #aaa; font-size: 0.8em;">
    <p>این پیام به صورت خودکار ارسال شده است؛ لطفاً به آن پاسخ ندهید.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>بازیابی رمز عبور</title>
</head>
<body style="font-family: Tahoma, Arial, sans-serif; line-height: 1.8; color: #444; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fffafc; direction: rtl; text-align: right;">
  <div style="background: linear-gradient(to right, #ffb6c1, #a2d2ff); padding: 25px; text-align: center; border-radius: 15px 15px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">درخواست بازیابی رمز عبور 🔐</h1>
  </div>
  <div style="background-color: #fefefe; padding: 25px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
    <p style="font-size: 17px;">سلام <b>{username}</b> عزیز 🌸</p>
    <p style="font-size: 16px;">درخواست بازیابی رمز عبور برای حساب کاربری‌ت در <strong style="color: #ff6f91;">نینیتو</strong> ثبت شده است.</p>
    <p style="font-size: 16px;">اگر این درخواست از سمت تو نبوده، می‌تونی این ایمیل رو نادیده بگیری.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background: #ff6f91; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">بازیابی رمز عبور</a>
    </div>
    <p style="font-size: 15px;">این لینک تا <strong>۱ ساعت</strong> آینده معتبر است.</p>
    <p style="margin-top: 25px; font-size: 15px;">با آرزوی امنیت و آرامش 🌙<br>تیم نینیتو</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #aaa; font-size: 0.8em;">
    <p>این پیام به صورت خودکار ارسال شده است؛ لطفاً به آن پاسخ ندهید.</p>
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
