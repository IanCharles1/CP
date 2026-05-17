# CHARMU PRIME VENTURES — DEPLOYMENT & SETUP GUIDE
## Complete instructions for launching your website

---

## 📁 FILE STRUCTURE

```
charmu-prime/
├── index.html          ← Main website (all pages as sections)
├── css/
│   └── style.css       ← All styles, fully responsive
├── js/
│   └── main.js         ← Animations, slider, form logic
├── server.js           ← Node.js contact form backend
├── package.json        ← Node.js dependencies
├── .env.example        ← Environment variables template
└── DEPLOYMENT.md       ← This file
```

---

## 🌐 OPTION 1: STATIC HOSTING (Recommended for starters)
### Deploy on Netlify (Free – no backend needed initially)

1. Go to https://netlify.com and sign up free
2. Drag & drop your `charmu-prime` folder onto the dashboard
3. Your site is live in ~30 seconds at a random URL
4. Add a custom domain in Site Settings → Domain Management
5. Netlify auto-provisions FREE SSL (HTTPS)

**For the contact form on Netlify:**
- Sign up for Formspree (https://formspree.io) — free tier handles 50 submissions/month
- Change your form's action attribute:
  ```html
  <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  ```
- Or use Netlify Forms: add `netlify` attribute to your form tag


---

## 🚀 OPTION 2: VPS HOSTING (Full control + backend)
### Deploy on DigitalOcean / Hostinger / Contabo

### Step 1: Get a server
- DigitalOcean Droplet (Ubuntu 22.04, 1GB RAM): ~$6/month
- Contabo VPS: ~$4/month (great value)
- Hostinger KVM 2 VPS: ~$7/month

### Step 2: Connect to your server
```bash
ssh root@YOUR_SERVER_IP
```

### Step 3: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # Should show v20+
```

### Step 4: Install Nginx (web server)
```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 5: Upload your files
```bash
# On your local machine:
scp -r ./charmu-prime root@YOUR_SERVER_IP:/var/www/charmu-prime
```

### Step 6: Install dependencies and start backend
```bash
cd /var/www/charmu-prime
npm install
cp .env.example .env
nano .env   # Fill in your actual credentials
```

### Step 7: Run with PM2 (keeps server alive)
```bash
npm install -g pm2
pm2 start server.js --name "charmu-prime"
pm2 startup    # Auto-restart on reboot
pm2 save
```

### Step 8: Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/charmuprimeventures
```

Paste this:
```nginx
server {
    listen 80;
    server_name charmuprimeventures.co.ke www.charmuprimeventures.co.ke;

    location / {
        root /var/www/charmu-prime;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/charmuprimeventures /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 9: Free SSL with Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d charmuprimeventures.co.ke -d www.charmuprimeventures.co.ke
# Auto-renew is set up automatically
```

---

## 🔗 DOMAIN SETUP

### Recommended Domain Options (in order):
1. `charmuprimeventures.co.ke` — **Best** (local, professional, ~KES 1,200/year)
2. `charmuprimeventures.com`   — Global appeal (~$12/year)
3. `charmu-prime.com`          — Clean alternative
4. `charmuprimetech.com`       — Emphasizes tech
5. `charmuprime.co.ke`         — Shorter version

### Register at:
- **Kenya .co.ke domains**: KENIC (https://kenic.or.ke) or Safaricom Business
- **International .com**: Namecheap (https://namecheap.com) — cheapest
- **Both**: Cloudflare Registrar (at-cost pricing, free DNS)

### DNS Records to add after registration:
```
Type  Name    Value              TTL
A     @       YOUR_SERVER_IP     300
A     www     YOUR_SERVER_IP     300
CNAME mail    ghs.google.com     300  (if using Google Workspace)
MX    @       aspmx.l.google.com 300  (priority: 1)
```

---

## 📧 BUSINESS EMAIL SETUP

### Option A: Google Workspace (Best — KES 1,200/user/month)
- Professional email: info@charmuprimeventures.co.ke
- Full Google Suite (Drive, Docs, Meet, Calendar)
- Setup: https://workspace.google.com
- Connect your domain via DNS MX records (Google guides you step by step)

### Option B: Zoho Mail (Free for up to 5 users!)
- Go to https://zoho.com/mail
- Free plan: 5 users, 5GB each
- Professional email on your domain
- Great for starting out

### Option C: Keep Gmail (Interim — Free)
- Use charmuprimeventures@gmail.com as-is
- Add a "Send as" alias from another account
- Upgrade when ready for domain email

### Setting up Gmail App Password (for the contact form backend):
1. Go to https://myaccount.google.com
2. Security → 2-Step Verification (enable it)
3. Security → App passwords
4. Generate password for "Mail" + "Other (charmu-prime-website)"
5. Copy the 16-character password into your .env file as EMAIL_PASS
⚠️ Never use your actual Gmail password — always use App Passwords

---

## 📱 CONTACT FORM — WIRE UP TO BACKEND

Update `js/main.js` — replace the `simulateSubmit()` function with:

```javascript
async function handleFormSubmit(formData) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
  return result;
}
```

Then in the submit event handler, replace the simulate call with:
```javascript
await handleFormSubmit({
  fname: contactForm.querySelector('#fname').value,
  lname: contactForm.querySelector('#lname').value,
  email: contactForm.querySelector('#email').value,
  phone: contactForm.querySelector('#phone').value,
  service: contactForm.querySelector('#service').value,
  message: contactForm.querySelector('#message').value,
});
```

---

## 📈 FUTURE SCALING ROADMAP

### Phase 1 (Now → 3 months)
- ✅ Launch with current website
- Add Google Analytics 4 (free traffic tracking)
- Add a blog section (establish thought leadership)
- Install a live chat widget (Tawk.to — free)

### Phase 2 (3–6 months)
- Build a client portal (project status, invoices, file sharing)
- Add WhatsApp Business API automation
- Implement a booking system for consultations (Calendly embed)
- Add case studies with real metrics from clients

### Phase 3 (6–12 months)
- Launch e-commerce for hardware sales
- Add a knowledge base / help center
- Implement CRM integration (HubSpot free tier)
- Multilingual support (Swahili)

### Tech Stack to Add:
- **CMS**: Sanity or Strapi (for blog/portfolio updates without coding)
- **Analytics**: Google Analytics 4 + Microsoft Clarity (heatmaps)
- **CRM**: HubSpot (free), Zoho CRM
- **Booking**: Calendly (free tier)
- **Live Chat**: Tawk.to (free forever)
- **Reviews**: Google Business Profile (free)

---

## 🔒 SECURITY CHECKLIST

- [ ] SSL certificate active (HTTPS green lock)
- [ ] .env file not in git (add to .gitignore)
- [ ] Gmail App Password used (not account password)
- [ ] Rate limit contact form (prevent spam)
- [ ] Nginx firewall rules set (ufw allow 80, 443, 22)
- [ ] Regular backups configured
- [ ] Admin panel (if added later) behind strong password

---

## 🎯 SEO QUICK WINS

1. Submit to Google Search Console: https://search.google.com/search-console
2. Create Google Business Profile: https://business.google.com
3. Submit sitemap.xml (create with https://www.xml-sitemaps.com)
4. List on Ajira Digital, Kenya IT directory, LinkedIn Company Page
5. Get 10+ Google reviews from your first clients

---

## 📞 SUPPORT

**Phone/WhatsApp:** +254 728 427 203
**Email:** charmuprimeventures@gmail.com

---

*Charmu Prime Ventures — Engineered with precision in Nairobi 🇰🇪*
