import { ContractEditForm } from "@/components/feature-pages/contracts/edit/contract-edit-form";

interface ContractEditPageProps {
  /** Route parameters */
  params: {
    /** Contract ID */
    id: string;
  };
}

/**
 * Contract edit page component
 * Displays the form for editing existing contracts with version control
 * @param {ContractEditPageProps} props - Page props
 * @returns {JSX.Element} Contract edit page
 */
export default async function ContractEditPage({
  params,
}: ContractEditPageProps) {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <ContractEditForm contractId={params.id} />
      </div>
    </div>
  );
}
