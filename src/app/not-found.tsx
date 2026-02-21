import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export const runtime = 'edge'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <h2 className="text-6xl font-black italic mb-4">404</h2>
      <p className="text-2xl font-bold opacity-60 mb-8 italic">Waduh, halamannya ilang di telan bumi... 🌍🌀</p>
      <Link href="/">
        <Button variant="primary" className="px-8 py-4">Balik ke Home</Button>
      </Link>
    </div>
  )
}
