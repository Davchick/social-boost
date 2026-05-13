import { cn } from '@/utils/cn'

/**
 * Встраиваемая карта Яндекса по адресу (готовый виджет, ключ не требуется).
 */
export function YandexMapEmbed({ address, className }) {
  const src = `https://yandex.ru/map-widget/v1/?mode=search&text=${encodeURIComponent(address)}`

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-2xl border border-border bg-secondary shadow-card',
        className
      )}
    >
      <iframe
        title={`Карта: ${address}`}
        src={src}
        width="100%"
        height="400"
        className="block w-full min-h-[280px] sm:min-h-[400px] border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
