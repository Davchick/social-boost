import { useMemo, useState } from 'react'
import { Check, Copy, Mail, Search } from 'lucide-react'
import { SortHeader } from '@/components/common/SortHeader'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/common/Button'
import { TablePagination } from '@/components/common/TablePagination'
import { usePaginatedList } from '@/hooks/usePaginatedList'
import { api } from '@/utils/api'
import { cn } from '@/utils/cn'

const STATUS_FILTERS = [
  { id: 'all', label: 'Все' },
  { id: 'new', label: 'Новые' },
  { id: 'processed', label: 'Обработанные' },
]

const SORT_OPTIONS = [
  { id: 'date-desc', label: 'Сначала новые' },
  { id: 'date-asc', label: 'Сначала старые' },
  { id: 'name-asc', label: 'Имя А–Я' },
  { id: 'name-desc', label: 'Имя Я–А' },
]

function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center justify-center w-7 h-7 rounded-md text-text-muted hover:text-accent hover:bg-accent/5 shrink-0"
      title={label}
      aria-label={label}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

function ContactRequestStatus({ status, onMarkDone, marking }) {
  if (status === 'processed') {
    return <span className="text-sm font-medium text-success">Обработана</span>
  }
  return (
    <Button size="small" onClick={onMarkDone} loading={marking}>
      Готово
    </Button>
  )
}

function ContactField({ icon: Icon, children, actions }) {
  return (
    <div className="flex items-start gap-2 min-w-0">
      <Icon className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1">{children}</div>
      {actions}
    </div>
  )
}

function ContactRequestCard({ row, onMarkProcessed, marking }) {
  return (
    <article className="rounded-xl border border-border bg-secondary/40 p-4 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium text-text-primary">{row.name}</p>
          <p className="text-xs text-text-muted mt-0.5 tabular-nums">{row.createdAt}</p>
        </div>
        <ContactRequestStatus
          status={row.status}
          marking={marking}
          onMarkDone={() => onMarkProcessed(row.id)}
        />
      </div>

      <ContactField icon={Mail} actions={<CopyButton value={row.email} label="Скопировать почту" />}>
        <a href={`mailto:${row.email}`} className="text-sm text-accent hover:underline break-all">
          {row.email}
        </a>
      </ContactField>

      {row.message ? (
        <p className="text-sm text-text-secondary leading-relaxed border-t border-border pt-3">{row.message}</p>
      ) : (
        <p className="text-sm text-text-muted border-t border-border pt-3">—</p>
      )}
    </article>
  )
}

function parseSortDate(value) {
  if (!value) return 0
  const [datePart, timePart] = value.split(', ')
  const [day, month, year] = (datePart ?? '').split('.').map(Number)
  const [hours, minutes] = (timePart ?? '0:0').split(':').map(Number)
  return new Date(year, (month || 1) - 1, day, hours, minutes).getTime()
}

export function ContactRequestsTable({ rows, loading }) {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc')

  const markProcessedMutation = useMutation({
    mutationFn: (id) => api.updateContactRequestStatus(id, 'processed'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-requests'] })
    },
  })

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = rows

    if (statusFilter !== 'all') {
      list = list.filter((row) => row.status === statusFilter)
    }

    if (q) {
      list = list.filter((row) => {
        const haystack = [row.name, row.email, row.message]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return haystack.includes(q)
      })
    }

    const sorted = [...list]
    switch (sortBy) {
      case 'date-asc':
        sorted.sort((a, b) => parseSortDate(a.createdAt) - parseSortDate(b.createdAt))
        break
      case 'name-asc':
        sorted.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '', 'ru'))
        break
      case 'name-desc':
        sorted.sort((a, b) => (b.name ?? '').localeCompare(a.name ?? '', 'ru'))
        break
      default:
        sorted.sort((a, b) => parseSortDate(b.createdAt) - parseSortDate(a.createdAt))
    }

    return sorted
  }, [rows, search, statusFilter, sortBy])

  const {
    page,
    setPage,
    pageItems,
    totalPages,
    rangeFrom,
    rangeTo,
    totalItems,
  } = usePaginatedList(filtered)

  const dateSortDirection = sortBy === 'date-asc' ? 'asc' : 'desc'
  const nameSortDirection = sortBy === 'name-desc' ? 'desc' : 'asc'

  function toggleDateSort() {
    setSortBy((prev) => (prev === 'date-desc' ? 'date-asc' : 'date-desc'))
  }

  function toggleNameSort() {
    setSortBy((prev) => (prev === 'name-asc' ? 'name-desc' : 'name-asc'))
  }

  if (loading) {
    return <div className="py-8 text-center text-text-secondary">Загрузка...</div>
  }

  if (rows.length === 0) {
    return <div className="py-6 text-text-secondary text-sm">Пока нет заявок.</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Поиск по имени, почте, тексту…"
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => {
                setStatusFilter(filter.id)
                setPage(1)
              }}
              className={cn(
                'px-3 py-1.5 rounded-pill text-sm font-medium transition-colors',
                statusFilter === filter.id
                  ? 'bg-accent text-white'
                  : 'bg-tertiary text-text-secondary hover:bg-border',
              )}
            >
              {filter.label}
            </button>
          ))}
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value)
              setPage(1)
            }}
            className="w-full sm:w-auto ml-auto lg:ml-2 px-3 py-1.5 text-sm rounded-lg border border-border bg-white text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/30"
            aria-label="Сортировка"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-8 text-center text-text-secondary text-sm">
          Ничего не найдено. Попробуйте изменить фильтры или запрос.
        </div>
      ) : (
        <>
          <div className="space-y-3 lg:hidden">
            {pageItems.map((row) => (
              <ContactRequestCard
                key={row.id}
                row={row}
                marking={markProcessedMutation.isPending}
                onMarkProcessed={(id) => markProcessedMutation.mutate(id)}
              />
            ))}
          </div>

          <div className="hidden lg:block rounded-xl border border-border">
            <table className="w-full text-sm table-fixed">
              <thead>
                <tr className="bg-tertiary/80 border-b border-border">
                  <th className="text-left py-3 px-2 w-[14%]">
                    <SortHeader
                      label="Дата"
                      active={sortBy.startsWith('date')}
                      direction={dateSortDirection}
                      onClick={toggleDateSort}
                    />
                  </th>
                  <th className="text-left py-3 px-2 w-[12%]">
                    <SortHeader
                      label="Имя"
                      active={sortBy.startsWith('name')}
                      direction={nameSortDirection}
                      onClick={toggleNameSort}
                    />
                  </th>
                  <th className="text-left py-3 px-2 w-[22%]">Почта</th>
                  <th className="text-left py-3 px-2 w-[40%]">Сообщение</th>
                  <th className="text-left py-3 px-2 w-[12%]">Статус</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border last:border-0 align-top hover:bg-secondary/40 transition-colors"
                  >
                    <td className="py-3 px-2 text-text-secondary text-xs tabular-nums leading-snug">
                      {row.createdAt}
                    </td>
                    <td className="py-3 px-2 font-medium text-text-primary break-words">{row.name}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-start gap-0.5 min-w-0">
                        <a
                          href={`mailto:${row.email}`}
                          className="text-accent hover:underline break-all leading-snug text-xs"
                        >
                          {row.email}
                        </a>
                        <CopyButton value={row.email} label="Скопировать почту" />
                      </div>
                    </td>
                    <td className="py-3 px-2 text-text-secondary">
                      {row.message ? (
                        <p className="leading-relaxed line-clamp-2 break-words" title={row.message}>
                          {row.message}
                        </p>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                    <td className="py-3 px-2 align-middle">
                      <ContactRequestStatus
                        status={row.status}
                        marking={markProcessedMutation.isPending}
                        onMarkDone={() => markProcessedMutation.mutate(row.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <TablePagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            rangeFrom={rangeFrom}
            rangeTo={rangeTo}
            totalItems={totalItems}
          />
        </>
      )}
    </div>
  )
}
