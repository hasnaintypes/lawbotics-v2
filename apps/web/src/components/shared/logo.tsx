import { Shield } from 'lucide-react'
import React from 'react'

export default function Logo() {
  return (
    <div className="flex items-center gap-4">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-sm">
      <Shield className="h-5 w-5 text-primary-foreground" />
    </div>
    <div className="flex flex-col">
      <span className="text-lg font-bold">LawBotics</span>
      <span className="text-xs text-muted-foreground hidden sm:block">Legal Document Analysis</span>
    </div>
  </div>
  )
}