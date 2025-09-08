'use client'

import { useTheme } from "@/contexts/ThemeContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export function ThemeSelector() {
  const { theme, setTheme, availableThemes } = useTheme()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Settings</CardTitle>
        <CardDescription>
          Choose your preferred background color and theme
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {availableThemes.map((themeOption) => (
            <Button
              key={themeOption.value}
              variant={theme === themeOption.value ? "default" : "outline"}
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => setTheme(themeOption.value)}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">{themeOption.label}</span>
                {theme === themeOption.value && (
                  <Check className="h-4 w-4" />
                )}
              </div>
              <span className="text-xs text-muted-foreground text-center">
                {themeOption.description}
              </span>
              <div 
                className={`w-full h-3 rounded-sm ${
                  themeOption.value === 'light' ? 'bg-white border border-gray-200' :
                  themeOption.value === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
                }`}
              />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
