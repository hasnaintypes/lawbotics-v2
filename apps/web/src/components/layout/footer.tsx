import Link from "next/link"
import Logo from "@/components/shared/logo";
import { footerLinks } from "@/constants/footer_section"
import { Facebook, Twitter, Instagram, Linkedin, Github, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/40 py-12">
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Logo />
          </div>
          <p className="text-muted-foreground">
            AI-powered legal document analysis and management for legal professionals and individuals.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a
                href="mailto:contact@lawbotics.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                contact@lawbotics.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href="tel:+1234567890" className="text-muted-foreground hover:text-foreground transition-colors">
                +1 (234) 567-890
              </a>
            </div>
          </div>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </a>
          </div>
        </div>

        {footerLinks.map((section, index) => (
          <div key={index} className="space-y-4">
            <h3 className="font-medium">{section.title}</h3>
            <ul className="space-y-2">
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container mt-12 border-t pt-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} LawBotics. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

