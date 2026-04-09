import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileText, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import NoteCard from "@/components/finnote/NoteCard";
import NoteDialog from "@/components/finnote/NoteDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportNotesToPDF, exportNotesToCSV, exportNotesToDOCX } from "@/lib/noteExport";

export interface FinNote {
  id: string;
  title: string;
  content: string;
  category: string | null;
  color: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  attachment_url?: string | null;
}

const FinNote = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<FinNote | null>(null);

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["finnotes", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("finnotes")
        .select("*")
        .eq("user_id", user?.id)
        .order("is_pinned", { ascending: false })
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data as FinNote[];
    },
    enabled: !!user,
  });

  const categories = Array.from(new Set(notes.filter(n => n.category).map(n => n.category)));

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (note: FinNote) => {
    setEditingNote(note);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingNote(null);
  };

  const handleExport = (format: 'pdf' | 'csv' | 'docx') => {
    if (notes.length === 0) {
      toast({
        title: "No Notes",
        description: "You don't have any notes to export",
        variant: "destructive",
      });
      return;
    }

    const filename = `finnotes-${new Date().toISOString().split('T')[0]}`;
    const exportData = notes.map(note => ({
      title: note.title,
      content: note.content,
      category: note.category,
      created_at: note.created_at,
      updated_at: note.updated_at,
    }));

    try {
      switch (format) {
        case 'pdf':
          exportNotesToPDF(exportData, `${filename}.pdf`);
          break;
        case 'csv':
          exportNotesToCSV(exportData, `${filename}.csv`);
          break;
        case 'docx':
          exportNotesToDOCX(exportData, `${filename}.doc`);
          break;
      }
      
      toast({
        title: "Export Successful",
        description: `Your notes have been exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your notes",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container px-3 py-4 sm:px-4 sm:py-6 md:py-8 max-w-7xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">FinNote</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Your personal finance notes</p>
      </div>

      {/* Search and Add */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport('csv')}>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('docx')}>
                    Export as DOCX
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </div>
          </div>

          {/* Category Filters */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              {searchQuery || selectedCategory
                ? "No notes found matching your search"
                : "No notes yet. Create your first finance note!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} onEdit={handleEdit} />
          ))}
        </div>
      )}

      <NoteDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        editingNote={editingNote}
      />
    </div>
  );
};

export default FinNote;
