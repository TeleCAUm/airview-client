export type WebRTCUser = {
  id: string;
  name: string;
  stream: MediaStream;
  isShared: boolean;
  isSelected: boolean;
};
