import { TablePagination } from '@/components/common/TablePagination'
import { usePaginatedList } from '@/hooks/usePaginatedList'

function roleLabel(role) {
  return role === 'admin' ? 'Администратор' : 'Пользователь'
}

function UserCard({ user }) {
  return (
    <article className="rounded-xl border border-border bg-secondary/40 p-4 space-y-2">
      <p className="font-medium text-text-primary">{user.name}</p>
      <a href={`mailto:${user.email}`} className="text-sm text-accent hover:underline break-all">
        {user.email}
      </a>
      <p className="text-sm text-text-muted">{roleLabel(user.role)}</p>
    </article>
  )
}

export function UsersTable({ users, loading }) {
  const {
    page,
    setPage,
    pageItems,
    totalPages,
    rangeFrom,
    rangeTo,
    totalItems,
  } = usePaginatedList(users)

  if (loading) {
    return (
      <div className="py-8 text-center text-text-secondary">Загрузка...</div>
    )
  }

  if (users.length === 0) {
    return <div className="py-6 text-text-secondary text-sm">Пользователей пока нет.</div>
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {pageItems.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      <div className="hidden md:block rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-tertiary/80 border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-text-secondary">Имя</th>
              <th className="text-left py-3 px-4 font-medium text-text-secondary">Почта</th>
              <th className="text-left py-3 px-4 font-medium text-text-secondary w-36">Роль</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((user) => (
              <tr
                key={user.id}
                className="border-b border-border last:border-0 hover:bg-secondary/40 transition-colors"
              >
                <td className="py-3 px-4 font-medium text-text-primary">{user.name}</td>
                <td className="py-3 px-4">
                  <a href={`mailto:${user.email}`} className="text-accent hover:underline break-all">
                    {user.email}
                  </a>
                </td>
                <td className="py-3 px-4 text-text-secondary">{roleLabel(user.role)}</td>
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
  )
}
