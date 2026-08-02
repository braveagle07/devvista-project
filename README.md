# devvista-project
# DevVista -portfolio generator

A professional portfolio builder web app — pick a template, fill in your details, and download your portfolio in minutes. Deployed on AWS using a fully serverless architecture.

**Live:** http://devvista-app.s3-website-us-east-1.amazonaws.com

---

## What it does

- Choose from 3 portfolio templates — **Nexus**, **Forge**, **Prism**
- Sign up and log in securely
- Fill in your details through a guided wizard
- Download your portfolio as a ready-to-use HTML file

---

## AWS Services Used

| Service | Role |
|---------|------|
| **S3** | Hosts all frontend files (HTML, CSS, JS, images) |
| **API Gateway** | REST API — `/auth/signup` and `/auth/login` |
| **Lambda** | Serverless backend — handles auth logic in Node.js |
| **DynamoDB** | Stores user accounts (email, name, hashed password) |

---

## Tech Stack

- **Frontend** — HTML, CSS, JavaScript (no framework)
- **Backend** — Node.js 24.x on AWS Lambda
- **Database** — DynamoDB (NoSQL)
- **Auth** — bcryptjs password hashing
- **Hosting** — AWS S3 static website

---

## Project Structure

```
devvista/
├── index.html          # Main landing page
├── login.html          # Signup / Login page
├── script.js           # Wizard logic + template generation
├── style.css           # All styling
├── logo.jpg            # Brand logo
├── t1_thumb.png        # Nexus template preview
├── t2_thumb.png        # Forge template preview
├── t3_thumb.png        # Prism template preview
├── t1/index.html       # Nexus template
├── t2/index.html       # Forge template
├── t3/index.html       # Prism template
└── lambda/
    ├── index.mjs       # Lambda function (auth logic)
    ├── package.json
    └── node_modules/
        └── bcryptjs/
```

---

## How It Works

```
User visits site (S3)
       ↓
Fills signup / login form
       ↓
fetch() → API Gateway
       ↓
Lambda (Node.js) processes request
       ↓
DynamoDB stores / verifies user
       ↓
Session saved → Wizard opens
       ↓
User builds and downloads portfolio
```

---

## Run Locally

Just open `index.html` in your browser — no server needed for the frontend.

For auth to work locally, update the `API_URL` in `login.html`:

```js
const API_URL = 'YOUR_API_GATEWAY_URL';
```

---

## Deploy to AWS

1. Create S3 bucket → enable static website hosting → upload all files
2. Create DynamoDB table `devvista-users` (partition key: `email`)
3. Package and deploy Lambda (`index.mjs` + `bcryptjs`)
4. Create API Gateway REST API → connect to Lambda
5. Update `API_URL` in `login.html` with your invoke URL
6. Re-upload `login.html` to S3

---

## Made by

**Vasanth Sesetti** and team — B.Tech CSE

- GitHub: [github.com/vasanth-sessetti](https://github.com/vasanth-sessetti)

---

> Built as part of AWS Cloud Deployment coursework · 2026
> mail me for any queries -vasanthsessetti@gmail.com
will update the project with more templates..
> uploaded document about our project details
