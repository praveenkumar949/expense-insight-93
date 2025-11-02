import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pin, Edit, Trash2, Download } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import type { FinNote } from "@/pages/FinNote";

interface NoteCardProps {
  note: FinNote;
  onEdit: (note: FinNote) => void;
}

const NoteCard = ({ note, onEdit }: NoteCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handlePin = async () => {
    const { error } = await supabase
      .from("finnotes")
      .update({ is_pinned: !note.is_pinned })
      .eq("id", note.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ["finnotes"] });
      toast({
        title: note.is_pinned ? "Unpinned" : "Pinned",
        description: `Note ${note.is_pinned ? "unpinned" : "pinned"} successfully`,
      });
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("finnotes")
      .delete()
      .eq("id", note.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ["finnotes"] });
      toast({
        title: "Deleted",
        description: "Note deleted successfully",
      });
    }
  };

  const handleExport = () => {
    const content = `${note.title}\n\n${note.content}\n\nCategory: ${note.category || "None"}\nLast updated: ${format(new Date(note.updated_at), "PPpp")}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Exported",
      description: "Note exported successfully",
    });
  };

  return (
    <Card
      className="relative overflow-hidden transition-all hover:shadow-lg"
      style={{ borderLeftWidth: "4px", borderLeftColor: note.color }}
    >
      <CardContent className="pt-6">
        {note.is_pinned && (
          <Pin className="absolute top-2 right-2 h-4 w-4 text-primary" />
        )}
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{note.title}</h3>
        
        {note.content.startsWith("data:image") ? (
          <img 
            src={note.content} 
            alt="Drawing" 
            className="w-full rounded-md border mb-3 max-h-48 object-contain bg-white" 
          />
        ) : (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-4 whitespace-pre-wrap">
            {note.content}
          </p>
        )}

        {note.category && (
          <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full mb-3">
            {note.category}
          </span>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>Updated {format(new Date(note.updated_at), "MMM d, yyyy")}</span>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handlePin}>
            <Pin className={`h-4 w-4 ${note.is_pinned ? "fill-current" : ""}`} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(note)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
