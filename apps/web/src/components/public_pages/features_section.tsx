import { AlertCircle, MessageSquare, Search, FileText, BarChart3 } from "lucide-react"
import { features } from "@/constants/features_section"



function getFeatureIcon(iconName: string, className: string) {
  const icons = {
    "risk-analysis": <AlertCircle className={className} />,
    chat: <MessageSquare className={className} />,
    search: <Search className={className} />,
    drafter: <FileText className={className} />,
    analytics: <BarChart3 className={className} />,
  }

  return icons[iconName as keyof typeof icons] || <AlertCircle className={className} />
}

export default function Features() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Powerful Legal AI Tools</h2>
          <p className="text-lg text-muted-foreground">
            Our suite of AI-powered tools helps legal professionals work smarter and faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-background rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                {getFeatureIcon(feature.icon, "h-6 w-6 text-primary")}
              </div>

              <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
              <p className="mb-4 text-muted-foreground">{feature.description}</p>

              <div className="flex items-center text-sm text-primary">
                <span>Learn more</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1 h-4 w-4"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}



