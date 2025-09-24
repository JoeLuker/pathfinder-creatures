import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
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
          placeholder="Fuzzy search creatures (try 'dragn' or 'lich')..."
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

      {/* Enhanced Command-based Suggestions */}
      {isFocused && (value.length === 0 || suggestions.length > 0) && (
        <div className="absolute top-full mt-1 w-full z-50">
          <Command className="rounded-lg border shadow-lg bg-white">
            <CommandList>
              {value.length === 0 ? (
                <>
                  {recentSearches.length > 0 && (
                    <CommandGroup heading="Recent">
                      {recentSearches.map((search, idx) => (
                        <CommandItem
                          key={`recent-${idx}`}
                          value={search}
                          onSelect={() => handleSearch(search)}
                          className="cursor-pointer"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {search}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                  <CommandGroup heading="Popular searches">
                    {popularSearches.map((search, idx) => (
                      <CommandItem
                        key={`popular-${idx}`}
                        value={search}
                        onSelect={() => handleSearch(search)}
                        className="cursor-pointer"
                      >
                        <TrendingUp className="mr-2 h-4 w-4" />
                        {search}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              ) : (
                <CommandGroup heading="Suggestions">
                  {suggestions.map((suggestion, idx) => (
                    <CommandItem
                      key={`suggestion-${idx}`}
                      value={suggestion}
                      onSelect={() => handleSearch(suggestion)}
                      className="cursor-pointer"
                    >
                      <Hash className="mr-2 h-4 w-4" />
                      <span className="font-medium">{suggestion}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              <CommandEmpty>No results found.</CommandEmpty>
            </CommandList>

            <div className="px-3 py-2 border-t text-xs text-muted-foreground">
              <div>
                <span className="font-medium">Fuzzy search enabled!</span> Typos are OK - "dragn" finds "dragon", "lich" finds "lich" and "lichling"
              </div>
              <div className="mt-1">
                <span className="font-medium">Examples:</span> "telepathy", "regeneration", "damage reduction", "CR 10", "flying demon"
              </div>
            </div>
          </Command>
        </div>
      )}
    </div>
  );
}