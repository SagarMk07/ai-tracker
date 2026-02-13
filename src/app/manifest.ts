import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Focus Guardian AI',
        short_name: 'Focus',
        description: 'Command Center for the Soul. Align intention with action.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0B1220',
        theme_color: '#0B1220',
        icons: [
            {
                src: '/icon',
                sizes: 'any',
                type: 'image/png',
            },
            {
                src: '/apple-icon',
                sizes: 'any',
                type: 'image/png',
            },
        ],
    };
}
