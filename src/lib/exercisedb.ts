const BASE_URL = 'https://wger.de/api/v2'
const LANGUAGE_EN = 2

interface WgerMuscle {
  name_en: string
}

interface WgerEquipment {
  id: number
  name: string
}

interface WgerTranslation {
  name: string
  description: string
  description_source: string
  language: number
}

interface WgerImage {
  image: string
  is_main: boolean
}

interface WgerCategory {
  id: number
  name: string
}

interface WgerExerciseRaw {
  id: number
  category: WgerCategory
  muscles: WgerMuscle[]
  muscles_secondary: WgerMuscle[]
  equipment: WgerEquipment[]
  images: WgerImage[]
  translations: WgerTranslation[]
}

interface WgerListResponse<T> {
  count: number
  results: T[]
}

export interface Exercise {
  id: string
  name: string
  bodyPart: string
  target: string
  equipment: string
  gifUrl?: string
  instructions: string[]
  secondaryMuscles: string[]
  description?: string
}

function parseInstructions(html: string): string[] {
  if (!html) return []
  const liMatches = html.match(/<li[^>]*>([\s\S]*?)<\/li>/gi)
  if (liMatches?.length) {
    return liMatches.map(li => li.replace(/<[^>]*>/g, '').trim()).filter(Boolean)
  }
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return text ? [text] : []
}

function mapExercise(raw: WgerExerciseRaw): Exercise | null {
  const translation = raw.translations.find(t => t.language === LANGUAGE_EN) ?? raw.translations[0]
  if (!translation?.name) return null

  const primaryMuscle = raw.muscles[0]?.name_en || raw.category.name
  const equipmentName = raw.equipment[0]?.name ?? 'body weight'
  const image = raw.images.find(img => img.is_main) ?? raw.images[0]

  return {
    id: String(raw.id),
    name: translation.name,
    bodyPart: raw.category.name.toLowerCase(),
    target: primaryMuscle,
    equipment: equipmentName.replace('none (bodyweight exercise)', 'body weight'),
    gifUrl: image?.image,
    instructions: parseInstructions(translation.description),
    secondaryMuscles: raw.muscles_secondary.map(m => m.name_en).filter(Boolean),
    description: translation.description_source || undefined,
  }
}

export async function getExercises(limit = 20, offset = 0): Promise<Exercise[]> {
  const res = await fetch(
    `${BASE_URL}/exerciseinfo/?format=json&language=${LANGUAGE_EN}&limit=${limit}&offset=${offset}`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) throw new Error('Failed to fetch exercises')
  const data: WgerListResponse<WgerExerciseRaw> = await res.json()
  return data.results.map(mapExercise).filter((e): e is Exercise => e !== null)
}

export async function getExerciseById(id: string): Promise<Exercise> {
  const res = await fetch(
    `${BASE_URL}/exerciseinfo/${id}/?format=json`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) throw new Error('Failed to fetch exercise')
  const raw: WgerExerciseRaw = await res.json()
  const exercise = mapExercise(raw)
  if (!exercise) throw new Error('Exercise not found or no translation available')
  return exercise
}

export async function getExercisesByBodyPart(bodyPart: string, limit = 20, offset = 0): Promise<Exercise[]> {
  const categories = await fetchCategories()
  const category = categories.find(c => c.name.toLowerCase() === bodyPart.toLowerCase())
  if (!category) return getExercises(limit, offset)

  const res = await fetch(
    `${BASE_URL}/exerciseinfo/?format=json&language=${LANGUAGE_EN}&category=${category.id}&limit=${limit}&offset=${offset}`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) throw new Error('Failed to fetch exercises by category')
  const data: WgerListResponse<WgerExerciseRaw> = await res.json()
  return data.results.map(mapExercise).filter((e): e is Exercise => e !== null)
}

export async function searchExercisesByName(name: string, limit = 20, offset = 0): Promise<Exercise[]> {
  // Wger has no server-side text search — fetch full dataset (cached 24h) and filter in-process
  const res = await fetch(
    `${BASE_URL}/exerciseinfo/?format=json&language=${LANGUAGE_EN}&limit=1000&offset=0`,
    { next: { revalidate: 86400 } }
  )
  if (!res.ok) throw new Error('Failed to search exercises')
  const data: WgerListResponse<WgerExerciseRaw> = await res.json()
  const all = data.results.map(mapExercise).filter((e): e is Exercise => e !== null)
  const q = name.toLowerCase()
  const filtered = all.filter(e =>
    e.name.toLowerCase().includes(q) ||
    e.bodyPart.includes(q) ||
    e.target.toLowerCase().includes(q)
  )
  return filtered.slice(offset, offset + limit)
}

async function fetchCategories(): Promise<WgerCategory[]> {
  const res = await fetch(
    `${BASE_URL}/exercisecategory/?format=json`,
    { next: { revalidate: 86400 } }
  )
  if (!res.ok) throw new Error('Failed to fetch categories')
  const data: WgerListResponse<WgerCategory> = await res.json()
  return data.results
}

export async function getBodyPartList(): Promise<string[]> {
  const categories = await fetchCategories()
  return categories.map(c => c.name.toLowerCase())
}

export async function getExercisesByTarget(_target: string, limit = 20, offset = 0): Promise<Exercise[]> {
  return getExercises(limit, offset)
}

export async function getEquipmentList(): Promise<string[]> {
  return []
}
