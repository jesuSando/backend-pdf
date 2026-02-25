import { useState } from "react"
import { CreateTab } from "./components/pdf-editor/create-tab"
import { ListTab } from "./components/pdf-editor/list-tab"
import { FileText, PenTool, LayoutList } from "lucide-react"
import { Toaster } from "sonner"

type ActiveTab = "create" | "list"

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("create")

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold tracking-tight text-foreground">
              PDF Editor
            </span>
          </div>

          <div className="h-6 w-px bg-border" />

          <nav className="flex">
            <button
              onClick={() => setActiveTab("create")}
              className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === "create"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground cursor-pointer"
                }`}
            >
              <PenTool className="h-4 w-4" />
              Crear
              {activeTab === "create" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === "list"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground cursor-pointer"
                }`}
            >
              <LayoutList className="h-4 w-4" />
              Listar
              {activeTab === "list" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {activeTab === "create" && <CreateTab />}
        {activeTab === "list" && <ListTab />}
      </main>

      <Toaster position="top-right" richColors />
    </div>
  )
}

export default App