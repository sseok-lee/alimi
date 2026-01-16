/**
 * 신청 기간 데이터 분류 및 파싱 유틸리티
 */

export type DeadlineType = 'always' | 'period' | 'budget' | 'scheduled' | 'text'

export interface DeadlineInfo {
  type: DeadlineType
  startDate?: Date
  endDate?: Date
  originalText: string
  displayText: string
  daysLeft?: number
  isUrgent?: boolean
  progressPercentage?: number
}

/**
 * 신청 기간 텍스트를 분류
 */
export function classifyDeadline(text: string): DeadlineType {
  if (!text) return 'text'

  // 상시/연중/수시형
  if (/^(상시|연중|수시)$/.test(text.trim()) || /상시\s*신청/.test(text)) {
    return 'always'
  }

  // 예산 소진형
  if (/예산.*소진|선착순|한도.*소진|소진.*까지|조기.*마감|조기.*종료/.test(text)) {
    return 'budget'
  }

  // 예정/미정형
  if (/예정|미정|공고\s*(참고|확인)|별도\s*공고|추후/.test(text)) {
    return 'scheduled'
  }

  // 기간형 (~가 있고 날짜 파싱 가능)
  if (text.includes('~')) {
    const parsed = parseDateRange(text)
    if (parsed.startDate || parsed.endDate) {
      return 'period'
    }
  }

  return 'text'
}

/**
 * 다양한 날짜 형식 파싱
 * 지원 형식:
 * - 2025.01.01
 * - 2025-01-01
 * - 2025. 1. 1.
 * - 20250101
 * - 2025년 1월 1일
 */
function parseKoreanDate(dateStr: string): Date | null {
  if (!dateStr) return null

  // 공백 및 마침표 정리
  const cleaned = dateStr.trim().replace(/\.$/, '')

  // 형식 1: 2025.01.01 또는 2025.1.1
  let match = cleaned.match(/(\d{4})\.(\d{1,2})\.(\d{1,2})/)
  if (match) {
    const [, year, month, day] = match
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  }

  // 형식 2: 2025-01-01
  match = cleaned.match(/(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (match) {
    const [, year, month, day] = match
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  }

  // 형식 3: 2025. 1. 1 (공백 포함)
  match = cleaned.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/)
  if (match) {
    const [, year, month, day] = match
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  }

  // 형식 4: 20250101 (연속 숫자)
  match = cleaned.match(/^(\d{4})(\d{2})(\d{2})$/)
  if (match) {
    const [, year, month, day] = match
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  }

  // 형식 5: 2025년 1월 1일
  match = cleaned.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일?/)
  if (match) {
    const [, year, month, day] = match
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  }

  // 형식 6: 25.1.1 (2자리 연도)
  match = cleaned.match(/^(\d{2})\.(\d{1,2})\.(\d{1,2})/)
  if (match) {
    const [, year, month, day] = match
    const fullYear = parseInt(year) + 2000
    return new Date(fullYear, parseInt(month) - 1, parseInt(day))
  }

  return null
}

/**
 * 날짜 범위 파싱 (시작일 ~ 종료일)
 */
export function parseDateRange(text: string): { startDate?: Date, endDate?: Date } {
  if (!text || !text.includes('~')) {
    return {}
  }

  // ~ 기준으로 분리
  const parts = text.split('~').map(p => p.trim())

  if (parts.length < 2) {
    return {}
  }

  const startDate = parseKoreanDate(parts[0])
  const endDate = parseKoreanDate(parts[1])

  return {
    startDate: startDate && !isNaN(startDate.getTime()) ? startDate : undefined,
    endDate: endDate && !isNaN(endDate.getTime()) ? endDate : undefined,
  }
}

/**
 * D-Day 계산
 */
export function calculateDaysLeft(endDate: Date): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(endDate)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * 진행률 계산
 */
export function calculateProgress(startDate: Date, endDate: Date): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0)

  const totalDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  const elapsed = (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)

  if (totalDays <= 0) return 100

  const percentage = (elapsed / totalDays) * 100
  return Math.min(100, Math.max(0, Math.round(percentage)))
}

/**
 * 날짜 포맷팅 (간결하게)
 */
export function formatDateShort(date: Date): string {
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}.${day}`
}

/**
 * 날짜 포맷팅 (연도 포함)
 */
export function formatDateFull(date: Date): string {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * 복합 기간 텍스트 정리 (○, -, · 등으로 구분된 항목을 줄바꿈으로 변환)
 */
function formatMultiLineText(text: string): string {
  return text
    .replace(/○\s*/g, '\n○ ') // ○ 앞에 줄바꿈 추가
    .replace(/●\s*/g, '\n● ')
    .replace(/\s*-\s*(?=[가-힣])/g, '\n- ') // 한글 앞의 - 는 줄바꿈
    .trim()
    .replace(/^\n+/, '') // 맨 앞 줄바꿈 제거
}

/**
 * 신청 기간 정보 분석
 */
export function analyzeDeadline(text: string | null): DeadlineInfo {
  if (!text || text.trim() === '') {
    return {
      type: 'text',
      originalText: '',
      displayText: '',
    }
  }

  const type = classifyDeadline(text)
  const info: DeadlineInfo = {
    type,
    originalText: text,
    displayText: formatMultiLineText(text), // 복합 텍스트 정리
  }

  if (type === 'period') {
    const { startDate, endDate } = parseDateRange(text)
    info.startDate = startDate
    info.endDate = endDate

    if (endDate) {
      info.daysLeft = calculateDaysLeft(endDate)
      info.isUrgent = info.daysLeft >= 0 && info.daysLeft <= 7

      if (startDate) {
        info.progressPercentage = calculateProgress(startDate, endDate)
        info.displayText = `${formatDateShort(startDate)} ~ ${formatDateShort(endDate)}`
      } else {
        info.displayText = `~ ${formatDateFull(endDate)}`
      }
    } else if (startDate) {
      info.displayText = `${formatDateFull(startDate)} ~`
    }
  } else if (type === 'always') {
    info.displayText = '상시 신청'
  } else if (type === 'budget') {
    // 시작일이 있으면 추출
    const { startDate } = parseDateRange(text)
    if (startDate) {
      info.startDate = startDate
      info.displayText = `${formatDateFull(startDate)} ~`
    }
  }

  return info
}
