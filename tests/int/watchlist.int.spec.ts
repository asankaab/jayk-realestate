import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AccessArgs } from 'payload'
import { Watchlist } from '../../src/collections/Watchlist'

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  find: vi.fn(),
  findByID: vi.fn(),
  create: vi.fn(),
  delete: vi.fn(),
}))
vi.mock('@clerk/nextjs/server', () => ({ auth: mocks.auth }))
vi.mock('@/app/lib/payloadClient', () => ({ payloadClient: mocks }))
import { getWatchlist, setPropertySaved } from '../../src/app/(frontend)/watchlist/actions'

beforeEach(() => {
  vi.resetAllMocks()
  mocks.auth.mockResolvedValue({ userId: 'clerk-one' })
})
const user = { id: 7, clerkId: 'clerk-one', role: 'user' }

describe('watchlist security and persistence', () => {
  it('rejects anonymous reads and writes', async () => {
    mocks.auth.mockResolvedValue({ userId: null })
    await expect(getWatchlist()).rejects.toThrow('sign in')
    await expect(setPropertySaved(10, true)).rejects.toThrow('sign in')
    expect(mocks.find).not.toHaveBeenCalled()
    expect(mocks.create).not.toHaveBeenCalled()
  })
  it('restricts collection reads to the current owner and denies direct writes', () => {
    const args = { req: { user } } as AccessArgs
    expect(Watchlist.access!.read!(args)).toEqual({ owner: { equals: 7 } })
    expect(Watchlist.access!.read!({ req: { user: null } } as AccessArgs)).toBe(false)
    for (const operation of ['create', 'update', 'delete'] as const)
      expect(Watchlist.access![operation]!(args)).toBe(false)
  })
  it('rejects malformed input before accessing the database', async () => {
    await expect(setPropertySaved(-1, true)).rejects.toThrow('Invalid')
    await expect(setPropertySaved(1.5, true)).rejects.toThrow('Invalid')
    await expect(setPropertySaved(1, 'yes' as unknown as boolean)).rejects.toThrow('Invalid')
    expect(mocks.find).not.toHaveBeenCalled()
  })
  it('derives ownership from the session and checks public property access', async () => {
    mocks.find.mockResolvedValueOnce({ docs: [user] }).mockResolvedValueOnce({ docs: [] })
    mocks.findByID.mockResolvedValue({ id: 10 })
    await setPropertySaved(10, true)
    expect(mocks.findByID).toHaveBeenCalledWith(
      expect.objectContaining({ id: 10, overrideAccess: false, user: null }),
    )
    expect(mocks.create).toHaveBeenCalledWith({
      collection: 'watchlist',
      data: { owner: 7, property: 10, saveKey: '7:10' },
    })
  })
  it('does not save unavailable properties', async () => {
    mocks.find.mockResolvedValueOnce({ docs: [user] })
    mocks.findByID.mockRejectedValue(new Error('Not found'))
    await expect(setPropertySaved(10, true)).rejects.toThrow('Not found')
    expect(mocks.create).not.toHaveBeenCalled()
  })
  it('makes repeated saves idempotent', async () => {
    mocks.find.mockResolvedValueOnce({ docs: [user] }).mockResolvedValueOnce({ docs: [{ id: 1 }] })
    await setPropertySaved(10, true)
    expect(mocks.create).not.toHaveBeenCalled()
  })
  it('accepts a concurrent duplicate but preserves other failures', async () => {
    mocks.find
      .mockResolvedValueOnce({ docs: [user] })
      .mockResolvedValueOnce({ docs: [] })
      .mockResolvedValueOnce({ docs: [{ id: 1 }] })
    mocks.create.mockRejectedValue(new Error('Unique constraint'))
    await expect(setPropertySaved(10, true)).resolves.toBeUndefined()
    mocks.find
      .mockResolvedValueOnce({ docs: [user] })
      .mockResolvedValueOnce({ docs: [] })
      .mockResolvedValueOnce({ docs: [] })
    await expect(setPropertySaved(10, true)).rejects.toThrow('Unique constraint')
  })
  it('removes only the authenticated account save, including deleted properties', async () => {
    mocks.find.mockResolvedValueOnce({ docs: [user] })
    await setPropertySaved(10, false)
    expect(mocks.delete).toHaveBeenCalledWith({
      collection: 'watchlist',
      where: { saveKey: { equals: '7:10' } },
    })
    expect(mocks.findByID).not.toHaveBeenCalled()
  })
  it('loads private saves using access control and omits deleted properties', async () => {
    mocks.find
      .mockResolvedValueOnce({ docs: [user] })
      .mockResolvedValueOnce({ docs: [{ property: 10 }, { property: 11 }, { property: 12 }] })
      .mockResolvedValueOnce({ docs: [{ id: 12 }, { id: 10 }] })
    expect(await getWatchlist()).toEqual([{ id: 10 }, { id: 12 }])
    expect(mocks.find).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ collection: 'watchlist', user, overrideAccess: false }),
    )
  })
})
