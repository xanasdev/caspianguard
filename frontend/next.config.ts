import type {NextConfig} from 'next'

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? ''
const isLocalMedia = apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1')

const nextConfig: NextConfig = {
	reactCompiler: true,
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '8000',
				pathname: '/media/**',
			},
		],
		unoptimized: isLocalMedia,
	},
}

export default nextConfig
