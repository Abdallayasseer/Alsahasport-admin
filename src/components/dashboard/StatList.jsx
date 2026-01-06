import React from "react";
import { Card } from "../ui/Card";

const StatList = ({ sessionsData, roleData, codesData }) => {
  // Helper to extract latest values or summaries
  const latestSession =
    sessionsData && sessionsData.length > 0
      ? sessionsData[sessionsData.length - 1]
      : { users: 0 };
  const adminCount = roleData
    ? roleData.find((d) => d.name === "Admin")?.value || 0
    : 0;
  const userCount = roleData
    ? roleData.find((d) => d.name === "User")?.value || 0
    : 0;

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-zinc-900/50 border-white/5">
        <h3 className="text-lg font-bold text-white mb-4">Analytics Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-zinc-800/50 rounded-lg">
            <p className="text-xs text-zinc-500">Peak Sessions</p>
            <p className="text-xl font-mono text-indigo-400">
              {latestSession.users || 0}
            </p>
          </div>
          <div className="p-3 bg-zinc-800/50 rounded-lg">
            <p className="text-xs text-zinc-500">Codes Generated</p>
            {/* Assuming codesData is array of {name, value} or similar */}
            <p className="text-xl font-mono text-emerald-400">
              {codesData
                ? codesData.reduce((a, b) => a + (b.value || 0), 0)
                : 0}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-zinc-900/50 border-white/5">
        <h3 className="text-lg font-bold text-white mb-4">User Distribution</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-400">Users</span>
            <span className="text-sm font-bold text-white">{userCount}</span>
          </div>
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full"
              style={{
                width: `${(userCount / (userCount + adminCount || 1)) * 100}%`,
              }}
            ></div>
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-zinc-400">Admins</span>
            <span className="text-sm font-bold text-white">{adminCount}</span>
          </div>
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-purple-500 h-full"
              style={{
                width: `${(adminCount / (userCount + adminCount || 1)) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatList;
