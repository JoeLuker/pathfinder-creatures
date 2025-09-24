import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, Clock, Hash } from 'lucide-react';
import type { CreatureEnriched } from '@/types/creature-complete';

interface SmartSearchProps {
  value: string;
  onChange: (value: string) => void;
  creatures: CreatureEnriched[];
}

export function SmartSearch({ value, onChange, creatures }: SmartSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const recent = localStorage.getItem('recentSearches');
    if (recent) {
      setRecentSearches(JSON.parse(recent));
    }
  }, []);

  useEffect(() => {
    if (value.length > 1) {
      // Generate smart suggestions based on current input
      const searchLower = value.toLowerCase();
      const nameMatches = new Set<string>();
      const typeMatches = new Set<string>();

      creatures.forEach(creature => {
        if (creature.name.toLowerCase().includes(searchLower)) {
          nameMatches.add(creature.name);
        }
        if (creature.type?.toLowerCase().includes(searchLower)) {
          typeMatches.add(creature.type);
        }
      });

      const allSuggestions = [
        ...Array.from(nameMatches).slice(0, 3),
        ...Array.from(typeMatches).slice(0, 2),
      ];

      setSuggestions(allSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [value, creatures]);

  const handleSearch = (searchTerm: string) => {
    onChange(searchTerm);
    setIsFocused(false);

    // Save to recent searches
    if (searchTerm.trim()) {
      const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  };

  const popularSearches = ['dragon', 'undead', 'telepathy', 'regeneration', 'flying', 'CR 10', 'large', 'demon', 'damage reduction'];

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search by name, type, or ability..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="pl-10 pr-4"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(value);
            }
          }}
        />
        {value && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => onChange('')}
          >
            ×
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isFocused && (value.length === 0 || suggestions.length > 0) && (
        <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg border z-50 py-2">
          {value.length === 0 ? (
            <>
              {recentSearches.length > 0 && (
                <div className="px-3 pb-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Clock className="h-3 w-3" />
                    <span>Recent</span>
                  </div>
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-50 rounded"
                      onMouseDown={() => handleSearch(search)}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              )}
              <div className="px-3 pt-2 border-t">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <TrendingUp className="h-3 w-3" />
                  <span>Popular searches</span>
                </div>
                {popularSearches.map((search, idx) => (
                  <button
                    key={idx}
                    className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-50 rounded"
                    onMouseDown={() => handleSearch(search)}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="px-3">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-50 rounded"
                  onMouseDown={() => handleSearch(suggestion)}
                >
                  <span className="font-medium">{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          <div className="px-3 pt-2 mt-2 border-t">
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Full-text search enabled!</span> Search across names, descriptions, abilities, subtypes, and more.
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="font-medium">Examples:</span> "telepathy", "regeneration", "damage reduction", "CR 10", "flying demon"
            </div>
          </div>
        </div>
      )}
    </div>
  );
}