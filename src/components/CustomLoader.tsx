import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CustomLoaderProps {
  message?: string
  className?: string
}

export default function CustomLoader({ message = 'Loading ...', className }: CustomLoaderProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 p-6', className)}>
      <Loader2 className="w-10 h-10 animate-spin text-green-600" />
      <p className="text-green-700 font-medium">{message}</p>
    </div>
  )
}
