"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useContracts } from "@/hooks"
import { toast } from "sonner"

interface ContractDeleteDialogProps {
  /** Contract to delete */
  contract: any
  /** Dialog open state */
  open: boolean
  /** Dialog open state change handler */
  onOpenChange: (open: boolean) => void
}

/**
 * Confirmation dialog for contract deletion with Sonner notifications
 * Requires user to type contract name for confirmation
 * @param {ContractDeleteDialogProps} props - Dialog properties
 * @returns {JSX.Element} Delete confirmation dialog
 */
export function ContractDeleteDialog({ contract, open, onOpenChange }: ContractDeleteDialogProps) {
  const [confirmationText, setConfirmationText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const { deleteContract } = useContracts()

  const isConfirmationValid = confirmationText === contract.name

  /**
   * Handles contract deletion with proper error handling and notifications
   */
  const handleDelete = async () => {
    if (!isConfirmationValid) return

    setIsDeleting(true)

    // Show loading toast
    const loadingToast = toast.loading("Deleting Contract...", {
      description: `Removing "${contract.name}" from the system.`,
    })

    try {
      const success = await deleteContract(contract._id)

      // Dismiss loading toast
      toast.dismiss(loadingToast)

      if (success) {
        toast.success("Contract Deleted Successfully", {
          description: `"${contract.name}" has been permanently removed.`,
          duration: 4000,
        })

        // Close dialog and reset form
        onOpenChange(false)
        setConfirmationText("")
      } else {
        toast.error("Deletion Failed", {
          description: "Failed to delete the contract. Please try again.",
          duration: 5000,
        })
      }
    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToast)

      toast.error("Deletion Error", {
        description: "An unexpected error occurred while deleting the contract.",
        duration: 5000,
      })
    } finally {
      setIsDeleting(false)
    }
  }

  /**
   * Handles dialog close and resets form
   */
  const handleCancel = () => {
    onOpenChange(false)
    setConfirmationText("")
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Contract</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              This action cannot be undone. This will permanently delete the contract
              <span className="font-semibold"> "{contract.name}"</span> and remove all associated data including:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>Contract content and clauses</li>
              <li>Party information and signatures</li>
              <li>Version history and revisions</li>
              <li>Attachments and related files</li>
            </ul>
            <div className="space-y-2 pt-2">
              <Label htmlFor="confirmation">
                Type <span className="font-semibold">{contract.name}</span> to confirm:
              </Label>
              <Input
                id="confirmation"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="Enter contract name exactly"
                className="rounded-xl"
                disabled={isDeleting}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isDeleting} className="rounded-xl">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={!isConfirmationValid || isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
          >
            {isDeleting ? "Deleting..." : "Delete Contract"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
