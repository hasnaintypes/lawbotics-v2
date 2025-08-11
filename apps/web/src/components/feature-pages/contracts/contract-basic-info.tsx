"use client";

import type React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { ContractFormData } from "@/types";
import { CONTRACT_PRIORITIES, CONTRACT_TYPES } from "@/constants/contract-form";
import { formatDateConsistent } from "@/lib/date-utils";

interface ContractBasicInfoProps {
  /** Form data */
  formData: ContractFormData;
  /** Form update handler */
  onUpdate: (updates: Partial<ContractFormData>) => void;
}

/**
 * Contract basic information form section
 * @param {ContractBasicInfoProps} props - Component props
 * @returns {JSX.Element} Basic info form fields
 */
export function ContractBasicInfo({
  formData,
  onUpdate,
}: ContractBasicInfoProps) {
  /**
   * Handles tag addition
   * @param {string} tag - Tag to add
   */
  const handleAddTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      onUpdate({ tags: [...formData.tags, tag] });
    }
  };

  /**
   * Handles tag removal
   * @param {string} tag - Tag to remove
   */
  const handleRemoveTag = (tag: string) => {
    onUpdate({ tags: formData.tags.filter((t) => t !== tag) });
  };

  /**
   * Handles tag input key press
   * @param {React.KeyboardEvent} e - Keyboard event
   */
  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      handleAddTag(target.value.trim());
      target.value = "";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Contract Name */}
      <div className="md:col-span-2">
        <Label htmlFor="name">Contract Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="Enter contract name"
          className="mt-1.5 rounded-xl"
        />
      </div>

      {/* Contract Type */}
      <div>
        <Label htmlFor="type">Contract Type *</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => onUpdate({ type: value as any })}
        >
          <SelectTrigger className="mt-1.5 rounded-xl">
            <SelectValue placeholder="Select contract type" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {CONTRACT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Priority */}
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select
          value={formData.priority}
          onValueChange={(value) => onUpdate({ priority: value as any })}
        >
          <SelectTrigger className="mt-1.5 rounded-xl">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {CONTRACT_PRIORITIES.map((priority) => (
              <SelectItem key={priority.value} value={priority.value}>
                {priority.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Contract Value */}
      <div>
        <Label htmlFor="value">Contract Value</Label>
        <Input
          id="value"
          type="number"
          value={formData.value || ""}
          onChange={(e) =>
            onUpdate({ value: Number.parseFloat(e.target.value) || undefined })
          }
          placeholder="0.00"
          className="mt-1.5 rounded-xl"
        />
      </div>

      {/* Currency */}
      <div>
        <Label htmlFor="currency">Currency</Label>
        <Select
          value={formData.currency}
          onValueChange={(value) => onUpdate({ currency: value })}
        >
          <SelectTrigger className="mt-1.5 rounded-xl">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="PKR">PKR - Pakistani Rupee</SelectItem>
            <SelectItem value="USD">USD - US Dollar</SelectItem>
            <SelectItem value="EUR">EUR - Euro</SelectItem>
            <SelectItem value="GBP">GBP - British Pound</SelectItem>
            <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Start Date */}
      <div>
        <Label htmlFor="startDate">Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="mt-1.5 rounded-xl w-full text-left border px-3 py-2 bg-background"
            >
              {formData.startDate ? (
                new Date(formData.startDate).toLocaleDateString()
              ) : (
                <span className="text-muted-foreground">Pick a date</span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={
                formData.startDate ? new Date(formData.startDate) : undefined
              }
              onSelect={(date) => {
                if (date) {
                  onUpdate({ startDate: formatDateConsistent(date.getTime()) });
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* End Date */}
      <div>
        <Label htmlFor="endDate">End Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="mt-1.5 rounded-xl w-full text-left border px-3 py-2 bg-background"
            >
              {formData.endDate ? (
                new Date(formData.endDate).toLocaleDateString()
              ) : (
                <span className="text-muted-foreground">Pick a date</span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={
                formData.endDate ? new Date(formData.endDate) : undefined
              }
              onSelect={(date) => {
                if (date) {
                  onUpdate({ endDate: formatDateConsistent(date.getTime()) });
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Description */}
      <div className="md:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Enter contract description"
          rows={3}
          className="mt-1.5 rounded-xl"
        />
      </div>

      {/* Tags */}
      <div className="md:col-span-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          placeholder="Type a tag and press Enter"
          onKeyDown={handleTagKeyPress}
          className="mt-1.5 rounded-xl"
        />
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-full px-3 py-1"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
