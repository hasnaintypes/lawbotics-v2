"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, FileText, GripVertical } from "lucide-react";
import { RichTextEditor } from "./rich-text-editor";
import type { ContractFormData, ContractClause } from "@/types";
import { CLAUSE_TEMPLATES } from "@/constants/contract-form";

interface ContractClausesSectionProps {
  /** Form data */
  formData: ContractFormData;
  /** Form update handler */
  onUpdate: (updates: Partial<ContractFormData>) => void;
}

/**
 * Contract clauses management section with rich text editor
 * @param {ContractClausesSectionProps} props - Component props
 * @returns {JSX.Element} Clauses management interface
 */
export function ContractClausesSection({
  formData,
  onUpdate,
}: ContractClausesSectionProps) {
  const [showAddClause, setShowAddClause] = useState(false);
  const [newClauseTitle, setNewClauseTitle] = useState("");

  /**
   * Adds a new clause to the contract
   */
  const handleAddClause = () => {
    if (newClauseTitle.trim()) {
      const newClause: ContractClause = {
        id: Date.now().toString(),
        title: newClauseTitle.trim(),
        content: "",
        order: formData.clauses.length + 1,
      };

      onUpdate({ clauses: [...formData.clauses, newClause] });
      setNewClauseTitle("");
      setShowAddClause(false);
    }
  };

  /**
   * Removes a clause from the contract
   * @param {string} clauseId - Clause ID to remove
   */
  const handleRemoveClause = (clauseId: string) => {
    onUpdate({ clauses: formData.clauses.filter((c) => c.id !== clauseId) });
  };

  /**
   * Updates an existing clause
   * @param {string} clauseId - Clause ID to update
   * @param {Partial<ContractClause>} updates - Clause updates
   */
  const handleUpdateClause = (
    clauseId: string,
    updates: Partial<ContractClause>
  ) => {
    onUpdate({
      clauses: formData.clauses.map((c) =>
        c.id === clauseId ? { ...c, ...updates } : c
      ),
    });
  };

  /**
   * Adds a clause from template
   * @param {string} templateTitle - Template title
   * @param {string} templateContent - Template content
   */
  const handleAddFromTemplate = (
    templateTitle: string,
    templateContent: string
  ) => {
    const newClause: ContractClause = {
      id: Date.now().toString(),
      title: templateTitle,
      content: templateContent,
      order: formData.clauses.length + 1,
    };

    onUpdate({ clauses: [...formData.clauses, newClause] });
  };

  return (
    <div className="space-y-6">
      {/* Existing Clauses */}
      {formData.clauses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Contract Clauses ({formData.clauses.length})
          </h3>
          {formData.clauses
            .sort((a, b) => a.order - b.order)
            .map((clause, index) => (
              <Card key={clause.id} className="rounded-2xl border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      <div>
                        <CardTitle className="text-base">
                          {clause.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Clause {index + 1}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleRemoveClause(clause.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Clause Title</Label>
                    <Input
                      value={clause.title}
                      onChange={(e) =>
                        handleUpdateClause(clause.id, { title: e.target.value })
                      }
                      className="mt-1.5 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label>Clause Content</Label>
                    <div className="mt-1.5">
                      <RichTextEditor
                        key={clause.id}
                        content={clause.content}
                        onChange={(content) =>
                          handleUpdateClause(clause.id, { content })
                        }
                        placeholder="Enter clause content..."
                        disabled={false}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Add New Clause */}
      {!showAddClause ? (
        <div className="space-y-4">
          <Button
            onClick={() => setShowAddClause(true)}
            variant="outline"
            className="w-full rounded-2xl border-dashed border-2 h-16 text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Clause
          </Button>

          {/* Clause Templates */}
          {CLAUSE_TEMPLATES.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                Quick Add from Templates
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CLAUSE_TEMPLATES.map((template) => (
                  <Button
                    key={template.id}
                    onClick={() =>
                      handleAddFromTemplate(template.title, template.content)
                    }
                    variant="outline"
                    className="justify-start h-auto p-4 rounded-xl"
                  >
                    <div className="text-left">
                      <div className="font-medium">{template.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {template.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card className="rounded-2xl border-dashed border-2 border-primary/25 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Clause
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Clause Title *</Label>
              <Input
                value={newClauseTitle}
                onChange={(e) => setNewClauseTitle(e.target.value)}
                placeholder="e.g., Scope of Work, Payment Terms, Confidentiality"
                className="mt-1.5 rounded-xl"
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleAddClause}
                disabled={!newClauseTitle.trim()}
                className="rounded-xl"
              >
                Add Clause
              </Button>
              <Button
                onClick={() => {
                  setShowAddClause(false);
                  setNewClauseTitle("");
                }}
                variant="outline"
                className="rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
