"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Users } from "lucide-react"
import type { ContractFormData, ContractParty } from "@/types"
import { PARTY_TYPES } from "@/constants/contract-form"

interface ContractPartiesSectionProps {
  /** Form data */
  formData: ContractFormData
  /** Form update handler */
  onUpdate: (updates: Partial<ContractFormData>) => void
}

/**
 * Contract parties management section
 * @param {ContractPartiesSectionProps} props - Component props
 * @returns {JSX.Element} Parties management interface
 */
export function ContractPartiesSection({ formData, onUpdate }: ContractPartiesSectionProps) {
  const [newParty, setNewParty] = useState<Partial<ContractParty>>({
    type: "client",
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
  });
  

  /**
   * Adds a new party to the contract
   */
  const handleAddParty = () => {
    if (newParty.name && newParty.type && newParty.role) {
      const party: ContractParty = {
        id: Date.now().toString(),
        type: newParty.type as ContractParty["type"],
        name: newParty.name,
        email: newParty.email || "",
        phone: newParty.phone || "",
        address: newParty.address || "",
        role: newParty.role,
      }

      onUpdate({ parties: [...formData.parties, party] })
      setNewParty({ type: "client", name: "", email: "", role: "", phone: "", address: "" })
    }
  }

  /**
   * Removes a party from the contract
   * @param {string} partyId - Party ID to remove
   */
  const handleRemoveParty = (partyId: string) => {
    onUpdate({ parties: formData.parties.filter((p) => p.id !== partyId) })
  }

  /**
   * Updates an existing party
   * @param {string} partyId - Party ID to update
   * @param {Partial<ContractParty>} updates - Party updates
   */
  const handleUpdateParty = (partyId: string, updates: Partial<ContractParty>) => {
    onUpdate({
      parties: formData.parties.map((p) => (p.id === partyId ? { ...p, ...updates } : p)),
    })
  }

  return (
    <div className="space-y-6">
      {/* Existing Parties */}
      {formData.parties.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Users className="h-5 w-5" />
            Contract Parties ({formData.parties.length})
          </h3>
          {formData.parties.map((party) => (
            <Card key={party.id} className="rounded-2xl border-0 shadow-sm bg-muted/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{party.name}</CardTitle>
                  <Button
                    onClick={() => handleRemoveParty(party.id)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive rounded-xl"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Party Type</Label>
                  <Select
                    value={party.type}
                    onValueChange={(value) => handleUpdateParty(party.id, { type: value as any })}
                  >
                    <SelectTrigger className="mt-1.5 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {PARTY_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Role</Label>
                  <Input
                    value={party.role}
                    onChange={(e) => handleUpdateParty(party.id, { role: e.target.value })}
                    className="mt-1.5 rounded-xl"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={party.email}
                    onChange={(e) => handleUpdateParty(party.id, { email: e.target.value })}
                    className="mt-1.5 rounded-xl"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={party.phone}
                    onChange={(e) => handleUpdateParty(party.id, { phone: e.target.value })}
                    className="mt-1.5 rounded-xl"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Address</Label>
                  <Input
                    value={party.address}
                    onChange={(e) => handleUpdateParty(party.id, { address: e.target.value })}
                    className="mt-1.5 rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Party */}
      <Card className="rounded-2xl border-dashed border-2 border-muted-foreground/25">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Party
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Party Type *</Label>
            <Select value={newParty.type} onValueChange={(value) => setNewParty({ ...newParty, type: value as any })}>
              <SelectTrigger className="mt-1.5 rounded-xl">
                <SelectValue placeholder="Select party type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {PARTY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Name *</Label>
            <Input
              value={newParty.name}
              onChange={(e) => setNewParty({ ...newParty, name: e.target.value })}
              placeholder="Enter party name"
              className="mt-1.5 rounded-xl"
            />
          </div>
          <div>
            <Label>Role *</Label>
            <Input
              value={newParty.role}
              onChange={(e) => setNewParty({ ...newParty, role: e.target.value })}
              placeholder="e.g., Service Provider, Client"
              className="mt-1.5 rounded-xl"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={newParty.email}
              onChange={(e) => setNewParty({ ...newParty, email: e.target.value })}
              placeholder="Enter email address"
              className="mt-1.5 rounded-xl"
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              value={newParty.phone}
              onChange={(e) => setNewParty({ ...newParty, phone: e.target.value })}
              placeholder="Enter phone number"
              className="mt-1.5 rounded-xl"
            />
          </div>
          <div>
            <Label>Address</Label>
            <Input
              value={newParty.address}
              onChange={(e) => setNewParty({ ...newParty, address: e.target.value })}
              placeholder="Enter address"
              className="mt-1.5 rounded-xl"
            />
          </div>
          <div className="md:col-span-2">
            <Button
              onClick={handleAddParty}
              disabled={!newParty.name || !newParty.type || !newParty.role}
              className="rounded-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Party
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
