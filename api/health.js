// API Route - Health Check (Vercel/Cloudflare compatible)
export default function handler(req, res) {
  res.status(200).json({
    success: true,
    message: 'API OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime ? process.uptime() : 0,
    runtime: typeof EdgeRuntime !== 'undefined' ? 'edge' : 'nodejs'
  });
}
