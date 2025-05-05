/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useGetUser.ts
import { useState, useEffect, useCallback } from 'react'

export function useGetUserName(userId: number | null) {

  /* useStates */
  const [userName, setUserName] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = useCallback(async () => {

      // Check if userId is valid
      if (userId === null || isNaN(userId) || userId < 1) {
        setError('Invalid user ID')
        setUserName(null)
        return
      }

      // Set loading and error states
      setLoading(true)
      setError(null)

      // Fetch user data
      try {
          const res = await fetch( `${import.meta.env.VITE_USER_API_BASEURL_EXTERNAL}/${userId}`, {
            credentials: 'include'
          })

          // Check if response is ok
          if (!res.ok)
            throw new Error('User not found')
          
          const { alias } = (await res.json())
          setUserName(alias)
          
      } catch (err: any) {
          setError(err.message || 'Error')
          setUserName(null)
      } finally {
        setLoading(false)
      }
  }, [userId])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return { userName, loading, error }
}
