import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Info, Instagram, Linkedin, Github, Mail, Twitter } from "lucide-react";

interface CreatorInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreatorInfoDialog = ({ open, onOpenChange }: CreatorInfoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>About FinGuide</DialogTitle>
          <DialogDescription>
            Created with ❤️ to help you manage your finances better
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">License & Credits</h4>
            <p className="text-sm text-muted-foreground">
              FinGuide - Personal Finance Management Application
            </p>
            <p className="text-sm text-muted-foreground">
              © 2025 All rights reserved
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Connect with Creator</h4>
            <div className="space-y-2">
              <a
                href="mailto:creator@finguide.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                creator@finguide.com
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <Twitter className="h-4 w-4" />
                X (Twitter)
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatorInfoDialog;
