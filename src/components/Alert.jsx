import { useEffect } from 'react'
import { cn } from '../lib/utils'

const variantStyles = {
  info: 'bg-blue-500 text-white',
  warning: 'bg-yellow-500 text-black',
  danger: 'bg-red-600 text-white',
  success: 'bg-green-500 text-white',
}

export default function Alert({
  isOpen,
  title,
  message,
  variant = 'info',
  type = 'toast',
  className = '',
  onClose, // usado solo para cerrar el toast internamente
}) {
  useEffect(() => {
    if (type === 'toast' && isOpen) {
      const timer = setTimeout(() => {
        if (onClose) onClose()
      }, 4000) // se cierra en 4 segundos
      return () => clearTimeout(timer)
    }
  }, [isOpen, type, onClose])

  if (!isOpen || type !== 'toast') return null

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 max-w-sm w-full shadow-lg rounded-lg p-4 transition-all duration-300 ease-in-out',
        variantStyles[variant],
        className
      )}
    >
      <h2 className="font-semibold text-lg mb-1">{title}</h2>
      <p className="text-sm">{message}</p>
    </div>
  )
}

// Para usar la alerta, no sé donde carajo va, jueves consulto con los muchachos
import { useState } from 'react'
import Alert from '../components/Alert'

export default function Home() {
  const [showAlert, setShowAlert] = useState(true)

  return (
    <div>
      <Alert
        isOpen={showAlert}
        type="toast"
        title="¡Eduque yo, eduque!"
        message="Este es un alert tipo toast 🎉"
        variant="success"
        onClose={() => setShowAlert(false)}
      />
    </div>
  )
}
