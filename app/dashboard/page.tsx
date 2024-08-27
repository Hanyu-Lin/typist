'use client';

import React, { useEffect } from 'react';
import { Activity, Calculator, Hourglass } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { convexQuery } from '@convex-dev/react-query';
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
import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/nextjs';
import { formatChartData } from '@/lib/utils';
import { toast } from 'sonner';
import { Skimmer } from '@/components/ui/skimmer';

interface MetricCardProps {
  title: string;
  value: number | string | undefined;
  icon: React.ReactNode;
  isLoading: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  isLoading,
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold h-8 w-16">
        {isLoading ? <Skimmer /> : value ?? 'N/A'}
      </div>
    </CardContent>
  </Card>
);

interface BestMetricsProps {
  userData:
    | {
        highestWpm?: number;
        highestRaw?: number;
        highestAccuracy?: number;
      }
    | undefined;
  isLoading: boolean;
}

const BestMetrics: React.FC<BestMetricsProps> = ({ userData, isLoading }) => (
  <Card className="xl:col-span-1">
    <CardHeader>
      <CardTitle>Best Metrics Score</CardTitle>
      <CardDescription>
        Personal best scores in the last 30 days
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Metrics</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {['Wpm', 'Raw', 'Accuracy'].map((metric) => (
            <TableRow key={metric}>
              <TableCell>
                <div className="font-medium">{metric}</div>
              </TableCell>
              <TableCell className="text-right h-6 w-8">
                {isLoading ? (
                  <Skimmer />
                ) : (
                  userData?.[`highest${metric}` as keyof typeof userData] ??
                  'N/A'
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const { userId } = useAuth();

  const {
    data: userData,
    isPending: userDataIsPending,
    error: userDataError,
  } = useQuery(convexQuery(api.userData.get, {}));

  const {
    data: mostRecentTestData,
    isPending: mostRecentTestIsPending,
    error: mostRecentTestError,
  } = useQuery(
    convexQuery(api.testScore.fetchRecentTestScores, {
      userId: userId ?? '',
      limit: 10,
    }),
  );

  const filteredMostRecentTestData = mostRecentTestData?.map((test) => ({
    creationTime: test._creationTime,
    wpm: test.wpm,
    raw: test.raw,
  }));

  const chartData = formatChartData(filteredMostRecentTestData || []);

  useEffect(() => {
    if (userDataError || mostRecentTestError) {
      toast.info('No data found. Please take a test to generate data.');
    }
  }, [userDataError, mostRecentTestError]);

  return (
    <main className="flex flex-col mx-auto w-3/4 gap-4 p-4 md:gap-8 md:p-8">
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
        <MetricCard
          title="Tests Taken"
          value={userData?.totalTestsTaken}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          isLoading={userDataIsPending}
        />
        <MetricCard
          title="Time Spent"
          value={userData?.totalTimeSpent}
          icon={<Hourglass className="h-4 w-4 text-muted-foreground" />}
          isLoading={userDataIsPending}
        />
        <MetricCard
          title="Words Typed"
          value={userData?.totalWordsTyped}
          icon={<Calculator className="h-4 w-4 text-muted-foreground" />}
          isLoading={userDataIsPending}
        />
      </section>
      <section className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <BestMetrics userData={userData} isLoading={userDataIsPending} />
        <div className="xl:col-span-2">
          {mostRecentTestIsPending ? (
            <div className="flex items-center justify-center h-64">
              <span className="animate-pulse">Loading chart data...</span>
            </div>
          ) : (
            <Chart data={chartData} />
          )}
        </div>
      </section>
    </main>
  );
}
