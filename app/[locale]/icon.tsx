import { ImageResponse } from 'next/og'

// Configuración de la imagen (Metadatos)
export const runtime = 'edge'
export const size = {
    width: 32,
    height: 32,
}
export const contentType = 'image/png'

// Generación de la imagen
export default function Icon() {
    return new ImageResponse(
        (
            // Contenedor (Círculo Púrpura)
            <div
                style={{
                    fontSize: 20,
                    background: '#9333ea', // Color purple-600 de Tailwind
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    borderRadius: '50%', // Hacemos que sea redondo
                }}
            >
                {/* SVG del icono Sparkles (Copiado de Lucide) */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                    <path d="M5 3v4" />
                    <path d="M9 5H5" />
                </svg>
            </div>
        ),
        {
            ...size,
        }
    )
}
