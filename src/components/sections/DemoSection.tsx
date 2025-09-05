import { Card } from "@/components/ui/card";
import { Terminal, Code2, BarChart3 } from "lucide-react";

const DemoSection = () => {
  return (
    <section id="demo" className="py-20 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Terminal Window */}
          <Card className="terminal-window p-6 animate-slide-up">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="ml-4 text-sm text-muted-foreground">Agent Logs</span>
            </div>
            <div className="space-y-2 font-mono text-sm">
              <div className="text-green-400">[INFO] Agent initialized</div>
              <div className="text-blue-400">[DEBUG] Loading tools...</div>
              <div className="text-yellow-400">[WARN] Executing code sandbox</div>
              <div className="text-green-400">[SUCCESS] Task completed</div>
              <div className="flex items-center gap-2 mt-4">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="text-primary animate-pulse">_</span>
              </div>
            </div>
          </Card>

          {/* Code Editor Window */}
          <Card className="terminal-window p-6 animate-slide-up delay-200">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
              <Code2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">AgentBox Sandbox</span>
            </div>
            <div className="space-y-3 font-mono text-sm">
              <div className="text-muted-foreground"># Running analysis...</div>
              <div className="bg-primary/10 p-3 rounded border-l-2 border-primary">
                <div className="text-primary">import agentbox as ab</div>
                <div className="text-accent">agent = ab.create_agent()</div>
                <div className="text-foreground">result = agent.execute()</div>
              </div>
              <div className="text-green-400">✓ Execution complete</div>
            </div>
          </Card>

          {/* Output Window */}
          <Card className="terminal-window p-6 animate-slide-up delay-400">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Output</span>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="h-8 bg-primary/20 rounded flex items-end">
                  <div className="w-full h-6 bg-primary rounded-b"></div>
                </div>
                <div className="h-8 bg-primary/20 rounded flex items-end">
                  <div className="w-full h-4 bg-accent rounded-b"></div>
                </div>
                <div className="h-8 bg-primary/20 rounded flex items-end">
                  <div className="w-full h-7 bg-primary rounded-b"></div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <div className="flex justify-between mb-1">
                  <span>Success Rate</span>
                  <span className="text-green-400">98.7%</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Response</span>
                  <span className="text-accent">240ms</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;