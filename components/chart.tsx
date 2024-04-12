import { Card, AreaChart, Title, Text } from "@tremor/react";

interface chartData {
  data: { Month: string; WPM: number; RAW: number }[];
}

const Chart: React.FC<chartData> = ({ data }) => {
  return (
    <Card>
      <Title>Performance</Title>
      <Text>Most recent test score</Text>
      <AreaChart
        className="mt-4 h-80"
        data={data}
        categories={["WPM", "RAW"]}
        index="Month"
        colors={["indigo", "fuchsia"]}
        valueFormatter={(number: number) =>
          `${Intl.NumberFormat("us").format(number).toString()}`
        }
        yAxisWidth={60}
      />
    </Card>
  );
};
export default Chart;
