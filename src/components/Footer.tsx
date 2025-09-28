import { ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-surface-primary border-t border-border py-1 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-text-tertiary">
          <span>© 2024 Pathfinder Creature Database</span>
          <span className="hidden sm:inline">•</span>
          <span>
            Uses content under{' '}
            <a
              href="https://paizo.com/pathfinderRPG/prd/openGameLicense.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-interactive-primary hover:underline"
            >
              OGL v1.0a
            </a>
            {' & '}
            <a
              href="https://paizo.com/orclicense"
              target="_blank"
              rel="noopener noreferrer"
              className="text-interactive-primary hover:underline"
            >
              ORC License
            </a>
          </span>
          <span className="hidden sm:inline">•</span>
          <a
            href="https://paizo.com/community/communityuse"
            target="_blank"
            rel="noopener noreferrer"
            className="text-interactive-primary hover:underline inline-flex items-center gap-1"
          >
            Community Use Policy
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <div className="text-center text-xs text-text-tertiary mt-1">
          <span className="text-[10px]">
            Pathfinder and associated marks are trademarks of Paizo Inc. Not endorsed by Paizo.
          </span>
        </div>
      </div>
    </footer>
  );
}