/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A8A', // Action principale
          hover: '#1D4ED8',   // Interaction
        },
        customBg: '#F9FAFB', // Fond global
        surface: '#FFFFFF',  // Cartes / blocs
        success: '#16A34A',  // Paiement validé
        danger: '#DC2626',   // Erreur / refus
        warning: '#F59E0B',  // Attention
        info: '#2563EB',     // Information
        textPrimary: '#111827',
        textSecondary: '#6B7280',
        borderColor: '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'custom': '6px', // 6px maximum
      },
      spacing: {
        'micro': '4px',
        'standard': '8px',
        'block': '16px',
        'section': '24px',
        'large': '32px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
