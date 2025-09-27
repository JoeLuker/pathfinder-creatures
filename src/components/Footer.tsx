import { ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-surface-primary border-t border-border py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="text-sm text-text-secondary">
            <p className="font-semibold mb-2">Open Game License Notice</p>
            <p>
              This website uses trademarks and/or copyrights owned by Paizo Inc., which are used under Paizo's Community Use Policy.
              We are expressly prohibited from charging you to use or access this content.
              This website is not published, endorsed, or specifically approved by Paizo Inc.
            </p>
            <p className="mt-2">
              For more information about Paizo's Community Use Policy, please visit{' '}
              <a
                href="https://paizo.com/community/communityuse"
                target="_blank"
                rel="noopener noreferrer"
                className="text-interactive-primary hover:underline inline-flex items-center gap-1"
              >
                paizo.com/communityuse
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
            <p className="mt-2">
              For more information about Paizo Inc. and Paizo products, please visit{' '}
              <a
                href="https://paizo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-interactive-primary hover:underline inline-flex items-center gap-1"
              >
                paizo.com
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-xs text-text-tertiary">
          <p>
            This digital tool uses game content from the Pathfinder Roleplaying Game under the{' '}
            <a
              href="https://paizo.com/pathfinderRPG/prd/openGameLicense.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-interactive-primary hover:underline inline-flex items-center gap-1"
            >
              Open Game License v1.0a
              <ExternalLink className="h-3 w-3" />
            </a>
            {' '}and{' '}
            <a
              href="https://paizo.com/orclicense"
              target="_blank"
              rel="noopener noreferrer"
              className="text-interactive-primary hover:underline inline-flex items-center gap-1"
            >
              ORC License
              <ExternalLink className="h-3 w-3" />
            </a>
          </p>
          <p className="mt-2">
            This product is licensed under the ORC License located at the Library of Congress at TX 9-307-067
          </p>
          <p className="mt-2">
            Pathfinder and associated marks and logos are trademarks of Paizo Inc.,
            and are used under license.
          </p>
        </div>

        <div className="border-t border-border pt-6 text-center text-xs text-text-tertiary">
          <p>© 2024 Pathfinder Creature Database</p>
        </div>
      </div>
    </footer>
  );
}