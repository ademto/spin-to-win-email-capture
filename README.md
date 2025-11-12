# 🎡 Spin to Win - Interactive Prize Wheel

A Next.js application with a spinning wheel game that collects user emails and integrates with MailerLite.

## Features

- ✅ **Entry Form** - Collect user name and email with validation
- ✅ **Custom Spinning Wheel** - Built from scratch using HTML Canvas
- ✅ **MailerLite Integration** - Automatically subscribe users to your mailing list
- ✅ **Prize System** - Configurable prizes with weighted probabilities
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **One Spin Per Email** - Prevents multiple submissions from same email

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Styling
- **MailerLite API** - Email marketing integration

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the sample environment file:

```bash
cp .env.sample .env.local
```

Then edit `.env.local` and add your MailerLite credentials:

```env
MAILERLITE_API_KEY=your_api_key_here
MAILERLITE_GROUP_ID=your_group_id_here  # Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Getting MailerLite Credentials:

1. **API Key**: 
   - Go to https://dashboard.mailerlite.com/integrations/api
   - Generate a new API key
   
2. **Group ID** (Optional):
   - Go to your MailerLite Groups
   - Click on the group you want to add subscribers to
   - The Group ID is in the URL

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
spin-to-wheel/
├── app/
│   ├── page.tsx              # Main page with state management
│   ├── components/
│   │   ├── EntryForm.tsx     # Name/Email collection form
│   │   ├── SpinWheel.tsx     # Canvas-based spinning wheel
│   │   └── ResultModal.tsx   # Prize display modal
│   └── api/
│       └── subscribe/
│           └── route.ts      # MailerLite API integration
├── lib/
│   └── prizes.ts             # Prize configuration
└── .env.local                # Environment variables (create this)
```

## Customizing Prizes

Edit `lib/prizes.ts` to customize your prizes:

```typescript
export const prizes: Prize[] = [
  {
    id: '1',
    label: '10% OFF',
    color: '#FF6B6B',
    textColor: '#FFFFFF',
    probability: 0.3,  // 30% chance
  },
  // Add more prizes...
];
```

## How It Works

1. **User enters name and email** → Validated on frontend
2. **Form submits to `/api/subscribe`** → Adds subscriber to MailerLite
3. **If successful** → User proceeds to spin wheel
4. **Wheel spins and lands on prize** → Updates MailerLite with prize info
5. **Result modal shows** → User sees what they won

## Deployment

Deploy to Vercel (Recommended):

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## License

MIT


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
