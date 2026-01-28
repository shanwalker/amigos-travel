import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuizAnalytics, useQuizResponsesFiltered } from '@/hooks/useQuiz';
import { BarChart, TrendingUp, Users, Mail, Target, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { exportQuizResponsesToCSV } from '@/lib/supabase/quiz';
import { useToast } from '@/hooks/use-toast';

export default function QuizAnalytics() {
    const { data: analytics, isLoading } = useQuizAnalytics();
    const { data: recentResponses = [] } = useQuizResponsesFiltered({ limit: 10 });
    const { toast } = useToast();

    const handleExport = async () => {
        try {
            const csv = await exportQuizResponsesToCSV();
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `quiz-responses-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            toast({
                title: 'Export Successful',
                description: 'Quiz responses have been exported to CSV',
            });
        } catch (error) {
            toast({
                title: 'Export Failed',
                description: 'Failed to export quiz responses',
                variant: 'destructive',
            });
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-96">Loading analytics...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Quiz Analytics</h1>
                    <p className="text-muted-foreground">Track quiz performance and user insights</p>
                </div>
                <Button onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export to CSV
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics?.total_responses || 0}</div>
                        <p className="text-xs text-muted-foreground">All time quiz completions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics?.completion_rate || 0}%</div>
                        <p className="text-xs text-muted-foreground">Users who finish the quiz</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Email Capture</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics?.email_capture_rate.toFixed(1) || 0}%</div>
                        <p className="text-xs text-muted-foreground">Users who provide email</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics?.conversion_rate.toFixed(1) || 0}%</div>
                        <p className="text-xs text-muted-foreground">Quiz to booking conversion</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Popular Personalities */}
                <Card>
                    <CardHeader>
                        <CardTitle>Popular Personalities</CardTitle>
                        <CardDescription>Most selected travel personalities</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {analytics?.popular_personalities && Object.entries(analytics.popular_personalities)
                                .sort(([, a], [, b]) => (b as number) - (a as number))
                                .slice(0, 5)
                                .map(([personality, count]) => (
                                    <div key={personality} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                            <span className="capitalize">{personality.replace('_', ' ')}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">{count as number} responses</span>
                                            <Badge variant="secondary">
                                                {((count as number / (analytics.total_responses || 1)) * 100).toFixed(0)}%
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Popular Interests */}
                <Card>
                    <CardHeader>
                        <CardTitle>Popular Interests</CardTitle>
                        <CardDescription>Most selected travel interests</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {analytics?.popular_interests && Object.entries(analytics.popular_interests)
                                .sort(([, a], [, b]) => (b as number) - (a as number))
                                .slice(0, 5)
                                .map(([interest, count]) => (
                                    <div key={interest} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                            <span className="capitalize">{interest.replace('_', ' ')}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">{count as number} selections</span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Result Type Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Result Type Distribution</CardTitle>
                        <CardDescription>How users choose to proceed</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span>Matched Trips</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">
                                        {analytics?.result_type_distribution.matched || 0}
                                    </span>
                                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
                                        {((analytics?.result_type_distribution.matched || 0) / (analytics?.total_responses || 1) * 100).toFixed(0)}%
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Surprise Trips</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">
                                        {analytics?.result_type_distribution.surprise || 0}
                                    </span>
                                    <Badge variant="secondary" className="bg-purple-500/10 text-purple-500">
                                        {((analytics?.result_type_distribution.surprise || 0) / (analytics?.total_responses || 1) * 100).toFixed(0)}%
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Custom Requests</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">
                                        {analytics?.result_type_distribution.custom || 0}
                                    </span>
                                    <Badge variant="secondary" className="bg-orange-500/10 text-orange-500">
                                        {((analytics?.result_type_distribution.custom || 0) / (analytics?.total_responses || 1) * 100).toFixed(0)}%
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Average Budget */}
                <Card>
                    <CardHeader>
                        <CardTitle>Budget Insights</CardTitle>
                        <CardDescription>Average user budget preferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-primary mb-2">
                                ₹{analytics?.average_budget.toLocaleString() || 0}
                            </div>
                            <p className="text-sm text-muted-foreground">Average Budget per Person</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Responses */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Quiz Responses</CardTitle>
                    <CardDescription>Latest 10 quiz completions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {recentResponses.map((response) => (
                            <div key={response.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div>
                                    <p className="font-medium">{response.email}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {response.personality && response.personality.replace('_', ' ')} •
                                        {response.interests && ` ${response.interests.length} interests`} •
                                        ₹{response.budget_min?.toLocaleString()} - ₹{response.budget_max?.toLocaleString()}
                                    </p>
                                </div>
                                <Badge variant="outline">
                                    {response.result_type}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
