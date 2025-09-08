'use client'

import { CompanyLogo } from './company-logo'

// Company logo configurations with fallback URLs
const companyLogos = [
  {
    name: "Perplexity",
    logoSrc: "https://www.perplexity.ai/favicon.ico",
    fallbackColor: "bg-gradient-to-br from-blue-500 to-purple-600"
  },
  {
    name: "Hugging Face", 
    logoSrc: "https://huggingface.co/favicon.ico",
    fallbackColor: "bg-gradient-to-br from-yellow-400 to-orange-500"
  },
  {
    name: "Groq",
    logoSrc: "https://groq.com/favicon.ico", 
    fallbackColor: "bg-gradient-to-br from-green-500 to-teal-600"
  },
  {
    name: "Lindy",
    logoSrc: "https://lindy.ai/favicon.ico",
    fallbackColor: "bg-gradient-to-br from-pink-500 to-rose-600"
  },
  {
    name: "Manus",
    logoSrc: "https://manus.ai/favicon.ico",
    fallbackColor: "bg-gradient-to-br from-indigo-500 to-blue-600"
  },
  {
    name: "OpenAI",
    logoSrc: "https://openai.com/favicon.ico",
    fallbackColor: "bg-gradient-to-br from-emerald-500 to-green-600"
  }
]

export function CompanyLogos() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center opacity-60 hover:opacity-80 transition-opacity">
      {companyLogos.map((company) => (
        <div key={company.name} className="flex flex-col items-center space-y-2 group">
          <CompanyLogo
            name={company.name}
            logoSrc={company.logoSrc}
            fallbackColor={company.fallbackColor}
          />
          <span className="text-sm font-medium text-muted-foreground">
            {company.name}
          </span>
        </div>
      ))}
    </div>
  )
}
