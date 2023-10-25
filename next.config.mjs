// await import('./src/env.mjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
    // reactStrictMode: true,
    images: {
        domains: ['api.dicebear.com', 'res.cloudinary.com'],
    },
};

export default nextConfig;
