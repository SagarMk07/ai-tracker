import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
    width: 180,
    height: 180,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #0F172A, #020617)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '40px',
                    border: '4px solid rgba(99, 102, 241, 0.2)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        fontSize: 100,
                        fontWeight: 'bold',
                        color: 'white',
                        background: 'linear-gradient(to bottom, #818CF8, #6366F1)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    A
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
