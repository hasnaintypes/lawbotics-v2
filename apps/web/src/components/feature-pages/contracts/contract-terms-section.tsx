"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Settings, CalendarIcon } from "lucide-react";
import type { ContractFormData } from "@/types";
import { formatDateConsistent } from "@/lib/date-utils";

interface ContractTermsSectionProps {
  /** Form data */
  formData: ContractFormData;
  /** Form update handler */
  onUpdate: (updates: Partial<ContractFormData>) => void;
}

/**
 * Contract terms and conditions section
 * @param {ContractTermsSectionProps} props - Component props
 * @returns {JSX.Element} Terms and conditions form
 */
export function ContractTermsSection({
  formData,
  onUpdate,
}: ContractTermsSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Settings className="h-5 w-5" />
        Contract Settings
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Auto Renewal */}
        <Card className="rounded-2xl border-0 shadow-sm bg-muted/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Auto Renewal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="autoRenewal"
                checked={formData.autoRenewal}
                onCheckedChange={(checked) =>
                  onUpdate({ autoRenewal: checked as boolean })
                }
              />
              <Label htmlFor="autoRenewal">Enable automatic renewal</Label>
            </div>
            {formData.autoRenewal && (
              <div>
                <Label>Renewal Period (days)</Label>
                <Input
                  type="number"
                  value={formData.renewalPeriod || ""}
                  onChange={(e) =>
                    onUpdate({
                      renewalPeriod:
                        Number.parseInt(e.target.value) || undefined,
                    })
                  }
                  placeholder="30"
                  className="mt-1.5 rounded-xl"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expiration Settings */}
        <Card className="rounded-2xl border-0 shadow-sm bg-muted/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Expiration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Expiration Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="mt-1.5 rounded-xl w-full text-left border border-input px-3 py-2 bg-background hover:bg-accent/50 transition-colors h-10 flex items-center justify-between"
                  >
                    {formData.expirationDate ? (
                      new Date(formData.expirationDate).toLocaleDateString()
                    ) : (
                      <span className="text-muted-foreground">
                        Pick expiration date
                      </span>
                    )}
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      formData.expirationDate
                        ? new Date(formData.expirationDate)
                        : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        onUpdate({
                          expirationDate: formatDateConsistent(date.getTime()),
                        });
                      } else {
                        onUpdate({ expirationDate: "" });
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Notification Period (days before expiration)</Label>
              <Select
                value={formData.notificationPeriod?.toString()}
                onValueChange={(value) =>
                  onUpdate({ notificationPeriod: Number.parseInt(value) })
                }
              >
                <SelectTrigger className="mt-1.5 rounded-xl">
                  <SelectValue placeholder="Select notification period" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Terms */}
      <Card className="rounded-2xl border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Additional Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Governing Law</Label>
              <Input
                value={formData.governingLaw || ""}
                onChange={(e) => onUpdate({ governingLaw: e.target.value })}
                placeholder="e.g., State of California"
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div>
              <Label>Jurisdiction</Label>
              <Input
                value={formData.jurisdiction || ""}
                onChange={(e) => onUpdate({ jurisdiction: e.target.value })}
                placeholder="e.g., California Courts"
                className="mt-1.5 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requiresNotarization"
                checked={formData.requiresNotarization}
                onCheckedChange={(checked) =>
                  onUpdate({ requiresNotarization: checked as boolean })
                }
              />
              <Label htmlFor="requiresNotarization">
                Requires notarization
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowsAmendments"
                checked={formData.allowsAmendments}
                onCheckedChange={(checked) =>
                  onUpdate({ allowsAmendments: checked as boolean })
                }
              />
              <Label htmlFor="allowsAmendments">Allows amendments</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="confidential"
                checked={formData.confidential}
                onCheckedChange={(checked) =>
                  onUpdate({ confidential: checked as boolean })
                }
              />
              <Label htmlFor="confidential">Mark as confidential</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
