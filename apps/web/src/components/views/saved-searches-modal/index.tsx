import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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
  isOpen,
  onClose,
  onSelectSearch,
  savedSearches,
}: SavedSearchesModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1b1e] text-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">
            Saved Searches
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {savedSearches.length > 0 ? (
            savedSearches.map((search) => (
              <Button
                key={search.id}
                onClick={() => {
                  onSelectSearch(search)
                  onClose()
                }}
                variant="ghost"
                className="to-bg-[#1a1b1e] w-full bg-gradient-to-r from-indigo-500 shadow-sm shadow-zinc-950"
              >
                {search.name}
              </Button>
            ))
          ) : (
            <p className="text-gray-400">No saved searches found.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
