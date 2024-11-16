import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Search } from 'lucide-react'
import { useState } from 'react'

interface SavedSearch {
  id: string
  name: string
  criteria: string
}

interface SavedSearchesModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectSearch: (search: SavedSearch) => void
  savedSearches: SavedSearch[]
}

export function SavedSearchesModal({
  isOpen = false,
  onClose = () => {},
  onSelectSearch = () => {},
  savedSearches = [],
}: SavedSearchesModalProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Saved Searches
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          {savedSearches.length > 0 ? (
            savedSearches.map((search) => (
              <Button
                key={search.id}
                onClick={() => {
                  onSelectSearch(search)
                  onClose()
                }}
                variant="ghost"
                className="w-full justify-start text-left transition-all duration-200 ease-in-out hover:bg-indigo-100 dark:hover:bg-indigo-900/20"
              >
                <div className="flex items-center space-x-3">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span>{search.name}</span>
                </div>
              </Button>
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No saved searches found.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
