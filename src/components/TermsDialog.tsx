import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TermsDialog = ({ open, onOpenChange }: TermsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please read our terms and conditions carefully before using FinGuide
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold mb-2">1. Acceptance of Terms</h3>
              <p className="text-muted-foreground">
                By accessing and using FinGuide, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use this application.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">2. Use of Service</h3>
              <p className="text-muted-foreground">
                FinGuide is a personal finance management tool designed to help you track expenses, manage savings, and plan your financial goals. You agree to use this service only for lawful purposes and in accordance with these Terms.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">3. User Account and Data</h3>
              <p className="text-muted-foreground">
                You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate, current information and update it as necessary. All financial data you enter is stored securely and is your responsibility.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">4. Financial Disclaimer</h3>
              <p className="text-muted-foreground">
                <strong>IMPORTANT:</strong> FinGuide provides tools for personal finance management and includes an AI chatbot named "Fin" for general financial guidance. However:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>All investments are subject to market risks</li>
                <li>AI-generated suggestions should not be solely relied upon</li>
                <li>FinGuide does not provide professional financial advice</li>
                <li>Always consult a certified financial advisor before making investment decisions</li>
                <li>Past performance does not guarantee future results</li>
                <li>We are not liable for any financial losses incurred</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">5. Privacy and Data Security</h3>
              <p className="text-muted-foreground">
                We take your privacy seriously. Your personal and financial data is encrypted and stored securely. We do not share your data with third parties without your explicit consent, except as required by law.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">6. Intellectual Property</h3>
              <p className="text-muted-foreground">
                All content, features, and functionality of FinGuide are owned by the creators and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute any part of the application without written permission.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">7. Limitation of Liability</h3>
              <p className="text-muted-foreground">
                FinGuide and its creators shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from your use or inability to use the service, including but not limited to financial losses, data loss, or business interruption.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">8. Service Availability</h3>
              <p className="text-muted-foreground">
                We strive to maintain service availability but do not guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue the service at any time without notice.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">9. User Conduct</h3>
              <p className="text-muted-foreground">
                You agree not to:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Use the service for illegal purposes</li>
                <li>Attempt to gain unauthorized access to the system</li>
                <li>Upload malicious code or viruses</li>
                <li>Harass, abuse, or harm others</li>
                <li>Impersonate others or misrepresent your identity</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">10. Calculators and Tools</h3>
              <p className="text-muted-foreground">
                Financial calculators provided in FinGuide (SIP, EMI, SWP, etc.) are for educational and planning purposes only. Results are estimates based on the inputs you provide and should not be considered as financial advice or guaranteed outcomes.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">11. Third-Party Services</h3>
              <p className="text-muted-foreground">
                FinGuide may contain links to third-party websites or services. We are not responsible for the content, privacy practices, or functionality of external sites.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">12. Termination</h3>
              <p className="text-muted-foreground">
                We reserve the right to terminate or suspend your account at our discretion, without notice, for violations of these Terms or for any other reason.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">13. Changes to Terms</h3>
              <p className="text-muted-foreground">
                We may update these Terms and Conditions from time to time. Continued use of FinGuide after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">14. Governing Law</h3>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">15. Contact Information</h3>
              <p className="text-muted-foreground">
                For questions about these Terms and Conditions, please contact us through the app's feedback feature or via the creator information in the profile section.
              </p>
            </section>

            <section className="pt-4 border-t">
              <p className="text-muted-foreground">
                <strong>By creating an account and using FinGuide, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.</strong>
              </p>
              <p className="text-muted-foreground mt-2">
                Last Updated: {new Date().toLocaleDateString()}
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TermsDialog;