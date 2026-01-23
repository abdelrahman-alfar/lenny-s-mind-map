import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  RefreshCw,
  LogOut,
  Database,
  BarChart3,
  Clock,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useAdminAuth";
import {
  useAdminSyncLogs,
  useTriggerSync,
  useAdminAnalytics,
} from "@/hooks/useAdminSync";
import { formatDistanceToNow, format } from "date-fns";

function AdminLoginCard() {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Admin Access</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Sign in with Google to access the admin dashboard
          </p>
        </CardHeader>
        <CardContent>
          <Button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminDashboard() {
  const { user, signOut } = useAuth();
  const { data: syncLogs, isLoading: logsLoading } = useAdminSyncLogs();
  const { data: analytics, isLoading: analyticsLoading } = useAdminAnalytics();
  const triggerSync = useTriggerSync();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Logged in as {user?.email}
            </p>
          </div>
          <Button variant="outline" onClick={signOut} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Episodes
              </CardTitle>
              <Database className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsLoading ? "..." : analytics?.totalEpisodes}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Topic Matches
              </CardTitle>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsLoading ? "..." : analytics?.totalMatches}
              </div>
              <p className="text-xs text-muted-foreground">
                Avg {analytics?.averageTopicsPerEpisode} per episode
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {logsLoading || !syncLogs?.[0]?.completed_at
                  ? "Never"
                  : formatDistanceToNow(new Date(syncLogs[0].completed_at), {
                      addSuffix: true,
                    })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sync Control */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>GitHub Sync</CardTitle>
              <Button
                onClick={() => triggerSync.mutate()}
                disabled={triggerSync.isPending}
                className="gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${triggerSync.isPending ? "animate-spin" : ""}`}
                />
                {triggerSync.isPending ? "Syncing..." : "Sync Now"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {triggerSync.isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-2 text-primary"
              >
                <Check className="w-4 h-4" />
                Sync completed successfully!
              </motion.div>
            )}

            {triggerSync.isError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive"
              >
                <AlertCircle className="w-4 h-4" />
                Sync failed. Please try again.
              </motion.div>
            )}

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Recent Sync History
              </h4>
              {logsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : syncLogs?.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">
                  No sync history yet
                </p>
              ) : (
                <div className="divide-y divide-border">
                  {syncLogs?.map((log) => (
                    <div
                      key={log.id}
                      className="py-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {log.status === "completed" ? (
                          <Check className="w-4 h-4 text-primary" />
                        ) : log.status === "failed" ? (
                          <AlertCircle className="w-4 h-4 text-destructive" />
                        ) : (
                          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            {log.episodes_found} found, {log.episodes_added}{" "}
                            added, {log.episodes_updated} updated
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {log.completed_at
                              ? format(
                                  new Date(log.completed_at),
                                  "MMM d, yyyy 'at' h:mm a"
                                )
                              : "In progress..."}
                          </p>
                        </div>
                      </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            log.status === "completed"
                              ? "bg-primary/10 text-primary"
                              : log.status === "failed"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Topic Distribution */}
        {analytics && Object.keys(analytics.topicCounts).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Topic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(analytics.topicCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([topic, count]) => (
                    <div
                      key={topic}
                      className="p-3 bg-muted/50 rounded-lg text-center"
                    >
                      <p className="text-lg font-bold">{count}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {topic.replace(/-/g, " ")}
                      </p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();

  const loading = authLoading || (user && adminLoading);

  // If logged in but not admin, redirect to home
  useEffect(() => {
    if (!authLoading && !adminLoading && user && isAdmin === false) {
      navigate("/");
    }
  }, [authLoading, adminLoading, user, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <AdminLoginCard />;
  }

  if (!isAdmin) {
    return null; // Will redirect
  }

  return <AdminDashboard />;
}
