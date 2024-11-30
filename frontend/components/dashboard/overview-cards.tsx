import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersIcon, ActivityIcon, FileIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

const StatsCard = ({ title, value, icon, description }: StatsCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </CardContent>
  </Card>
);

export function OverviewCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatsCard
        title="Celkem pacientů"
        value="2,350"
        icon={<UsersIcon className="h-4 w-4 text-muted-foreground" />}
        description="↗︎ 120 za poslední měsíc"
      />
      <StatsCard
        title="Aktivní diagnózy"
        value="1,234"
        icon={<ActivityIcon className="h-4 w-4 text-muted-foreground" />}
        description="↗︎ 45 za poslední týden"
      />
      <StatsCard
        title="DICOM studie"
        value="456"
        icon={<FileIcon className="h-4 w-4 text-muted-foreground" />}
        description="↗︎ 23 za poslední den"
      />
    </div>
  );
}
