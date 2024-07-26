import React, { useState, useEffect } from "react";

import { Bebas_Neue } from "next/font/google";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { ScrollArea } from "../components/ui/scroll-area";
import { Skeleton } from "../components/ui/skeleton";
import { ArrowUp, ArrowDown, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
});

interface Comment {
  id: string;
  user: string;
  text: string;
  createdAt: Date;
  votes: number;
  userVote?: number;
}

interface MemeModalProps {
  meme: {
    id: string;
    title: string;
    description: string;
    url: string;
    rating: number;
    userVote?: number;
  };
  isOpen: boolean;
  onClose: () => void;
  onVote: (id: string, voteValue: number) => void;
  onShare: (id: string) => void;
}

const MemeModal: React.FC<MemeModalProps> = ({
  meme,
  isOpen,
  onClose,
  onVote,
  onShare,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetch(`https://jsonplaceholder.typicode.com/comments?postId=${meme.id}`)
        .then((response) => response.json())
        .then((data) => {
          const formattedComments = data.slice(0, 5).map((comment: any) => ({
            id: comment.id.toString(),
            user: comment.email.split("@")[0],
            text: comment.body,
            createdAt: new Date(Date.now() - Math.random() * 10000000000),
            votes: Math.floor(Math.random() * 100),
            userVote: 0,
          }));
          setComments(formattedComments);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching comments:", error);
          setIsLoading(false);
        });
    }
  }, [isOpen, meme.id]);

  const handleCommentVote = (commentId: string, voteValue: number) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              votes: comment.votes + voteValue,
              userVote: voteValue,
            }
          : comment
      )
    );
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[95vw] flex flex-col p-0 gap-0 h-4/5">
        <DialogHeader className="p-4 pb-2 h-20">
          <DialogTitle
            className={
              bebasNeue.className + " text-2xl text-center self-center"
            }
          >
            {meme.title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea>
          <div className="py-4 px-10 flex flex-col">
            <div className="relative w-full pt-[75%] mb-4">
              <Image
                src={meme.url}
                alt={meme.title}
                layout="fill"
                style={{
                  objectFit: "scale-down",
                }}
                className="rounded-lg"
              />
            </div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={meme.userVote === 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => onVote(meme.id, 1)}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <span>{meme.rating}</span>
                <Button
                  variant={meme.userVote === -1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => onVote(meme.id, -1)}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShare(meme.id)}
              >
                <Share2 className="mr-1 h-4 w-4" />
                Share
              </Button>
            </div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-sm mb-4">{meme.description}</p>
            <h3 className="text-lg font-semibold mb-2">Comments</h3>
            {isLoading
              ? Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="mb-4 flex items-start space-x-2"
                    >
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-grow">
                        <Skeleton className="h-4 w-1/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))
              : comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="mb-4 border-b border-gray-700 pb-4"
                  >
                    <div className="flex items-start space-x-2">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage
                          src={`https://api.dicebear.com/6.x/miniavs/svg?seed=${comment.user}`}
                        />
                        <AvatarFallback>
                          {comment.user[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold truncate">
                            {comment.user}
                          </p>
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {getTimeAgo(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm mt-1 break-words">
                          {comment.text}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            variant={
                              comment.userVote === 1 ? "default" : "ghost"
                            }
                            size="sm"
                            onClick={() => handleCommentVote(comment.id, 1)}
                          >
                            <ArrowUp className="h-3 w-3 mr-1" />
                            {comment.votes}
                          </Button>
                          <Button
                            variant={
                              comment.userVote === -1 ? "default" : "ghost"
                            }
                            size="sm"
                            onClick={() => handleCommentVote(comment.id, -1)}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-3 w-3 mr-1" />
                            Compartir
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MemeModal;
