import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { User } from '@/stores/userStore';

interface MemberProgressProps {
  member: User;
}

export default function MemberProgress({ member }: MemberProgressProps) {
  return (
    <Card className="flex justify-center items-center gap-6 p-3">
      <Avatar className="h-14 w-14">
        <AvatarFallback>{member.username}</AvatarFallback>
      </Avatar>
      <Progress className="w-48 h-3" value={member.progress} />
    </Card>
  );
}
