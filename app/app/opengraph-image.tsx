import { ImageResponse } from 'next/og'

// Configuración: WhatsApp usa 1200x630 para previsualizaciones
export const runtime = 'edge'
export const alt = 'SOS Evolution - Soul Operating System'
export const size = {
    width: 1200,
    height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            // Contenedor Fondo
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#020617', // Slate-950
                    backgroundImage: 'radial-gradient(circle at center, #1e1b4b 0%, #020617 100%)', // Degradado púrpura oscuro
                    color: 'white',
                }}
            >
                {/* Icono Central */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(147, 51, 234, 0.3)', // Purple glow
                        marginBottom: '40px',
                        border: '2px solid rgba(168, 85, 247, 0.5)',
                    }}
                >
                    {/* SVG Sparkle */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#d8b4fe" // Purple-200
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                    </svg>
                </div>

                {/* Título */}
                <div
                    style={{
                        fontSize: 70,
                        fontWeight: 900,
                        background: 'linear-gradient(to right, #c084fc, #f472b6)', // Gradient text
                        backgroundClip: 'text',
                        color: 'transparent',
                        marginBottom: '20px',
                        letterSpacing: '-2px',
                    }}
                >
                    SOS Evolution
                </div>

                {/* Subtítulo */}
                <div
                    style={{
                        fontSize: 32,
                        color: '#94a3b8', // Slate-400
                        textAlign: 'center',
                        maxWidth: '80%',
                    }}
                >
                    Soul Operating System v1.0
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}