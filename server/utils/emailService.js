const nodemailer = require('nodemailer');

// Set up transporter. Fallback to mock jsonTransport if no SMTP settings are provided.
const getTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Development fallback using Ethereal or logging
    console.log('Using JSON transporter for emails (no SMTP settings in .env)');
    return nodemailer.createTransport({
      jsonTransport: true
    });
  }
};

const BRAND_COLOR = '#D1AFA1';
const TEXT_COLOR = '#1a1a1a';
const BG_COLOR = '#f9f5f3';

const wrapTemplate = (content) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body {
        font-family: 'Raleway', 'Jost', sans-serif;
        background-color: ${BG_COLOR};
        color: ${TEXT_COLOR};
        margin: 0;
        padding: 40px 15px;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border: 1px solid #e8e0db;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.03);
      }
      .header {
        background-color: ${BRAND_COLOR};
        padding: 40px 20px;
        text-align: center;
      }
      .header h1 {
        font-family: 'Cormorant Garamond', 'Playfair Display', serif;
        color: #ffffff;
        margin: 0;
        font-size: 28px;
        font-weight: 300;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }
      .body {
        padding: 40px 30px;
        line-height: 1.6;
        font-size: 15px;
      }
      .footer {
        background-color: #fcf9f7;
        border-top: 1px solid #e8e0db;
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #888888;
      }
      .button {
        display: inline-block;
        background-color: #1a1a1a;
        color: #ffffff !important;
        text-decoration: none;
        padding: 12px 30px;
        border-radius: 4px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin: 20px 0;
        font-size: 13px;
        text-align: center;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      .table th {
        border-bottom: 2px solid #e8e0db;
        text-align: left;
        padding: 10px 5px;
        font-weight: 600;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .table td {
        border-bottom: 1px solid #e8e0db;
        padding: 12px 5px;
        font-size: 14px;
      }
      .totals {
        text-align: right;
        margin-top: 20px;
        font-size: 14px;
      }
      .totals p {
        margin: 5px 0;
      }
      .totals .grand-total {
        font-size: 18px;
        font-weight: bold;
        color: ${BRAND_COLOR};
        border-top: 1px solid #e8e0db;
        padding-top: 5px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>rose & ivy</h1>
      </div>
      <div class="body">
        ${content}
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} rose & ivy Floral Boutique. All rights reserved.</p>
        <p>Dubai, United Arab Emirates | www.roseivy.com</p>
      </div>
    </div>
  </body>
  </html>
`;

/**
 * Sends an email using the configured Nodemailer transporter
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = getTransporter();
    const mailOptions = {
      from: process.env.SMTP_FROM || '"rose & ivy" <info@roseivy.com>',
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    
    // Log info if jsonTransport is used, so developers can inspect the output
    if (info.message) {
      console.log('--- Email Dispatched (JSON Mock) ---');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      // parse email structure for debugging
      const parsed = JSON.parse(info.message);
      console.log('Content Summary: Sent successfully!');
      console.log('------------------------------------');
    } else {
      console.log(`Email sent: ${info.messageId}`);
    }
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// 1. Welcome Email
const sendWelcomeEmail = async (user) => {
  const content = `
    <p>Dear ${user.name},</p>
    <p>Welcome to <strong>rose & ivy</strong>, where botanical artistry meets modern luxury.</p>
    <p>We are delighted to have you join our exclusive circle of floral enthusiasts. Our boutique offers natural, bio-preserved flowers designed to last up to a full year, retaining their soft petals and vibrant colors without any watering or maintenance.</p>
    <p>As a member, you can now enjoy faster checkouts, save your favorite arrangements to your wishlist, and track your orders in real time.</p>
    <div style="text-align: center;">
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/products" class="button">Explore Collection</a>
    </div>
    <p>With warm regards,<br>The rose & ivy Team</p>
  `;
  return sendEmail({
    to: user.email,
    subject: 'Welcome to rose & ivy Boutique',
    html: wrapTemplate(content)
  });
};

// 2. Password Reset Email
const sendPasswordResetEmail = async (email, resetUrl) => {
  const content = `
    <p>Hello,</p>
    <p>We received a request to reset the password for your rose & ivy account. Please click the button below to choose a new password. This link is valid for the next 1 hour.</p>
    <div style="text-align: center;">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </div>
    <p>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
    <p>Best regards,<br>rose & ivy Support</p>
  `;
  return sendEmail({
    to: email,
    subject: 'Reset Password Request - rose & ivy',
    html: wrapTemplate(content)
  });
};

// 3. Bespoke Enquiry Acknowledgement
const sendBespokeAcknowledgement = async (enquiry) => {
  const content = `
    <p>Dear ${enquiry.name},</p>
    <p>Thank you for contacting rose & ivy with your bespoke floral design request.</p>
    <p>Our floral designers specialize in crafting tailor-made arrangements for homes, offices, private yachts, aviation, and special events. We have received your details and are already reviewing your specifications.</p>
    <h3>Enquiry Details:</h3>
    <table class="table" style="max-width: 100%;">
      <tr>
        <td style="font-weight:600; width:150px;">Occasion / Type:</td>
        <td>${enquiry.occasion || 'Custom Arrangement'}</td>
      </tr>
      <tr>
        <td style="font-weight:600;">Colors:</td>
        <td>${enquiry.colorPreferences || 'Open'}</td>
      </tr>
      <tr>
        <td style="font-weight:600;">Budget:</td>
        <td>${enquiry.budgetRange || 'Flexible'}</td>
      </tr>
      <tr>
        <td style="font-weight:600;">Message:</td>
        <td>${enquiry.message || 'No additional message'}</td>
      </tr>
    </table>
    <p>An expert designer will reach out to you within the next 24 to 48 hours to discuss details and provide a formal proposal.</p>
    <p>Sincerely yours,<br>rose & ivy Bespoke Team</p>
  `;
  return sendEmail({
    to: enquiry.email,
    subject: 'We have received your Bespoke Floral request',
    html: wrapTemplate(content)
  });
};

// 4. Gift Card Delivery Email
const sendGiftCardEmail = async (giftCard) => {
  const content = `
    <p>Dear ${giftCard.recipientName},</p>
    <p>Someone special has sent you a digital gift card for <strong>rose & ivy</strong>!</p>
    <div style="background-color: ${BG_COLOR}; border: 1px dashed ${BRAND_COLOR}; padding: 30px; text-align: center; border-radius: 6px; margin: 30px 0;">
      <h2 style="font-family: Cormorant Garamond, serif; margin: 0; font-size: 26px; color: ${BRAND_COLOR};">GIFT CARD</h2>
      <p style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #555; margin-top: 5px;">Boutique Code</p>
      <h1 style="font-family: monospace; letter-spacing: 2px; margin: 15px 0 25px 0; font-size: 32px; color: ${TEXT_COLOR};">${giftCard.code}</h1>
      <p style="font-size: 20px; font-weight: bold; margin: 0;">Value: AED ${giftCard.amount}</p>
    </div>
    ${giftCard.message ? `<p style="font-style: italic; background-color: #fafafa; border-left: 3px solid ${BRAND_COLOR}; padding: 15px; margin: 20px 0;">"${giftCard.message}"</p>` : ''}
    <p>To redeem this card, enter the code above at checkout when purchasing any of our preserved floral creations or signature rose boxes.</p>
    <div style="text-align: center;">
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/products" class="button">Redeem Now</a>
    </div>
    <p>Enjoy your gift!<br>The rose & ivy Team</p>
  `;
  return sendEmail({
    to: giftCard.recipientEmail,
    subject: `You received a rose & ivy AED ${giftCard.amount} Gift Card!`,
    html: wrapTemplate(content)
  });
};

// 5. Order Confirmation Email
const sendOrderConfirmationEmail = async (order, email) => {
  const itemsRows = order.items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td style="text-align: right;">AED ${item.price.toFixed(2)}</td>
      <td style="text-align: right;">AED ${(item.quantity * item.price).toFixed(2)}</td>
    </tr>
  `).join('');

  const subtotal = order.total - order.deliveryFee + order.discountAmount;

  const content = `
    <p>Thank you for shopping with us! We have received your order and are currently preparing it with the utmost care.</p>
    <h3>Order Reference: #${order._id}</h3>
    <table class="table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th style="text-align: right;">Price</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>
    
    <div class="totals">
      <p>Subtotal: <strong>AED ${subtotal.toFixed(2)}</strong></p>
      ${order.discountAmount > 0 ? `<p>Discount (${order.discountCode}): <strong style="color: #e74c3c;">-AED ${order.discountAmount.toFixed(2)}</strong></p>` : ''}
      <p>Delivery Fee: <strong>AED ${order.deliveryFee.toFixed(2)}</strong></p>
      <p class="grand-total">Total: AED ${order.total.toFixed(2)}</p>
    </div>

    <h3>Shipping Address:</h3>
    <p>
      ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
      ${order.shippingAddress.addressLine1}<br>
      ${order.shippingAddress.addressLine2 ? `${order.shippingAddress.addressLine2}<br>` : ''}
      ${order.shippingAddress.city}, ${order.shippingAddress.country}<br>
      Phone: ${order.shippingAddress.phone}
    </p>

    <div style="text-align: center;">
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/account/orders" class="button">Track Your Order</a>
    </div>
  `;
  return sendEmail({
    to: email,
    subject: `Order Confirmation #${order._id} - rose & ivy`,
    html: wrapTemplate(content)
  });
};

// 6. Shipping Notification Email
const sendShippingNotificationEmail = async (order, email, trackingNumber = 'RI-DXB-9874') => {
  const content = `
    <p>Great news! Your luxury arrangement has been prepared, inspected, and is now on its way to your destination.</p>
    <h3>Order Reference: #${order._id}</h3>
    <p>Your order is dispatched with our specialized courier. Because we ship bio-preserved flowers, the transit is temperature-controlled to ensure they arrive in pristine condition.</p>
    <div style="background-color: ${BG_COLOR}; padding: 20px; border-radius: 4px; margin: 25px 0;">
      <p style="margin: 0; font-size: 14px;"><strong>Courier Partner:</strong> Fetchr / Local Delivery Express</p>
      <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Tracking ID:</strong> <span style="font-family: monospace; font-size: 15px; font-weight: bold;">${trackingNumber}</span></p>
    </div>
    <p>Please ensure someone is available at the destination address to receive the delivery.</p>
    <div style="text-align: center;">
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/account/orders" class="button">Track Delivery</a>
    </div>
    <p>Thank you for choosing rose & ivy.</p>
  `;
  return sendEmail({
    to: email,
    subject: `Your rose & ivy order #${order._id} has shipped!`,
    html: wrapTemplate(content)
  });
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendBespokeAcknowledgement,
  sendGiftCardEmail,
  sendOrderConfirmationEmail,
  sendShippingNotificationEmail
};
