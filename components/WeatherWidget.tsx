'use client'
import { useState, useEffect } from 'react'

const WMO_CODES: Record<number, { label: string; icon: string }> = {
  0:  { label: 'Vedro',                icon: '☀️'  },
  1:  { label: 'Pretežno vedro',       icon: '🌤️' },
  2:  { label: 'Delimično oblačno',    icon: '⛅'  },
  3:  { label: 'Oblačno',              icon: '☁️'  },
  45: { label: 'Magla',                icon: '🌫️' },
  48: { label: 'Magla sa mrazom',      icon: '🌫️' },
  51: { label: 'Sitna kiša',           icon: '🌦️' },
  53: { label: 'Kiša',                 icon: '🌧️' },
  55: { label: 'Jaka kiša',            icon: '🌧️' },
  61: { label: 'Pljusak',              icon: '🌧️' },
  63: { label: 'Jak pljusak',          icon: '⛈️' },
  65: { label: 'Obilna kiša',          icon: '⛈️' },
  71: { label: 'Sneg',                 icon: '🌨️' },
  73: { label: 'Umeren sneg',          icon: '❄️'  },
  75: { label: 'Jak sneg',             icon: '❄️'  },
  80: { label: 'Pljuskovi',            icon: '🌦️' },
  81: { label: 'Jaki pljuskovi',       icon: '⛈️' },
  95: { label: 'Grmljavina',           icon: '⛈️' },
  99: { label: 'Grmljavina sa gradom', icon: '⛈️' },
}

// Saveti po kategoriji i vremenskim uslovima
const CATEGORY_ADVICE: Record<string, Record<string, { text: string; color: string }>> = {
  ribolov: {
    odlicno:    { text: '🎣 Odlični uslovi za ribolov!', color: 'text-green-700' },
    oblacno:    { text: '🎣 Oblačno — idealno za ribolov, riba aktivnija', color: 'text-green-700' },
    kisa:       { text: '🌧️ Kiša — ribolov moguć, ali pazi na munjevine', color: 'text-yellow-700' },
    sneg:       { text: '❄️ Sneg — podledički ribolov za iskusne', color: 'text-blue-700' },
    grmljavina: { text: '⛈️ Grmljavina — ne idi na vodu!', color: 'text-red-700' },
    vrucina:    { text: '🥵 Velika vrućina — ribolov rano ujutru ili uveče', color: 'text-orange-700' },
    mraz:       { text: '🥶 Mraz — topla oprema obavezna', color: 'text-blue-700' },
  },
  lov: {
    odlicno:    { text: '🦌 Dobri uslovi za lov!', color: 'text-green-700' },
    oblacno:    { text: '🦌 Oblačno — divljač aktivnija, odlično za lov', color: 'text-green-700' },
    kisa:       { text: '🌧️ Kiša — lov moguć, divljač se kreće', color: 'text-yellow-700' },
    sneg:       { text: '❄️ Sneg — trag divljači vidljiv, dobri uslovi', color: 'text-blue-700' },
    grmljavina: { text: '⛈️ Grmljavina — ostani u zaklonu!', color: 'text-red-700' },
    vrucina:    { text: '🥵 Velika vrućina — divljač se krije, izbegavaj podne', color: 'text-orange-700' },
    mraz:       { text: '🥶 Mraz — topla oprema obavezna za lov', color: 'text-blue-700' },
  },
  kampovanje: {
    odlicno:    { text: '⛺ Savršeni uslovi za kampovanje!', color: 'text-green-700' },
    oblacno:    { text: '⛺ Oblačno — ugodno za kampovanje', color: 'text-green-700' },
    kisa:       { text: '🌧️ Kiša — proveri da li šator propušta vodu', color: 'text-yellow-700' },
    sneg:       { text: '❄️ Sneg — zimsko kampovanje za iskusne', color: 'text-blue-700' },
    grmljavina: { text: '⛈️ Grmljavina — skloni se u automobil ili zgradu!', color: 'text-red-700' },
    vrucina:    { text: '🥵 Velika vrućina — hladovina i hidratacija su prioritet', color: 'text-orange-700' },
    mraz:       { text: '🥶 Mraz — vreća za spavanje minimum -10°C', color: 'text-blue-700' },
  },
  planinarenje: {
    odlicno:    { text: '🥾 Odlični uslovi za planinarenje!', color: 'text-green-700' },
    oblacno:    { text: '🥾 Oblačno — prohladnije, ugodno za planinarenje', color: 'text-green-700' },
    kisa:       { text: '🌧️ Kiša — staze klizave, pazi na sigurnost', color: 'text-yellow-700' },
    sneg:       { text: '❄️ Sneg — potrebna specijalna oprema, čekaj izveštaj', color: 'text-blue-700' },
    grmljavina: { text: '⛈️ Grmljavina — siđi s planine odmah!', color: 'text-red-700' },
    vrucina:    { text: '🥵 Velika vrućina — kreni rano, ponesi dovoljno vode', color: 'text-orange-700' },
    mraz:       { text: '🥶 Mraz — opasnost od zaleđenih staza', color: 'text-blue-700' },
  },
  kajak: {
    odlicno:    { text: '🚣 Savršeni uslovi za kajak i kupanje!', color: 'text-green-700' },
    oblacno:    { text: '🚣 Oblačno — dobri uslovi za kajak', color: 'text-green-700' },
    kisa:       { text: '🌧️ Kiša — kajak moguć, ali pazi na bujice', color: 'text-yellow-700' },
    sneg:       { text: '❄️ Sneg — voda hladna, odložite izlazak', color: 'text-blue-700' },
    grmljavina: { text: '⛈️ Grmljavina — odmah izađi iz vode!', color: 'text-red-700' },
    vrucina:    { text: '☀️ Odlično za kupanje i kajak!', color: 'text-green-700' },
    mraz:       { text: '🥶 Mraz — voda opasno hladna', color: 'text-blue-700' },
  },
  'nacionalni-parkovi': {
    odlicno:    { text: '🦋 Odlični uslovi za posetu nacionalni parku!', color: 'text-green-700' },
    oblacno:    { text: '🦋 Oblačno — životinje aktivnije, dobro za posmatranje', color: 'text-green-700' },
    kisa:       { text: '🌧️ Kiša — staze mokre, ponesi kapu i kabanicu', color: 'text-yellow-700' },
    sneg:       { text: '❄️ Sneg — zimski pejzaž, ali proveri radno vreme', color: 'text-blue-700' },
    grmljavina: { text: '⛈️ Grmljavina — odloži posetu nacionalni parku', color: 'text-red-700' },
    vrucina:    { text: '🥵 Vrućina — ponesi vodu i šešir', color: 'text-orange-700' },
    mraz:       { text: '🥶 Mraz — topla odeća obavezna', color: 'text-blue-700' },
  },
}

function getAdvice(code: number, temp: number, category: string) {
  const cat = CATEGORY_ADVICE[category] ?? CATEGORY_ADVICE['kampovanje']

  if ([95, 99].includes(code))            return cat.grmljavina
  if ([71, 73, 75].includes(code))        return cat.sneg
  if ([51,53,55,61,63,65,80,81].includes(code)) return cat.kisa
  if ([2, 3, 45, 48].includes(code))      return cat.oblacno
  if (temp > 33)                           return cat.vrucina
  if (temp < 0)                            return cat.mraz
  return cat.odlicno
}

function getWeatherInfo(code: number) {
  return WMO_CODES[code] ?? { label: 'Nepoznato', icon: '🌡️' }
}

// ISPRAVNI DANI — koristi JS Date da dobije pravi dan
const DAYS_SR = ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub']

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const months = ['jan','feb','mar','apr','maj','jun','jul','avg','sep','okt','nov','dec']
  return `${day}/${months[month - 1]}`
}

function getDayLabel(dateStr: string, index: number): string {
  if (index === 0) return 'Danas'
  if (index === 1) return 'Sutra'
  // Parsiraj datum direktno iz stringa (YYYY-MM-DD)
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return DAYS_SR[date.getDay()]
}

interface DayForecast {
  date:          string
  dayLabel:      string
  maxTemp:       number
  minTemp:       number
  weathercode:   number
  precipitation: number
  windspeed:     number
  dateFormatted: string
}

interface CurrentWeather {
  temperature:   number
  weathercode:   number
  windspeed:     number
  humidity:      number
  apparent_temp: number
}

interface Props {
  lat:          number
  lng:          number
  locationName: string
  category?:    string   // 'ribolov' | 'lov' | 'kampovanje' | 'planinarenje' | 'kajak' | 'nacionalni-parkovi'
}

export default function WeatherWidget({ lat, lng, locationName, category = 'kampovanje' }: Props) {
  const [current,  setCurrent]  = useState<CurrentWeather | null>(null)
  const [forecast, setForecast] = useState<DayForecast[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(false)
  const [tab,      setTab]      = useState<'now' | 'week'>('now')

  useEffect(() => {
    async function fetchWeather() {
      try {
        const url =
          `https://api.open-meteo.com/v1/forecast?` +
          `latitude=${lat}&longitude=${lng}` +
          `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weathercode,windspeed_10m` +
          `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max` +
          `&timezone=Europe%2FBelgrade&forecast_days=7`

        const res  = await fetch(url)
        const data = await res.json()
        const c    = data.current

        setCurrent({
          temperature:   Math.round(c.temperature_2m),
          weathercode:   c.weathercode,
          windspeed:     Math.round(c.windspeed_10m),
          humidity:      c.relative_humidity_2m,
          apparent_temp: Math.round(c.apparent_temperature),
        })

        // ISPRAVNO parsiranje dana — direktno iz datuma
        const days: DayForecast[] = data.daily.time.map((dateStr: string, i: number) => ({
          date:          dateStr,
          dayLabel:      getDayLabel(dateStr, i),
          maxTemp:       Math.round(data.daily.temperature_2m_max[i]),
          minTemp:       Math.round(data.daily.temperature_2m_min[i]),
          weathercode:   data.daily.weathercode[i],
          precipitation: Math.round(data.daily.precipitation_sum[i] * 10) / 10,
          windspeed:     Math.round(data.daily.windspeed_10m_max[i]),
          dateFormatted: formatDate(dateStr),
        }))

        setForecast(days)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchWeather()
  }, [lat, lng])

  if (loading) return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 animate-pulse">
      <div className="h-4 bg-blue-200 rounded w-40 mb-3"/>
      <div className="h-10 bg-blue-200 rounded w-28 mb-2"/>
      <div className="h-3 bg-blue-200 rounded w-full"/>
    </div>
  )

  if (error || !current) return null

  const info   = getWeatherInfo(current.weathercode)
  const advice = getAdvice(current.weathercode, current.temperature, category)

  return (
    <div className="bg-gradient-to-br from-sky-50 to-blue-100 border border-blue-200
                    rounded-2xl overflow-hidden mb-6">

      {/* Tabovi */}
      <div className="flex border-b border-blue-200">
        <button onClick={() => setTab('now')}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors
            ${tab === 'now' ? 'bg-blue-600 text-white' : 'text-blue-700 hover:bg-blue-50'}`}>
          🌡️ Sada
        </button>
        <button onClick={() => setTab('week')}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors
            ${tab === 'week' ? 'bg-blue-600 text-white' : 'text-blue-700 hover:bg-blue-50'}`}>
          📅 7 dana
        </button>
      </div>

      <div className="p-5">

        {/* ═══ TAB: SADA ═══ */}
        {tab === 'now' && (
          <>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{info.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                    Trenutno vreme
                  </p>
                  <p className="text-xs text-blue-500 truncate max-w-[160px]">{locationName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-blue-900">{current.temperature}°C</p>
                <p className="text-xs text-blue-400">oseća se {current.apparent_temp}°C</p>
              </div>
            </div>

            <p className="text-sm font-medium text-blue-800 mb-3">{info.label}</p>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-white/60 rounded-xl px-3 py-2 flex items-center gap-2">
                <span>💨</span>
                <div>
                  <p className="text-xs text-gray-500">Vetar</p>
                  <p className="text-sm font-semibold">{current.windspeed} km/h</p>
                </div>
              </div>
              <div className="bg-white/60 rounded-xl px-3 py-2 flex items-center gap-2">
                <span>💧</span>
                <div>
                  <p className="text-xs text-gray-500">Vlaga</p>
                  <p className="text-sm font-semibold">{current.humidity}%</p>
                </div>
              </div>
            </div>

            {/* Savet prilagođen kategoriji */}
            <div className="bg-white/70 rounded-xl px-3 py-2.5">
              <p className={`text-sm font-medium ${advice.color}`}>{advice.text}</p>
            </div>
          </>
        )}

        {/* ═══ TAB: 7 DANA ═══ */}
        {tab === 'week' && (
          <div className="space-y-2">
            {forecast.map((day, i) => {
              const wi      = getWeatherInfo(day.weathercode)
              const isToday = i === 0
              return (
                <div key={day.date}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors
                    ${isToday ? 'bg-blue-600 text-white' : 'bg-white/60 hover:bg-white/80'}`}>

                  <div className="w-20 shrink-0">
                    <span className={`text-sm font-bold block ${isToday ? 'text-white' : 'text-gray-700'}`}>
                      {day.dayLabel}
                    </span>
                    <span className={`text-xs ${isToday ? 'text-blue-200' : 'text-gray-400'}`}>
                      {day.dateFormatted}
                    </span>
                  </div>

                  <span className="text-xl w-8 text-center shrink-0">{wi.icon}</span>

                  <span className={`text-xs flex-1 hidden sm:block truncate
                    ${isToday ? 'text-blue-100' : 'text-gray-500'}`}>
                    {wi.label}
                  </span>

                  {day.precipitation > 0 ? (
                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0
                      ${isToday ? 'bg-blue-500 text-blue-100' : 'bg-blue-100 text-blue-700'}`}>
                      💧{day.precipitation}mm
                    </span>
                  ) : (
                    <span className="w-16 shrink-0 hidden sm:block"/>
                  )}

                  <div className="text-right shrink-0 w-14">
                    <span className={`text-sm font-bold ${isToday ? 'text-white' : 'text-gray-800'}`}>
                      {day.maxTemp}°
                    </span>
                    <span className={`text-xs ml-1 ${isToday ? 'text-blue-200' : 'text-gray-400'}`}>
                      {day.minTemp}°
                    </span>
                  </div>

                  <span className={`text-xs w-14 text-right shrink-0 hidden sm:block
                    ${isToday ? 'text-blue-200' : 'text-gray-400'}`}>
                    💨{day.windspeed}
                  </span>
                </div>
              )
            })}

            {/* Savet za danas prilagođen kategoriji */}
            {forecast[0] && (
              <div className="bg-white/70 rounded-xl px-3 py-2.5 mt-1">
                <p className={`text-sm font-medium ${getAdvice(forecast[0].weathercode, forecast[0].maxTemp, category).color}`}>
                  {getAdvice(forecast[0].weathercode, forecast[0].maxTemp, category).text}
                </p>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-blue-400 mt-3 text-right">
          Open-Meteo · {new Date().toLocaleTimeString('sr-Latn-RS', {
            hour: '2-digit', minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  )
}
