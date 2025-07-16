import { Calendar, Users, FileText, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Document Metadata Component Props
 */
interface DocumentMetadataProps {
  /** The document object containing metadata */
  document: {
    id: string;
    title: string;
    type: string;
    status: string;
    parties: string[];
    effectiveDate?: string;
    expirationDate?: string;
    value?: string;
  };
}

/**
 * Document Metadata Component
 *
 * Displays detailed metadata information about a legal document including
 * parties involved, important dates, and contract value in a structured
 * card layout with appropriate icons and formatting.
 *
 * Features:
 * - Parties list with badges
 * - Effective and expiration dates
 * - Contract value display
 * - Responsive grid layout
 * - Conditional rendering of optional fields
 *
 * @param props - Component props
 * @returns JSX element representing the document metadata card
 *
 * @example
 * ```tsx
 * <DocumentMetadata document={documentData} />
 * ```
 */
export function DocumentMetadata({ document }: DocumentMetadataProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-primary" />
          Document Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Parties */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Users className="h-4 w-4" />
            Parties Involved
          </div>
          <div className="flex flex-wrap gap-2">
            {document.parties.map((party: string, index: number) => (
              <Badge key={index} variant="outline" className="text-sm">
                {party}
              </Badge>
            ))}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {document.effectiveDate && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Effective Date
              </div>
              <p className="text-sm font-medium">
                {new Date(document.effectiveDate).toLocaleDateString()}
              </p>
            </div>
          )}

          {document.expirationDate && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4" />
                Expiration Date
              </div>
              <p className="text-sm font-medium">
                {new Date(document.expirationDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Contract Value */}
        {document.value && document.value !== "N/A" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <FileText className="h-4 w-4" />
              Contract Value
            </div>
            <p className="text-sm font-medium">{document.value}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
