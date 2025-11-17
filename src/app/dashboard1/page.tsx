// dashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Calendar,
  Eye,
  FileText,
  LucideIcon,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';

import { Button } from '@/shared/ui';
import { Badge } from '@/shared/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  totalViews: number;
  averageRating: number;
  totalComments: number;
  totalUsers: number;
}

interface RecentPost {
  id: string;
  title: string;
  views: number;
  rating: number;
  commentCount: number;
  published: boolean;
  publishedAt: string | null;
}

interface PopularCategory {
  name: string;
  postCount: number;
  totalViews: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    totalViews: 0,
    averageRating: 0,
    totalComments: 0,
    totalUsers: 0,
  });

  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [popularCategories, setPopularCategories] = useState<PopularCategory[]>(
    []
  );
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>(
    'month'
  );

  // Загрузка данных (заглушка - замените на реальные API вызовы)
  useEffect(() => {
    // Имитация загрузки данных
    const loadDashboardData = async () => {
      // Здесь будут реальные запросы к вашему API
      setStats({
        totalPosts: 156,
        publishedPosts: 128,
        totalViews: 154892,
        averageRating: 4.3,
        totalComments: 892,
        totalUsers: 2450,
      });

      setRecentPosts([
        {
          id: '1',
          title: '10 принципов здорового питания',
          views: 12450,
          rating: 4.8,
          commentCount: 45,
          published: true,
          publishedAt: '2024-01-15',
        },
        {
          id: '2',
          title: 'Утренняя зарядка для начинающих',
          views: 8920,
          rating: 4.5,
          commentCount: 32,
          published: true,
          publishedAt: '2024-01-14',
        },
        {
          id: '3',
          title: 'Медитация для снижения стресса',
          views: 7560,
          rating: 4.7,
          commentCount: 28,
          published: true,
          publishedAt: '2024-01-13',
        },
      ]);

      setPopularCategories([
        { name: 'Питание', postCount: 45, totalViews: 65420 },
        { name: 'Фитнес', postCount: 38, totalViews: 52310 },
        { name: 'Ментальное здоровье', postCount: 32, totalViews: 42180 },
        { name: 'Сон', postCount: 18, totalViews: 28760 },
      ]);
    };

    loadDashboardData();
  }, [timeRange]);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    description,
  }: {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: number;
    description: string;
  }) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div
            className={`flex items-center text-xs ${trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
          >
            {trend >= 0 ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
            {Math.abs(trend)}% с прошлого периода
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Заголовок и фильтры */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Панель управления
            </h1>
            <p className="text-muted-foreground mt-1">
              Аналитика и управление контентом VitaFlow Blog
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={timeRange === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('week')}
            >
              Неделя
            </Button>
            <Button
              variant={timeRange === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('month')}
            >
              Месяц
            </Button>
            <Button
              variant={timeRange === 'year' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('year')}
            >
              Год
            </Button>
          </div>
        </div>

        {/* Основная статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Всего статей"
            value={stats.totalPosts}
            icon={FileText}
            trend={12}
            description={`${stats.publishedPosts} опубликовано`}
          />
          <StatCard
            title="Просмотры"
            value={stats.totalViews.toLocaleString()}
            icon={Eye}
            trend={8}
            description="За все время"
          />
          <StatCard
            title="Average rating"
            value={stats.averageRating}
            icon={Star}
            trend={2}
            description="На основе оценок пользователей"
          />
          <StatCard
            title="Комментарии"
            value={stats.totalComments}
            icon={MessageSquare}
            trend={15}
            description="Активность сообщества"
          />
          <StatCard
            title="Пользователи"
            value={stats.totalUsers}
            icon={Users}
            trend={22}
            description="Зарегистрированные читатели"
          />
          <StatCard
            title="Эффективность"
            value="84%"
            icon={TrendingUp}
            trend={5}
            description="Опубликовано от общего числа"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Популярные посты */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Популярные статьи
              </CardTitle>
              <CardDescription>
                Статьи с наибольшим количеством просмотров
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {post.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {post.commentCount}
                        </span>
                      </div>
                    </div>
                    <Badge variant={post.published ? 'default' : 'secondary'}>
                      {post.published ? 'Опубликовано' : 'Черновик'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Популярные категории */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Популярные категории
              </CardTitle>
              <CardDescription>Распределение по тематикам</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularCategories.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {category.postCount} статей
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${(category.totalViews / Math.max(...popularCategories.map((c) => c.totalViews))) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {category.totalViews.toLocaleString()} просмотров
                      </span>
                      <span>
                        {Math.round(
                          (category.totalViews / stats.totalViews) * 100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Быстрые действия */}
        <Card>
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
            <CardDescription>
              Управление контентом и настройками
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-16 flex-col gap-2">
                <FileText className="h-5 w-5" />
                Новая статья
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Users className="h-5 w-5" />
                Управление пользователями
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <BarChart3 className="h-5 w-5" />
                Подробная аналитика
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Calendar className="h-5 w-5" />
                Планирование
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
