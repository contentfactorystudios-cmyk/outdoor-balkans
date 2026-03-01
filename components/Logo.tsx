export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Kompas krug */}
      <circle cx="18" cy="18" r="17" stroke="#2d6a2d" strokeWidth="2" fill="#f4f0e6"/>
      {/* Kompas igle */}
      <polygon points="18,4 21,18 18,22 15,18" fill="#2d6a2d"/>
      <polygon points="18,32 15,18 18,14 21,18" fill="#8b4513"/>
      {/* Centar */}
      <circle cx="18" cy="18" r="2.5" fill="#0e1a0e"/>
      {/* N S oznake */}
      <text x="18" y="12" textAnchor="middle" fontSize="4" fill="#2d6a2d" fontWeight="bold">N</text>
      <text x="18" y="30" textAnchor="middle" fontSize="4" fill="#8b4513" fontWeight="bold">S</text>
    </svg>
  )
}
