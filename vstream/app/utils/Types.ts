export interface VideoItem {
    id: string;
    title: string;
    smg: string; 
    big: string;
    extractId: string;
    streamId: string;
    hostId: string;
    votes: number;
    addedBy:string
}

export interface PlayerProps {
  videoId: string
  isHost: boolean
  streamId: string
  onVideoEnd: () => void
  onStateChange: (event: { data: number }) => void
  setIsPlaying:(p:boolean)=>void
}

