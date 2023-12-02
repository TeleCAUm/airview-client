export type WebRTCUser = {
  id: string;
  name: string;
  stream: MediaStream;
  isShared: boolean;
  isSelected: boolean;
};

export type DisplayType = "tile" | "focus" | "draw";
