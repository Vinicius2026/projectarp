export type Profile = {
  id: string
  full_name: string | null
  plan_type: string
}

export type Area = {
  id: number
  title: string
  description: string | null
  order: number | null
}

export type Module = {
  id: number
  title: string
  description: string | null
  thumbnail_url: string | null
  area_id: number | null
  plan_access: string
}

export type Lesson = {
  id: number
  title: string
  description_content: string | null
  video_url: string | null
  module_id: number | null
}

export type LessonLink = {
  id: number
  text: string
  url: string
  lesson_id: number | null
}

