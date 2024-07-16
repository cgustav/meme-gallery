import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { uploadImageToS3 } from "../workers/uploadImageTos3";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface CreateMemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateMeme: (meme: any) => void;
}

const CreateMemeModal: React.FC<CreateMemeModalProps> = ({
  isOpen,
  onClose,
  onCreateMeme,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    setIsLoading(true);
    try {
      // Upload image to S3
      const imageUrl = await uploadImageToS3(image);

      // Create new meme object
      const newMeme = {
        url: imageUrl,
        title,
        description,
        created_at: new Date().toISOString(),
        rating: 0,
        author: "Anonymous", // You might want to implement user authentication to get the real author
      };

      // Send new meme to API
      const response = await fetch(`${API_URL}/memes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMeme),
      });

      if (!response.ok) {
        throw new Error("Failed to create meme");
      }

      const createdMeme = await response.json();
      onCreateMeme(createdMeme);
      toast({
        title: "Meme created successfully",
        description: "Your new meme has been added to the gallery.",
      });
      onClose();
      // Reset form
      setTitle("");
      setDescription("");
      setImage(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error creating meme:", error);
      toast({
        title: "Error",
        description: "Failed to create meme. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[500px] h-[90vh] max-h-[700px] flex flex-col p-4 sm:p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center">
            Sube tu propio meme 😎
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-6 flex-grow overflow-y-auto"
        >
          <div className="space-y-2 px-2">
            <Label htmlFor="title" className="text-sm sm:text-base">
              Título
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Añade un título a este momardo"
              required
              className="text-sm sm:text-base"
            />
          </div>
          <div className="space-y-2 px-2">
            <Label htmlFor="description" className="text-sm sm:text-base">
              Descripción
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Este meme estuvo picante... ¿porqué lo compartes?"
              required
              className="text-sm sm:text-base"
            />
          </div>
          <div className="space-y-2 px-2">
            <Label htmlFor="image" className="text-sm sm:text-base">
              Sube una imagen
            </Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-40 sm:h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                {previewUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={previewUrl}
                      alt="Meme preview"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-4 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">
                        Haz click para subir
                      </span>{" "}
                      o arrastra hasta aquí
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG o GIF (MAX. 800x400px)
                    </p>
                  </div>
                )}
                <input
                  id="image"
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                  required
                />
              </label>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isLoading || !image}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Meme"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMemeModal;
