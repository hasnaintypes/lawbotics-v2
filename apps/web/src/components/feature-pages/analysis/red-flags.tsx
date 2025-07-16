import { AlertTriangle, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSeverityColor } from "@/lib";

/**
 * Red flag interface definition
 */
interface RedFlag {
  title: string;
  description: string;
  severity: string;
  location?: string;
}

/**
 * Props for the RedFlags component
 */
interface RedFlagsProps {
  flags: RedFlag[];
}

/**
 * RedFlags Component
 *
 * Displays a list of red flags identified in the document analysis.
 * Each red flag includes title, description, severity level, and optional location.
 *
 * @param props - Component props containing the flags array
 * @returns JSX element displaying the red flags
 *
 * @example
 * ```tsx
 * <RedFlags flags={analysis.redFlags} />
 * ```
 */
export function RedFlags({ flags }: RedFlagsProps) {
  return (
    <div className="space-y-4">
      {flags.map((flag, index) => (
        <Card key={index} className="border-l-4 border-l-red-500 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-start gap-3 flex-1">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">
                    {flag.title}
                  </h4>
                  {flag.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" />
                      {flag.location}
                    </div>
                  )}
                </div>
              </div>
              <Badge className={getSeverityColor(flag.severity)}>
                {flag.severity} severity
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-8">
              {flag.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
