import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Quote, RefreshCw } from "lucide-react";

interface JokeDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function JokeDialog({ isOpen, setIsOpen }: JokeDialogProps) {
  const [joke, setJoke] = useState<string>("");
  const [jokeId, setJokeId] = useState<number>(-1);
  const [loading, setLoading] = useState(false);

  const fetchJoke = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/joke");
      const data = await res.json();
      setJoke(data.text);
      setJokeId(data.id);
    } catch (err) {
      setJoke("Failed to load a joke. Life is the joke today.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch a joke specifically when the dialog opens
  React.useEffect(() => {
    if (isOpen) fetchJoke();
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl border-none backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-light italic">
            <Quote size={18} /> Witz #{jokeId}
          </DialogTitle>
        </DialogHeader>
        <div className="py-6 text-center">
          {loading ? (
            <RefreshCw className="mx-auto animate-spin opacity-50" />
          ) : (
            <p className="text-2xl font-medium leading-relaxed">{joke}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
