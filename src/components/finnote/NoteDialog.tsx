import { useState, useEffect, useCallback, useRef } from "react";
import { z } from "zod";
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
import { FileText, Pencil, Paperclip, X, Save } from "lucide-react";
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

// Validation schema for notes
const noteSchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  content: z.string()
    .trim()
    .min(1, 'Content is required')
    .max(10000, 'Content must be less than 10,000 characters'),
  category: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format')
});

// Sanitize filename for safe storage
const sanitizeFilename = (name: string) => {
  return name
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .substring(0, 100);
};

const NoteDialog = ({ open, onOpenChange, editingNote }: NoteDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"text" | "draw">("text");
  const [drawingData, setDrawingData] = useState<string>("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentUrl, setAttachmentUrl] = useState<string>("");
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    color: "#ffffff",
  });

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!editingNote || !user) return;
    
    const finalContent = activeTab === "draw" ? drawingData : formData.content;
    if (!formData.title.trim() || !finalContent.trim()) return;

    setAutoSaving(true);
    try {
      const { error } = await supabase
        .from("finnotes")
        .update({
          title: formData.title,
          content: finalContent,
          category: formData.category || null,
          color: formData.color,
        })
        .eq("id", editingNote.id);

      if (!error) {
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      setAutoSaving(false);
    }
  }, [editingNote, user, formData, activeTab, drawingData]);

  // Trigger auto-save on content change
  useEffect(() => {
    if (editingNote && open) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => {
        autoSave();
      }, 2000); // Auto-save after 2 seconds of inactivity
    }
    
    return () => clearTimeout(autoSaveTimerRef.current);
  }, [formData, drawingData, activeTab, autoSave, editingNote, open]);

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
      
      // Set attachment URL if exists
      setAttachmentUrl((editingNote as any).attachment_url || "");
      setAttachmentFile(null);
      setLastSaved(null);
    } else {
      setFormData({
        title: "",
        content: "",
        category: "",
        color: "#ffffff",
      });
      setActiveTab("text");
      setDrawingData("");
      setAttachmentUrl("");
      setAttachmentFile(null);
      setLastSaved(null);
    }
  }, [editingNote, open]);

  const handleDrawingSave = (dataUrl: string) => {
    setDrawingData(dataUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const ALLOWED_TYPES = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Only PDF, JPG, PNG, WEBP, DOC, and DOCX files are allowed",
        variant: "destructive",
      });
      return;
    }

    setAttachmentFile(file);
  };

  const removeAttachment = () => {
    setAttachmentFile(null);
    setAttachmentUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalContent = activeTab === "draw" ? drawingData : formData.content;
    
    // Validate input
    try {
      noteSchema.parse({
        title: formData.title,
        content: finalContent || editingNote?.content || '',
        category: formData.category,
        color: formData.color
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);

    try {
      let uploadedAttachmentUrl = attachmentUrl;

      // Upload attachment if a new file is selected
      if (attachmentFile && user) {
        const sanitizedName = sanitizeFilename(attachmentFile.name);
        const fileExt = sanitizedName.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('finnote-attachments')
          .upload(fileName, attachmentFile);

        if (uploadError) throw uploadError;

        // Store only the path - signed URLs will be generated on display
        uploadedAttachmentUrl = fileName;
      }

      if (editingNote) {
        const { error } = await supabase
          .from("finnotes")
          .update({
            title: formData.title,
            content: finalContent,
            category: formData.category || null,
            color: formData.color,
            attachment_url: uploadedAttachmentUrl || null,
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
          attachment_url: uploadedAttachmentUrl || null,
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
          <DialogTitle className="flex items-center justify-between">
            <span>{editingNote ? "Edit Note" : "Create New Note"}</span>
            {editingNote && (
              <span className="text-xs font-normal text-muted-foreground">
                {autoSaving ? (
                  <span className="flex items-center gap-1">
                    <Save className="h-3 w-3 animate-pulse" />
                    Auto-saving...
                  </span>
                ) : lastSaved ? (
                  <span className="flex items-center gap-1">
                    <Save className="h-3 w-3" />
                    Saved {lastSaved.toLocaleTimeString()}
                  </span>
                ) : null}
              </span>
            )}
          </DialogTitle>
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

          {/* File Attachment */}
          <div className="space-y-2">
            <Label htmlFor="attachment">Attachment (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="attachment"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                onChange={handleFileChange}
                className="flex-1"
              />
              {(attachmentFile || attachmentUrl) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={removeAttachment}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {attachmentFile && (
              <p className="text-xs text-muted-foreground">
                <Paperclip className="inline h-3 w-3 mr-1" />
                {attachmentFile.name} ({(attachmentFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
            {attachmentUrl && !attachmentFile && (
              <p className="text-xs text-muted-foreground">
                <Paperclip className="inline h-3 w-3 mr-1" />
                Attachment saved
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Supported: PDF, JPG, PNG, WEBP, DOC, DOCX (Max 5MB)
            </p>
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
