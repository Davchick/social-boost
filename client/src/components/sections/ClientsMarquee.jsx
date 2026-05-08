import { Container } from '@/components/common/Container'

const clients = [
  'Студия «Линия вкуса»',
  'Сеть «Городской салон»',
  'Клиника «Добрый доктор»',
  'Магазин «Тёплый дом»',
  'Кафе «Северный берег»',
  'Ателье «Точный крой»',
  'Школа «Новая смена»',
  'Ферма «Солнечный луг»',
  'Сервис «Чистый двор»',
  'Маркет «Выгодная покупка»',
  'Студия «Линия вкуса»',
  'Сеть «Городской салон»',
  'Клиника «Добрый доктор»',
  'Магазин «Тёплый дом»',
  'Кафе «Северный берег»',
  'Ателье «Точный крой»',
  'Школа «Новая смена»',
  'Ферма «Солнечный луг»',
  'Сервис «Чистый двор»',
  'Маркет «Выгодная покупка»',
]

export function ClientsMarquee() {
  return (
    <section className="py-12 bg-secondary border-y border-border overflow-hidden">
      <Container className="mb-8">
        <p className="text-center text-text-muted text-sm uppercase tracking-wider">
          Нам доверяют
        </p>
      </Container>
      
      <div className="relative">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-secondary to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-secondary to-transparent z-10" />
        
        {/* Marquee */}
        <div className="flex animate-marquee">
          {clients.map((client, index) => (
            <div 
              key={index}
              className="flex-shrink-0 px-8 md:px-12"
            >
              <span className="text-xl md:text-2xl font-semibold text-text-muted/50 whitespace-nowrap hover:text-text-secondary transition-colors">
                {client}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
