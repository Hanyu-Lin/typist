'use client';

import { Activity, Calculator, Hourglass } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Chart from '@/components/chart';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/nextjs';
import { formatChartData } from '@/lib/utils';

export default function Dashboard() {
  const { userId } = useAuth();
  const userData = useQuery(api.userData.get, {});
  const mostRecentTest = useQuery(api.testScore.fetchRecentTestScores, {
    userId: userId ?? '',
    limit: 10,
  })?.map((test) => ({
    creationTime: test._creationTime,
    wpm: test.wpm,
    raw: test.raw,
  }));
  const chartData = formatChartData(mostRecentTest || []);
  return (
    <div className="flex mx-auto w-3/4 flex-col ">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tests Taken</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userData?.totalTestsTaken}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
              <Hourglass className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userData?.totalTimeSpent}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Word Typed</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userData?.totalWordsTyped}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-1">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Best Metrics Score</CardTitle>
                <CardDescription>
                  Personal best scores in the last 30 days
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matrics</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">WPM</div>
                    </TableCell>
                    <TableCell className="text-right">
                      {userData?.highestWpm}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">RAW</div>
                    </TableCell>
                    <TableCell className="text-right">
                      {userData?.highestRaw}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">Accuracy</div>
                    </TableCell>
                    <TableCell className="text-right">
                      {userData?.highestAccuracy}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="xl:col-span-2">
            <Chart data={chartData} />
          </div>
        </div>
      </main>
    </div>
  );
}
