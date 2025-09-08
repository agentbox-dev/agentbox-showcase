/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lovable.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.perplexity.ai',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'huggingface.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'groq.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lindy.ai',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'manus.ai',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'openai.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
