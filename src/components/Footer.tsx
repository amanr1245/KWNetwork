import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 bg-background">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="text-xl font-bold tracking-tighter">KWNetwork</div>
          <p className="text-sm text-muted-foreground">
            Everything happening in KW. Built by students, for students.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Github className="h-4 w-4" />
              Open Source
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            KW-Network. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
