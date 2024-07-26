"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUp, ArrowDown, Share2, PlusCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Toaster } from "../components/ui/toaster";
import { useToast } from "../components/ui/use-toast";
import { Skeleton } from "../components/ui/skeleton";
import MemeModal from "./MemeModal";
import CreateMemeModal from "./CreateMemeModal";
import { Bebas_Neue } from "next/font/google";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
});

interface Meme {
  id: string;
  title: string;
  description: string;
  url: string;
  rating: number;
  createdAt: Date;
  userVote?: number;
}

const HomePage = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [sortBy, setSortBy] = useState<"date" | "votes">("date");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const [isCreateMemeModalOpen, setIsCreateMemeModalOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const fetchMemes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/memes`);
        if (!response.ok) {
          throw new Error("Error al obtener memes");
        }
        const data = await response.json();
        const storedVotes = JSON.parse(
          localStorage.getItem("memeVotes") || "{}"
        );
        const memesWithUserVotes = data.map((meme: Meme) => ({
          ...meme,
          userVote: storedVotes[meme.id] || 0,
        }));
        setMemes(memesWithUserVotes);
      } catch (error) {
        toast({
          title: "Ups!",
          description: "Algo ocurrió. Inténtalo mas tarde.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemes();
  }, [toast]);

  const handleSort = (value: string) => {
    setSortBy(value as "date" | "votes");
    setMemes((prevMemes) =>
      [...prevMemes].sort((a, b) =>
        value === "date"
          ? b.createdAt.getTime() - a.createdAt.getTime()
          : b.rating - a.rating
      )
    );
  };

  const handleRawShare = (id: string): void => {
    navigator.clipboard.writeText(id);
    toast({
      title: "Link copiado",
      description: "El link del meme ha sido copiado al portapapeles.",
    });
  };

  const handleShare = (id: string) => {
    const url = `${window.location.origin}/meme/${id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copiado",
      description: "El link del meme ha sido copiado al portapapeles.",
    });
  };

  const handleVote = (id: string, voteValue: number) => {
    const storedVotes = JSON.parse(localStorage.getItem("memeVotes") || "{}");
    const currentVote = storedVotes[id] || 0;

    if (currentVote === voteValue) {
      delete storedVotes[id];
      localStorage.setItem("memeVotes", JSON.stringify(storedVotes));
      setMemes((prevMemes) =>
        prevMemes.map((meme) =>
          meme.id === id
            ? { ...meme, votes: meme.rating - voteValue, userVote: 0 }
            : meme
        )
      );
      toast({
        title: "Voto eliminado",
        description: "Has eliminado tu voto para este meme.",
      });
    } else if (currentVote === 0) {
      storedVotes[id] = voteValue;
      localStorage.setItem("memeVotes", JSON.stringify(storedVotes));
      setMemes((prevMemes) =>
        prevMemes.map((meme) =>
          meme.id === id
            ? { ...meme, votes: meme.rating + voteValue, userVote: voteValue }
            : meme
        )
      );
      toast({
        title: "Voto registrado",
        description: `Has votado ${
          voteValue > 0 ? "positivamente" : "negativamente"
        } por este meme.`,
      });
    } else {
      toast({
        title: "No se puede cambiar el voto",
        description:
          "Ya has votado por este meme. Elimina tu voto primero si deseas cambiarlo.",
        variant: "destructive",
      });
    }

    // Si el meme seleccionado está abierto, actualiza sus votos también
    if (selectedMeme && selectedMeme.id === id) {
      setSelectedMeme((prevMeme) =>
        prevMeme
          ? {
              ...prevMeme,
              votes: prevMeme.rating + (voteValue - (prevMeme.userVote || 0)),
              userVote: voteValue,
            }
          : null
      );
    }
  };

  const handleCreateMeme = async (newMeme: any) => {
    setMemes((prevMemes) => [newMeme, ...prevMemes]);
    toast({
      title: "Meme creado",
      description: "Tu nuevo meme ha sido añadido a la galería.",
    });
  };

  const MemeCard = ({ meme }: { meme: Meme }) => (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className={bebasNeue.className + " text-2xl"}>
          {meme.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div
          className="relative w-full pt-[75%] mb-4 cursor-pointer"
          onClick={() => setSelectedMeme(meme)}
        >
          <Image
            src={meme.url}
            alt={meme.title}
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-md"
          />
        </div>
        <p className="text-sm mb-4 flex-grow">{meme.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button
              variant={meme.userVote === 1 ? "default" : "outline"}
              size="sm"
              onClick={() => handleVote(meme.id, 1)}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <span>{meme.rating}</span>
            <Button
              variant={meme.userVote === -1 ? "default" : "outline"}
              size="sm"
              onClick={() => handleVote(meme.id, -1)}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRawShare(meme.url)}
          >
            <Share2 className="mr-1 h-4 w-4" />
            Compartir
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const SkeletonCard = () => (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <Skeleton className="h-6 w-[250px]" />
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <Skeleton className="w-full pt-[75%] mb-4 rounded-md" />
        <Skeleton className="h-4 w-[200px] mb-4" />
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="flex flex-row inline-block align-middle">
          <Image
            src="https://svgsilh.com/svg/1295376.svg"
            alt="Memegator logo"
            className="mr-2"
            width={30}
            height={30}
          />
          <h1 className={bebasNeue.className + " text-4xl font-bold"}>
            MEMEGATOR
          </h1>
        </div>
        <div className="flex justify-between items-center mb-4 mt-4">
          <Select onValueChange={handleSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Fecha</SelectItem>
              <SelectItem value="votes">Votos</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setIsCreateMemeModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Meme
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array(6)
                .fill(0)
                .map((_, index) => <SkeletonCard key={index} />)
            : memes.map((meme) => <MemeCard key={meme.id} meme={meme} />)}
        </div>
      </div>
      {selectedMeme && (
        <MemeModal
          meme={selectedMeme}
          isOpen={!!selectedMeme}
          onClose={() => setSelectedMeme(null)}
          onVote={handleVote}
          onShare={handleShare}
        />
      )}
      <CreateMemeModal
        isOpen={isCreateMemeModalOpen}
        onClose={() => setIsCreateMemeModalOpen(false)}
        onCreateMeme={handleCreateMeme}
      />
      <Toaster />
    </>
  );
};

export default HomePage;
