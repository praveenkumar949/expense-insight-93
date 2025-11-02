import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { FileText, Pencil } from "lucide-react";
import type { FinNote } from "@/pages/FinNote";
import DrawingCanvas from "../DrawingCanvas";

interface NoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingNote: FinNote | null;
}

const COLORS = [
  { name: "Default", value: "#ffffff" },
  { name: "Red", value: "#fee2e2" },
  { name: "Orange", value: "#fed7aa" },
  { name: "Yellow", value: "#fef3c7" },
  { name: "Green", value: "#d1fae5" },
  { name: "Blue", value: "#dbeafe" },
  { name: "Purple", value: "#ede9fe" },
  { name: "Pink", value: "#fce7f3" },
];

const CATEGORIES = ["Budget Ideas", "Investment Tips", "Savings Goals", "Tax Planning", "Debt Management", "Other"];

const NoteDialog = ({ open, onOpenChange, editingNote }: NoteDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"text" | "draw">("text");
  const [drawingData, setDrawingData] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    color: "#ffffff",
  });

  useEffect(() => {
    if (editingNote) {
      setFormData({
        title: editingNote.title,
        content: editingNote.content.startsWith("data:image") ? "" : editingNote.content,
        category: editingNote.category || "",
        color: editingNote.color,
      });
      
      // Check if content is a drawing
      if (editingNote.content.startsWith("data:image")) {
        setActiveTab("draw");
        setDrawingData(editingNote.content);
      } else {
        setActiveTab("text");
        setDrawingData("");
      }
    } else {
      setFormData({
        title: "",
        content: "",
        category: "",
        color: "#ffffff",
      });
      setActiveTab("text");
      setDrawingData("");
    }
  }, [editingNote, open]);

  const handleDrawingSave = (dataUrl: string) => {
    setDrawingData(dataUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalContent = activeTab === "draw" ? drawingData : formData.content;
    
    if (!formData.title.trim() || !finalContent.trim()) {
      toast({
        title: "Missing Information",
        description: activeTab === "draw" ? "Please provide a title and create a drawing" : "Please provide both title and content",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (editingNote) {
        const { error } = await supabase
          .from("finnotes")
          .update({
            title: formData.title,
            content: finalContent,
            category: formData.category || null,
            color: formData.color,
          })
          .eq("id", editingNote.id);

        if (error) throw error;
        toast({ title: "Updated", description: "Note updated successfully" });
      } else {
        const { error } = await supabase.from("finnotes").insert({
          user_id: user?.id,
          title: formData.title,
          content: finalContent,
          category: formData.category || null,
          color: formData.color,
        });

        if (error) throw error;
        toast({ title: "Created", description: "Note created successfully" });
      }

      queryClient.invalidateQueries({ queryKey: ["finnotes"] });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingNote ? "Edit Note" : "Create New Note"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Note title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "text" | "draw")} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">
                <FileText className="mr-2 h-4 w-4" />
                Text Note
              </TabsTrigger>
              <TabsTrigger value="draw">
                <Pencil className="mr-2 h-4 w-4" />
                Draw Note
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your note here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
              />
            </TabsContent>
            
            <TabsContent value="draw">
              <DrawingCanvas onSave={handleDrawingSave} initialDrawing={drawingData} />
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: color.value }}
                        />
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : editingNote ? "Update Note" : "Create Note"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NoteDialog;
