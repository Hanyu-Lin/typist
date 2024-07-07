'use client';
import { useParams } from 'next/navigation';

export default function RoomPage() {
  const params = useParams();
  return (
    <div>
      <h1>{params.roomId}</h1>
    </div>
  );
}
