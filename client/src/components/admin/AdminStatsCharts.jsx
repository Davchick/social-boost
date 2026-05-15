import { useMemo } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { Card } from '@/components/common/Card'
import { buildDailySeries, buildStatusDistribution, buildTopServices } from '@/utils/chartData'

const CHART_MARGIN = { top: 8, right: 8, left: -12, bottom: 0 }

function ChartTooltipContent({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-border bg-secondary px-3 py-2 shadow-card text-sm">
      <p className="font-medium text-text-primary mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={String(entry.dataKey)} className="text-text-secondary">
          <span style={{ color: entry.color }}>{entry.name}</span>
          {': '}
          <span className="font-semibold text-text-primary">{entry.value}</span>
        </p>
      ))}
    </div>
  )
}

function ChartCard({ title, subtitle, children, className = '' }) {
  return (
    <Card hover={false} className={className}>
      <div className="mb-4">
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>}
      </div>
      <div className="w-full min-h-[260px]">{children}</div>
    </Card>
  )
}

function EmptyChartHint({ text }) {
  return (
    <div className="flex h-[260px] items-center justify-center rounded-2xl border border-dashed border-border bg-tertiary/50 text-sm text-text-secondary">
      {text}
    </div>
  )
}

export function AdminStatsCharts({ orders = [], contactRequests = [] }) {
  const activityData = useMemo(() => {
    const orderDays = buildDailySeries(orders, 14)
    const leadDays = buildDailySeries(contactRequests, 14)
    return orderDays.map((row, index) => ({
      label: row.label,
      applications: row.count,
      leads: leadDays[index]?.count ?? 0,
    }))
  }, [orders, contactRequests])

  const statusData = useMemo(() => buildStatusDistribution(orders), [orders])
  const topServices = useMemo(() => buildTopServices(orders), [orders])

  const hasActivity = activityData.some((d) => d.applications > 0 || d.leads > 0)
  const hasStatus = statusData.length > 0
  const hasServices = topServices.length > 0

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <ChartCard
        title="Динамика заявок"
        subtitle="Заявки из личного кабинета и обращения с формы за 14 дней"
        className="xl:col-span-2"
      >
        {hasActivity ? (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={activityData} margin={CHART_MARGIN}>
              <defs>
                <linearGradient id="applicationsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#64748B', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend wrapperStyle={{ fontSize: 13, color: '#334155' }} />
              <Area
                type="monotone"
                dataKey="applications"
                name="Заявки ЛК"
                stroke="#4F46E5"
                strokeWidth={2}
                fill="url(#applicationsGradient)"
              />
              <Area
                type="monotone"
                dataKey="leads"
                name="Форма связи"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#leadsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChartHint text="Пока нет данных за выбранный период" />
        )}
      </ChartCard>

      <ChartCard title="Статусы заявок" subtitle="Распределение по этапам обработки">
        {hasStatus ? (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={64}
                outerRadius={100}
                paddingAngle={3}
              >
                {statusData.map((entry) => (
                  <Cell key={entry.status} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltipContent />} />
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: 13, color: '#334155' }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChartHint text="Нет заявок для отображения" />
        )}
      </ChartCard>

      <ChartCard title="Популярные услуги" subtitle="Топ услуг по числу заявок">
        {hasServices ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topServices} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fill: '#334155', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" name="Заявки" fill="#6366F1" radius={[0, 8, 8, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChartHint text="Нет заявок по услугам" />
        )}
      </ChartCard>
    </div>
  )
}
