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
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: '20px',
                    }}
                >
                    {/* Logo Container - Matching Navbar Design */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            background: 'linear-gradient(to top right, #9333ea, #4f46e5)', // from-purple-600 to-indigo-600
                            boxShadow: '0 0 50px rgba(88, 28, 135, 0.4)', // shadow-purple-900/20 approx
                            marginBottom: '40px',
                        }}
                    >
                        {/* Sparkles Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="80"
                            height="80"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
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
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <div
                            style={{
                                fontSize: 80,
                                fontWeight: 900,
                                fontFamily: 'serif',
                                color: 'white',
                                lineHeight: 1,
                                marginBottom: '10px',
                                letterSpacing: '2px',
                            }}
                        >
                            SOS
                        </div>
                        <div
                            style={{
                                fontSize: 24,
                                color: '#d8b4fe', // purple-300
                                textTransform: 'uppercase',
                                letterSpacing: '8px',
                                fontWeight: 600,
                            }}
                        >
                            Evolution
                        </div>
                    </div>
                </div>

                {/* Subtítulo descriptivo */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '60px',
                        fontSize: 32,
                        color: '#94a3b8', // Slate-400
                        textAlign: 'center',
                        maxWidth: '80%',
                    }}
                >
                    Descubre tu mapa evolutivo con Tarot e Inteligencia Artificial
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
