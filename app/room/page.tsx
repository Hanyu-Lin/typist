'use client';

import CreateRoomForm from '@/components/createRoomForm';
import JoinRoomButtoon from '@/components/joinRoomButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { nanoid } from 'nanoid';
import { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

export default function Home() {
  const [roomId, setRoomId] = useState<string>('');

  useEffect(() => {
    setRoomId(nanoid());
  }, []);

  return (
    <div className="flex flex-col items-center justify-between py-16 animate-fade-in">
      <Card className="w-[90vw] max-w-[400px]">
        <CardHeader>
          <CardTitle>Create a room</CardTitle>
          <CardDescription>
            Type against your friends in real-time.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col space-y-4">
          <CreateRoomForm roomId={roomId} />

          <div className="flex items-center space-x-2 ">
            <Separator />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator />
          </div>

          <JoinRoomButtoon />
        </CardContent>
      </Card>
    </div>
  );
}
