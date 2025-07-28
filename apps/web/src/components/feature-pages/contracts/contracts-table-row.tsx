"use client"

import { Badge } from "@/components/ui/badge"
import { ContractActionsDropdown } from "./contract-actions-dropdown"
import { formatDate , getStatusVariant, getStatusText } from "@/lib"


interface ContractsTableRowProps {
  /** Contract data from Convex */
  contract: any
  /** Row sequence number */
  sequenceNumber: number
}

/**
 * Individual table row component for contract data with Convex integration
 * @param {ContractsTableRowProps} props - Row properties
 * @returns {JSX.Element} Table row with contract information
 */
export function ContractsTableRow({ contract, sequenceNumber }: ContractsTableRowProps) {
  return (
    <tr className="hover:bg-muted/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{sequenceNumber}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium truncate max-w-48" title={contract.name}>
          {contract.name}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-muted-foreground">{contract.type?.replace("_", " ") || "Custom"}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-muted-foreground">v{contract.version}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-muted-foreground truncate max-w-32" title={contract.author?.name}>
          {contract.author?.name || "Unknown"}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge variant={getStatusVariant(contract.status)} className="rounded-full">
          {getStatusText(contract.status)}
        </Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-muted-foreground">{formatDate(new Date(contract.createdAt).toISOString())}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <ContractActionsDropdown contract={contract} />
      </td>
    </tr>
  )
}
