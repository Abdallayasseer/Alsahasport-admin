import React from "react";
import { Skeleton } from "../ui/Skeleton";
import { SessionsChart, CodesChart, RoleDistChart } from "./AnalyticsCharts";

const ChartsWrapper = ({ analytics, isLoading }) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {!isLoading && <SessionsChart data={analytics.sessionsChart} />}
          {isLoading && (
            <Skeleton className="h-[300px] w-full rounded-2xl bg-zinc-900/50" />
          )}
        </div>
        <div>
          {!isLoading && <RoleDistChart data={analytics.roleDistribution} />}
          {isLoading && (
            <Skeleton className="h-[300px] w-full rounded-2xl bg-zinc-900/50" />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {!isLoading && <CodesChart data={analytics.codesChart} />}
        {isLoading && (
          <Skeleton className="h-[300px] w-full rounded-2xl bg-zinc-900/50" />
        )}
      </div>
    </>
  );
};

export default ChartsWrapper;
