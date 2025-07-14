import Link from "next/link";
import Logo from "@/components/shared/logo";
import { footerLinks } from "@/constants/footer-section";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail,
  Phone,
} from "lucide-react";

/**
 * Footer component for the application
 *
 * This component renders a comprehensive footer section with the following features:
 * - Company branding and description
 * - Contact information (email and phone)
 * - Social media links
 * - Navigation links organized in sections
 * - Copyright information and legal links
 * - Responsive grid layout
 *
 * The footer automatically displays the current year in the copyright notice
 * and includes hover effects for better user interaction.
 *
 * @example
 * ```tsx
 * function Layout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <>
 *       <main>{children}</main>
 *       <Footer />
 *     </>
 *   );
 * }
 * ```
 *
 * @returns The footer component
 */
export function Footer() {
  /**
   * Social media links configuration
   * Each link includes proper accessibility attributes and icons
   */
  const socialLinks = [
    {
      href: "https://facebook.com",
      icon: Facebook,
      label: "Facebook",
    },
    {
      href: "https://twitter.com",
      icon: Twitter,
      label: "Twitter",
    },
    {
      href: "https://instagram.com",
      icon: Instagram,
      label: "Instagram",
    },
    {
      href: "https://linkedin.com",
      icon: Linkedin,
      label: "LinkedIn",
    },
    {
      href: "https://github.com",
      icon: Github,
      label: "GitHub",
    },
  ];

  /**
   * Legal/policy links displayed in the bottom section
   */
  const legalLinks = [
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
    { href: "/cookies", label: "Cookies" },
  ];

  return (
    <footer className="bg-muted/40 py-12">
      {/* Main footer content */}
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Company information section */}
        <div className="space-y-4">
          {/* Logo and branding */}
          <div className="flex items-center space-x-2">
            <Logo />
          </div>

          {/* Company description */}
          <p className="text-muted-foreground">
            AI-powered legal document analysis and management for legal
            professionals and individuals.
          </p>

          {/* Contact information */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <a
                href="mailto:contact@lawbotics.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Send email to contact@lawbotics.com"
              >
                contact@lawbotics.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <a
                href="tel:+1234567890"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Call +1 (234) 567-890"
              >
                +1 (234) 567-890
              </a>
            </div>
          </div>

          {/* Social media links */}
          <div className="flex gap-4">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit our ${label} page`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation links sections */}
        {footerLinks.map((section, index) => (
          <div key={index} className="space-y-4">
            <h3 className="font-medium">{section.title}</h3>
            <ul className="space-y-2">
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom section with copyright and legal links */}
      <div className="container mt-12 border-t pt-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Copyright notice */}
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} LawBotics. All rights reserved.
          </p>

          {/* Legal links */}
          <div className="flex gap-4 text-sm text-muted-foreground">
            {legalLinks.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className="hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
