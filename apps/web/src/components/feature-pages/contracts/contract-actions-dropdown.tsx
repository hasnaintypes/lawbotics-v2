"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ContractDeleteDialog } from "./contract-delete-dialog";
import { usePdfGeneration } from "@/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ContractActionsDropdownProps {
  /** Contract data from Convex */
  contract: any;
}

/**
 * Dropdown menu component for contract actions with PDF generation using Sonner
 * @param {ContractActionsDropdownProps} props - Dropdown properties
 * @returns {JSX.Element} Actions dropdown menu
 */
export function ContractActionsDropdown({
  contract,
}: ContractActionsDropdownProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  /**
   * Handles contract view navigation
   */
  const handleView = () => {
    router.push(`/contracts/${contract._id}`);
  };

  /**
   * Handles contract edit navigation
   */
  const handleEdit = () => {
    router.push(`/contracts/${contract._id}/edit`);
  };



  /**
   * Opens delete confirmation dialog
   */
  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-xl">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open contract actions menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 rounded-xl">
          <DropdownMenuItem onClick={handleView} className="gap-2 rounded-lg">
            <Eye className="h-4 w-4" />
            View Contract
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit} className="gap-2 rounded-lg">
            <Edit className="h-4 w-4" />
            Edit Contract
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleDelete}
            className="gap-2 text-destructive focus:text-destructive rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
            Delete Contract
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ContractDeleteDialog
        contract={contract}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}
