'use client';

import { useEffect, useState } from "react";
import { KPICards } from "@/modules/Dashboard/components/KPICards";
import { RevenueChart } from "@/modules/Dashboard/components/RevenueChart";
import { TopDestinations } from "@/modules/Dashboard/components/TopDestinations";
import { TopExcursionsTable } from "@/modules/Dashboard/components/TopExcursionsTable";
import { UpcomingExcursionsTable } from "@/modules/Dashboard/components/UpcomingExcursionsTable";
import {
  getDashboardKPIs,
  getMonthlyRevenue,
  getTopDestinations,
  getTopExcursions,
  getUpcomingExcursions,
} from "@/modules/Dashboard/services/dashboardService";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminProtectedPage } from "@/Core/Components/AdminProtectedPage";

// Loading components
function KPISkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-6">
            <Skeleton className="h-4 w-[120px] mb-4" />
            <Skeleton className="h-10 w-[80px] mb-2" />
            <Skeleton className="h-3 w-[100px]" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <Card className="col-span-full">
      <CardContent className="pt-6">
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
  );
}

function DashboardContent() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const [kpis, revenue, topDestinations, topExcursions, upcoming] = await Promise.all([
          getDashboardKPIs(),
          getMonthlyRevenue(4),
          getTopDestinations(5),
          getTopExcursions(5),
          getUpcomingExcursions(),
        ]);

        if (mounted) {
          setData({ kpis, revenue, topDestinations, topExcursions, upcoming });
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading || !data) {
    return (
      <>
        <KPISkeleton />
        <ChartSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TableSkeleton />
          <TableSkeleton />
        </div>
        <TableSkeleton />
      </>
    );
  }

  return (
    <>
      {/* KPIs Section */}
      <KPICards data={data.kpis} />

      {/* Revenue Chart */}
      <RevenueChart data={data.revenue} />

      {/* Two columns: Top Destinations | Top Excursions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopDestinations data={data.topDestinations} />
        <TopExcursionsTable data={data.topExcursions} />
      </div>

      {/* Upcoming Excursions Table */}
      <UpcomingExcursionsTable data={data.upcoming} />
    </>
  );
}

export default function DashboardPage() {
  return (
    <AdminProtectedPage>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#102542] bg-gradient-to-r from-[#256EFF] to-[#07BEB8] bg-clip-text text-transparent">
            Dashboard Administrativo
          </h1>
          <p className="text-muted-foreground mt-1">
            Resumen general del negocio y operaciones
          </p>
        </div>

        {/* Dashboard Content */}
        <DashboardContent />
      </div>
    </AdminProtectedPage>
  );
}
