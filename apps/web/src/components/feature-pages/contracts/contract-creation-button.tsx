"use client"

import { Button } from "@/components/ui/button"
import { FileEdit } from "lucide-react"
import { useRouter } from "next/navigation"

/**
 * Button component for creating new contracts
 * @returns {JSX.Element} Contract creation button
 */
export function ContractCreationButton() {
  const router = useRouter()

  /**
   * Handles navigation to contract creation page
   */
  const handleCreateContract = () => {
    router.push("/contracts/create")
  }

  return (
    <Button onClick={handleCreateContract} className="gap-2 rounded-xl">
      <FileEdit className="h-4 w-4" />
      Create Custom Contract
    </Button>
  )
}
