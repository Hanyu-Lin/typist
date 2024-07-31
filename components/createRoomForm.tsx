'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { User, useUserStore } from '@/stores/userStore';
import { createRoomSchema } from '@/lib/validations/createRoom';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import CopyButton from '@/components/copyButton';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { parseConvexError } from '@/lib/utils';
import { ConvexError } from 'convex/values';

interface CreateRoomFormProps {
  roomId: string;
}

type CreatRoomForm = z.infer<typeof createRoomSchema>;

export default function CreateRoomForm({ roomId }: CreateRoomFormProps) {
  const roomMutate = useMutation(api.room.create);
  const userStore = useUserStore();
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit({ username }: CreatRoomForm) {
    setIsLoading(true);
    const owner: User = userStore.createUser(username);
    try {
      await roomMutate({ roomId, owner });
      setUser(owner);
      router.push(`/room/${roomId}`);
    } catch (error) {
      toast.error(parseConvexError(error));
    } finally {
      setIsLoading(false);
    }
  }
  const form = useForm<CreatRoomForm>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      username: '',
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" autoComplete="off" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div>
          <p className="mb-2 text-sm font-medium">Room ID</p>

          <div className="flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
            <span>{roomId}</span>
            <CopyButton value={roomId} />
          </div>
        </div>

        <Button type="submit" className="mt-2 w-full">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Create a Room'
          )}
        </Button>
      </form>
    </Form>
  );
}
