import { z } from 'zod'

export const createMenuSchema = z.object({
  date: z.string(),
  branchSlug: z.string(),
})

export const updateMenuSchema = z.object({
  slug: z.string(),
  date: z.string(),
  branchSlug: z.string(),
})

export type TCreateMenuSchema = z.infer<typeof createMenuSchema>
export type TUpdateMenuSchema = z.infer<typeof updateMenuSchema>