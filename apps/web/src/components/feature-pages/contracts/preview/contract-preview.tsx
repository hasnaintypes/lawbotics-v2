"use client";

import { useRef } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import type { ContractFormData } from "@/types";
import { formatDate } from "@/lib/date-utils";

export function ContractPreview({ formData }: { formData: ContractFormData }) {
  const contractRef = useRef<HTMLDivElement>(null);

  if (!formData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a new window with just the contract content
    const printWindow = window.open("", "_blank");
    if (printWindow && contractRef.current) {
      const contractHTML = contractRef.current.innerHTML;
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${formData.name}</title>
            <style>
              body {
                font-family: 'Times New Roman', serif;
                font-size: 12pt;
                line-height: 1.6;
                color: #000;
                margin: 0;
                padding: 40px;
                background: white;
              }
              .contract-content {
                max-width: 8.5in;
                margin: 0 auto;
                background: white;
              }
              h1 {
                text-align: center;
                font-size: 18pt;
                font-weight: bold;
                text-transform: uppercase;
                margin-bottom: 30px;
                text-decoration: underline;
              }
              h2 {
                font-size: 14pt;
                font-weight: bold;
                margin: 20px 0 10px 0;
              }
              h3 {
                font-size: 12pt;
                font-weight: bold;
                margin: 15px 0 8px 0;
              }
              p {
                margin: 10px 0;
                text-align: justify;
              }
              ul {
                margin: 10px 0;
                padding-left: 30px;
              }
              li {
                margin: 5px 0;
              }
              .signature-section {
                margin-top: 60px;
                page-break-inside: avoid;
              }
              .signature-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
                margin-top: 40px;
              }
              .signature-block {
                text-align: center;
              }
              .signature-line {
                border-bottom: 1px solid #000;
                height: 60px;
                margin-bottom: 10px;
              }
              .page-break {
                page-break-before: always;
              }
              @media print {
                body { margin: 0; padding: 20px; }
                .no-print { display: none !important; }
              }
            </style>
          </head>
          <body>
            <div class="contract-content">
              ${contractHTML}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();

      // Trigger print dialog
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Action Buttons */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 no-print">
        <div className="max-w-4xl mx-auto flex justify-end gap-3">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button onClick={handleDownload} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Contract Document */}
      <div className="flex justify-center px-4 py-8">
        <div
          ref={contractRef}
          className="w-full max-w-[8.5in] bg-white shadow-lg print:shadow-none print:max-w-none"
          style={{
            fontFamily: '"Times New Roman", serif',
            fontSize: "12pt",
            lineHeight: "1.6",
            color: "#000",
          }}
        >
          {/* Document Content */}
          <div className="px-12 py-16 print:px-8 print:py-6">
            {/* Contract Title */}
            <h1 className="text-center text-2xl font-bold uppercase mb-8 underline decoration-2">
              {formData.name}
            </h1>

            {/* Opening Statement */}
            <div className="mb-8">
              <p className="text-justify">
                This {formData.name} ("Agreement") has been entered into on the
                date of{" "}
                <span className="border-b border-black px-2 mx-1">
                  {formData.startDate
                    ? formatDate(formData.startDate)
                    : "__________"}
                </span>{" "}
                and is by and between:
              </p>
            </div>

            {/* Parties Section */}
            <div className="mb-8">
              {formData.parties.map((party, index) => (
                <div key={party.id} className="mb-4">
                  <p>
                    <strong>
                      Party {index === 0 ? "Disclosing" : "Receiving"}{" "}
                      Information:
                    </strong>{" "}
                    <span className="border-b border-black px-2 mx-1">
                      {party.name}
                    </span>{" "}
                    with a mailing address of{" "}
                    <span className="border-b border-black px-2 mx-1">
                      {party.email}
                    </span>{" "}
                    ("{party.role}").
                  </p>
                </div>
              ))}
            </div>

            {/* Contract Description (after Parties Section, normal text) */}
            {formData.description && (
              <div className="mb-8">
                <p className="text-justify">{formData.description}</p>
              </div>
            )}

            {/* Contract Details */}
            <div className="mb-8">
              <p className="text-justify mb-4">
                For the purpose of this Agreement, the parties agree to the
                following terms and conditions:
              </p>

              <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-6">
                <div>
                  <strong>Effective Date:</strong>{" "}
                  {formData.startDate ? formatDate(formData.startDate) : "N/A"}
                </div>
                <div>
                  <strong>End Date:</strong>{" "}
                  {formData.endDate ? formatDate(formData.endDate) : "N/A"}
                </div>
                <div>
                  <strong>Expiration Date:</strong>{" "}
                  {formData.expirationDate
                    ? formatDate(formData.expirationDate)
                    : "N/A"}
                </div>
                <div>
                  <strong>Contract Value:</strong> {formData.currency}{" "}
                  {formData.value?.toLocaleString() ?? "N/A"}
                </div>
                <div>
                  <strong>Auto Renewal:</strong>{" "}
                  {formData.autoRenewal ? "Yes" : "No"}
                </div>
              </div>
            </div>

            {/* Numbered Clauses */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">TERMS AND CONDITIONS</h2>

              {/* Confidentiality Clause */}
              {formData.confidential && (
                <div className="mb-6">
                  <h3 className="font-bold mb-2">1. Confidentiality</h3>
                  <p className="text-justify pl-4 mb-2">
                    Each party acknowledges that, in the course of this
                    Agreement, it may receive or have access to confidential or
                    proprietary information, including but not limited to
                    business operations, trade secrets, client lists, financial
                    data, intellectual property, and any other information
                    designated as confidential ("Confidential Information").
                  </p>
                  <p className="text-justify pl-4 mb-2">
                    The receiving party agrees to hold all Confidential
                    Information in strict confidence and shall not, without the
                    prior written consent of the disclosing party, disclose,
                    copy, reproduce, or otherwise make available such
                    information to any third party, except to employees, agents,
                    or representatives who have a legitimate need to know and
                    are bound by confidentiality obligations at least as
                    restrictive as those contained herein.
                  </p>
                  <p className="text-justify pl-4 mb-2">
                    The obligations of confidentiality shall not apply to
                    information that: (a) is or becomes publicly available
                    through no fault of the receiving party; (b) is lawfully
                    received from a third party without restriction; (c) is
                    independently developed by the receiving party without use
                    of or reference to the Confidential Information; or (d) is
                    required to be disclosed by law, regulation, or court order,
                    provided that the receiving party gives prompt written
                    notice to the disclosing party and cooperates in any efforts
                    to limit such disclosure.
                  </p>
                  <p className="text-justify pl-4">
                    The confidentiality obligations set forth herein shall
                    survive the termination or expiration of this Agreement for
                    a period of five (5) years, or as otherwise required by
                    applicable law.
                  </p>
                </div>
              )}

              {/* Notarization Clause */}
              {formData.requiresNotarization && (
                <div className="mb-6">
                  <h3 className="font-bold mb-2">
                    {formData.confidential ? "2" : "1"}. Notarization
                    Requirements
                  </h3>
                  <p className="text-justify pl-4 mb-2">
                    The parties acknowledge and agree that this Agreement shall
                    not be effective or enforceable unless and until it has been
                    duly notarized by a licensed notary public. Each party shall
                    appear in person before a notary public, present valid
                    government-issued identification, and execute this Agreement
                    in the presence of the notary.
                  </p>
                  <p className="text-justify pl-4 mb-2">
                    The notary public shall verify the identities of the
                    signatories, witness the execution of the Agreement, and
                    affix an official notarial seal or stamp to this document.
                    The notary shall complete a notarial certificate, including
                    the date, location, and names of the parties, in accordance
                    with applicable laws and regulations.
                  </p>
                  <p className="text-justify pl-4">
                    Failure by any party to comply with the notarization
                    requirements may render this Agreement null and void, and
                    unenforceable in any court of law. The costs and fees
                    associated with notarization shall be borne equally by all
                    parties, unless otherwise agreed in writing.
                  </p>
                </div>
              )}

              {/* Amendments Clause */}
              <div className="mb-6">
                <h3 className="font-bold mb-2">
                  {(formData.confidential ? 1 : 0) +
                    (formData.requiresNotarization ? 1 : 0) +
                    1}
                  . Amendments
                </h3>
                {formData.allowsAmendments ? (
                  <>
                    <p className="text-justify pl-4 mb-2">
                      This Agreement may be amended, supplemented, or modified
                      only by a written instrument that expressly refers to this
                      Agreement and is signed by duly authorized representatives
                      of all parties. Any such amendment shall specify the
                      section(s) being amended and the effective date of the
                      amendment.
                    </p>
                    <p className="text-justify pl-4 mb-2">
                      No oral modifications, waivers, or changes shall be valid
                      or enforceable. Any attempt to amend this Agreement by
                      means other than a written, signed document shall be null
                      and void. The parties agree to attach all amendments as
                      exhibits to this Agreement and to maintain copies for
                      their records.
                    </p>
                    <p className="text-justify pl-4">
                      The failure of any party to enforce any provision of this
                      Agreement or any amendment shall not constitute a waiver
                      of that provision or any other provision.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-justify pl-4 mb-2">
                      No amendments, modifications, or changes to this Agreement
                      shall be permitted after execution. The terms and
                      conditions set forth herein are final, binding, and may
                      not be altered by any subsequent agreement, oral or
                      written, unless expressly permitted herein.
                    </p>
                    <p className="text-justify pl-4">
                      Any attempt to modify this Agreement in violation of this
                      clause shall be deemed void and of no effect.
                    </p>
                  </>
                )}
              </div>

              {/* Custom Clauses */}
              {Array.isArray(formData.clauses) &&
                formData.clauses.length > 0 && (
                  <>
                    {formData.clauses.map((clause, index) => (
                      <div key={clause.id} className="mb-6">
                        <h3 className="font-bold mb-2">
                          {(formData.confidential ? 1 : 0) +
                            (formData.requiresNotarization ? 1 : 0) +
                            2 +
                            index}
                          . {clause.title}
                        </h3>
                        <div className="pl-4 text-justify">
                          <Markdown rehypePlugins={[rehypeRaw]}>
                            {clause.content}
                          </Markdown>
                        </div>
                      </div>
                    ))}
                  </>
                )}
            </div>

            {/* Governing Law */}
            <div className="mb-8">
              <h3 className="font-bold mb-2">Governing Law and Jurisdiction</h3>
              <p className="text-justify mb-2">
                This Agreement, and any dispute, claim, or controversy arising
                out of or relating to this Agreement, its interpretation,
                performance, or breach, shall be governed by and construed in
                accordance with the laws of{" "}
                {formData.governingLaw ? formData.governingLaw : "Pakistan"}.
              </p>
              <p className="text-justify mb-2">
                The parties hereby irrevocably submit to the exclusive
                jurisdiction of the courts located in{" "}
                {formData.jurisdiction ? formData.jurisdiction : "Islamabad"},
                and waive any objection to venue or forum non conveniens. Each
                party agrees that any legal action or proceeding with respect to
                this Agreement shall be brought only in such courts, and each
                party consents to the personal jurisdiction of such courts for
                the purpose of any such action or proceeding.
              </p>
              <p className="text-justify mb-2">
                The parties further agree that service of process in any such
                action or proceeding may be effected by mailing a copy thereof
                by registered or certified mail, postage prepaid, to the address
                of the party as set forth in this Agreement, or by any other
                method permitted by law.
              </p>
              <p className="text-justify mb-2">
                The prevailing party in any dispute or legal proceeding arising
                out of or relating to this Agreement shall be entitled to
                recover its reasonable attorneys' fees and costs, in addition to
                any other relief to which it may be entitled.
              </p>
              <p className="text-justify">
                If any provision of this Agreement is found to be invalid or
                unenforceable under the governing law, such provision shall be
                deemed modified to the minimum extent necessary to make it valid
                and enforceable, and the remainder of this Agreement shall
                remain in full force and effect.
              </p>
            </div>

            {/* Signature Section */}
            <div className="mt-16 page-break-inside-avoid">
              <h3 className="font-bold mb-6 text-center">SIGNATURES</h3>
              <p className="text-justify mb-8">
                IN WITNESS WHEREOF, the parties hereto have executed this
                Agreement as of the date first written above. Each signatory
                below certifies that they are duly authorized to enter into this
                Agreement on behalf of their respective party and that all
                information provided herein is true and correct to the best of
                their knowledge.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
                <div className="flex flex-col gap-16 mt-4">
                  {formData.parties.map((party) => (
                    <div key={party.id} className="text-left mb-10">
                      <p className="font-bold text-lg mb-1">
                        {party.name.toUpperCase()}
                      </p>
                      <p className="text-base mb-4">{party.role}</p>
                      <p className="text-base mb-2">
                        <span className="font-semibold">Signature:</span>{" "}
                        ________________________
                      </p>
                      <p className="text-base mb-2 flex items-center gap-2">
                        <span className="font-semibold">Date:</span>{" "}
                        ________________________
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notary Section */}
              {formData.requiresNotarization && (
                <div className="mt-16 border-t-2 border-black pt-8">
                  <h4 className="font-bold mb-4 text-center">
                    NOTARY ACKNOWLEDGMENT
                  </h4>
                  <div className="text-center">
                    <div className="h-16 border-b-2 border-black mb-4 mx-auto w-80"></div>
                    <p className="text-sm font-bold">NOTARY PUBLIC</p>
                    <div className="mt-4 space-y-2 text-sm">
                      <p>State of ________________________</p>
                      <p>County of ________________________</p>
                      <p>
                        On this ______ day of ________________, 20____, before
                        me, the undersigned notary public, personally appeared
                        ______________________________________, proved to me on
                        the basis of satisfactory evidence to be the person(s)
                        whose name(s) is/are subscribed to this instrument, and
                        acknowledged that they executed the same in their
                        authorized capacity(ies), and that by their signature(s)
                        on the instrument, the person(s), or the entity upon
                        behalf of which the person(s) acted, executed the
                        instrument.
                      </p>
                      <p>WITNESS my hand and official seal.</p>
                      <div className="h-12 border-b border-black mb-2 mx-auto w-64"></div>
                      <p>Notary Public Signature</p>
                      <p>My commission expires: ________________________</p>
                      <p>Notary Seal:</p>
                      <div className="h-16 border border-dashed border-gray-400 mb-2 mx-auto w-40"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-16 text-center text-xs text-gray-600 border-t pt-4">
              <p className="mt-2">
                This document contains confidential and proprietary information.
                Unauthorized distribution is prohibited.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-before: always;
          }
          .page-break-inside-avoid {
            page-break-inside: avoid;
          }
          @page {
            margin: 0;
            size: auto;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
